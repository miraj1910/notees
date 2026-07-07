import type { Note, NoteData } from "../types/note";
import { appState } from "../state/app-state";
import { cacheService } from "./cache.service";
import { driveService } from "./drive.service";
import { DEFAULT_TITLE, TEMP_PREFIX } from "../config/constants";
import { isTemporaryNoteId } from "../utils/validation";
import { logger } from "../utils/logger";

type StatusCallback = (status: string) => void;

class NotesService {
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
      const files = await driveService.listNotes();
      const notes: Note[] = files.map((file) => ({
        id: file.id,
        title: file.name || DEFAULT_TITLE,
        content: null,
        createdAt: file.createdTime || new Date().toISOString(),
        updatedAt: file.modifiedTime || new Date().toISOString(),
      }));
      cacheService.setNotes(notes);
      this.onNotesChanged?.();
      this.onStatus?.("Ready");
    } catch (error) {
      logger.error(error);
      this.onStatus?.("Failed to load notes");
    }
  }

  async open(id: string): Promise<void> {
    const requestId = appState.nextOpenRequestId();
    appState.abortActiveRequest();
    const controller = appState.setNewController();

    try {
      appState.currentNoteId = id;
      this.onNotesChanged?.();

      const cachedNote = cacheService.findNote(id);
      const initialTitle = cachedNote?.title || DEFAULT_TITLE;

      this.onEditorLoading?.(false);

      if (cachedNote && cachedNote.content !== null) {
        this.onNoteOpened?.({
          title: initialTitle,
          content: cachedNote.content,
        });
        this.onStatus?.("Loaded");
        return;
      }

      this.onEditorLoading?.(true);
      this.onStatus?.("Loading note...");

      const note = await driveService.getNoteContent(id, {
        signal: controller.signal,
      });

      cacheService.updateNote(id, {
        title: note.title || cachedNote?.title || DEFAULT_TITLE,
        content: note.content || "",
      });

      if (requestId !== appState.activeOpenRequestId || appState.currentNoteId !== id) {
        return;
      }

      this.onEditorLoading?.(false);
      this.onNoteOpened?.({
        title: note.title || cachedNote?.title || DEFAULT_TITLE,
        content: note.content || "",
      });
      this.onStatus?.("Loaded");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      logger.error(error);
      if (requestId === appState.activeOpenRequestId) {
        this.onEditorLoading?.(false);
        this.onStatus?.("Failed to open note");
      }
    } finally {
      appState.clearActiveController(requestId);
    }
  }

  async create(): Promise<void> {
    if (appState.isCreatingNote) return;

    appState.isCreatingNote = true;
    this.onStatus?.("Creating...");

    const tempId = `${TEMP_PREFIX}${Date.now()}`;
    const now = new Date().toISOString();
    appState.currentNoteId = tempId;
    cacheService.addOptimistic({
      id: tempId,
      title: DEFAULT_TITLE,
      content: "",
      createdAt: now,
      updatedAt: now,
    });

    this.onEditorLoading?.(false);
    this.onNoteOpened?.({ title: DEFAULT_TITLE, content: "" });
    this.onNotesChanged?.();

    try {
      const file = await driveService.createFile();
      await driveService.uploadContent(file.id, {
        title: DEFAULT_TITLE,
        content: "",
      });

      appState.currentNoteId = file.id;
      cacheService.replaceId(tempId, file.id);
      this.onNotesChanged?.();
      this.onStatus?.("New note ready");
    } catch (error) {
      logger.error(error);
      cacheService.removeNote(tempId);
      if (appState.currentNoteId === tempId) {
        appState.currentNoteId = null;
        this.onEditorReset?.();
      }
      this.onNotesChanged?.();
      this.onStatus?.("Failed to create note");
    } finally {
      appState.isCreatingNote = false;
    }
  }

  private async performSave(id: string, payload: NoteData): Promise<void> {
    appState.isSaving = true;

    try {
      await driveService.saveNoteContent(id, payload);
      cacheService.updateNote(id, {
        ...payload,
        updatedAt: new Date().toISOString(),
      });
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
    if (!id || isTemporaryNoteId(id)) return;

    const payload: NoteData = {
      title: DEFAULT_TITLE,
      content: "",
    };
    this.performSave(id, payload);
  }

  async save(payload: NoteData): Promise<void> {
    const id = appState.currentNoteId;
    if (!id || isTemporaryNoteId(id) || appState.isSaving) {
      if (id && !isTemporaryNoteId(id) && appState.isSaving) {
        appState.hasPendingSave = true;
      }
      return;
    }

    await this.performSave(id, payload);
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
      if (isTemporaryNoteId(id)) {
        this.onStatus?.("Deleted");
        return true;
      }

      await driveService.delete(id);
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
