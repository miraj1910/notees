import type { Note, NoteData } from "../types/note";
import { appState } from "../state/app-state";
import { cacheService } from "./cache.service";
import { driveService } from "./drive.service";
import { DEFAULT_TITLE } from "../config/constants";
import { logger } from "../utils/logger";

type StatusCallback = (status: string) => void;

function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

class NotesService {
  private notesFileId: string | null = null;
  private onStatus: StatusCallback | null = null;
  private onNotesChanged: (() => void) | null = null;
  private onNoteOpened: ((note: { title: string; content: string }) => void) | null =
    null;
  private onEditorReset: (() => void) | null = null;
  private onEditorLoading: ((loading: boolean) => void) | null = null;

  setCallbacks(cbs: {
    onStatus: StatusCallback;
    onNotesChanged: () => void;
    onNoteOpened: (note: { title: string; content: string }) => void;
    onEditorReset: () => void;
    onEditorLoading: (loading: boolean) => void;
  }): void {
    this.onStatus = cbs.onStatus;
    this.onNotesChanged = cbs.onNotesChanged;
    this.onNoteOpened = cbs.onNoteOpened;
    this.onEditorReset = cbs.onEditorReset;
    this.onEditorLoading = cbs.onEditorLoading;
  }

  async loadAll(): Promise<void> {
    try {
      const file = await driveService.findOrCreateNotesFile();
      this.notesFileId = file.id;

      const notes = await driveService.downloadAllNotes(file.id);
      cacheService.setNotes(notes);
      this.onNotesChanged?.();
      this.onStatus?.("Ready");
    } catch (error) {
      logger.error(error);
      this.onStatus?.("Failed to load notes");
    }
  }

  async open(id: string): Promise<void> {
    appState.currentNoteId = id;
    this.onNotesChanged?.();

    const note = cacheService.findNote(id);
    if (!note) {
      this.onStatus?.("Note not found");
      return;
    }

    this.onEditorLoading?.(false);
    this.onNoteOpened?.({
      title: note.title || DEFAULT_TITLE,
      content: note.content || "",
    });
    this.onStatus?.("Loaded");
  }

  async create(): Promise<void> {
    if (appState.isCreatingNote) return;

    appState.isCreatingNote = true;
    this.onStatus?.("Creating...");

    const id = generateId();
    const now = new Date().toISOString();
    appState.currentNoteId = id;
    cacheService.addOptimistic({
      id,
      title: DEFAULT_TITLE,
      content: "",
      createdAt: now,
      updatedAt: now,
    });

    this.onEditorLoading?.(false);
    this.onNoteOpened?.({ title: DEFAULT_TITLE, content: "" });
    this.onNotesChanged?.();

    try {
      await this.saveAllToDrive();
      this.onNotesChanged?.();
      this.onStatus?.("New note ready");
    } catch (error) {
      logger.error(error);
      cacheService.removeNote(id);
      if (appState.currentNoteId === id) {
        appState.currentNoteId = null;
        this.onEditorReset?.();
      }
      this.onNotesChanged?.();
      this.onStatus?.("Failed to create note");
    } finally {
      appState.isCreatingNote = false;
    }
  }

  private async saveAllToDrive(): Promise<void> {
    if (!this.notesFileId) throw new Error("No notes file ID");
    await driveService.uploadAllNotes(this.notesFileId, cacheService.getNotes());
  }

  async save(payload: NoteData): Promise<void> {
    const id = appState.currentNoteId;
    if (!id || !this.notesFileId) return;

    appState.isSaving = true;

    try {
      cacheService.updateNote(id, {
        title: payload.title,
        content: payload.content,
        updatedAt: new Date().toISOString(),
      });

      await this.saveAllToDrive();
      this.onStatus?.("Saved");
    } catch (error) {
      logger.error(error);
      this.onStatus?.("Save failed");
    } finally {
      appState.isSaving = false;

      if (appState.hasPendingSave) {
        appState.hasPendingSave = false;
        this.flushPendingSave();
      }
    }
  }

  private flushPendingSave(): void {
    const id = appState.currentNoteId;
    if (!id || !this.notesFileId) return;

    const note = cacheService.findNote(id);
    if (!note) return;

    this.save({ title: note.title, content: note.content || "" });
  }

  async remove(id: string): Promise<boolean> {
    const previousNotes = cacheService.snapshotNotes();
    const wasCurrentNote = id === appState.currentNoteId;

    cacheService.removeNote(id);

    if (wasCurrentNote) {
      appState.currentNoteId = null;
      this.onEditorReset?.();
      this.onStatus?.("Deleting...");
    }

    this.onNotesChanged?.();

    try {
      if (!this.notesFileId) {
        this.onStatus?.("Deleted");
        return true;
      }

      await this.saveAllToDrive();
      this.onStatus?.("Deleted");
      return true;
    } catch (error) {
      logger.error(error);
      cacheService.setNotes(previousNotes);
      if (wasCurrentNote) {
        appState.currentNoteId = id;
      }
      this.onNotesChanged?.();
      this.onStatus?.("Delete failed");
      return false;
    }
  }
}

export const notesService = new NotesService();
