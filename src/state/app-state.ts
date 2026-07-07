import type { Note } from "../types/note";

export interface AppStateSnapshot {
  token: string;
  currentNoteId: string | null;
  isCreatingNote: boolean;
  isSaving: boolean;
  hasPendingSave: boolean;
  activeOpenRequestId: number;
  notesCache: Note[];
}

class AppState {
  token = "";
  currentNoteId: string | null = null;
  isCreatingNote = false;
  isSaving = false;
  hasPendingSave = false;
  activeOpenRequestId = 0;
  activeOpenController: AbortController | null = null;
  notesCache: Note[] = [];

  snapshot(): AppStateSnapshot {
    return {
      token: this.token,
      currentNoteId: this.currentNoteId,
      isCreatingNote: this.isCreatingNote,
      isSaving: this.isSaving,
      hasPendingSave: this.hasPendingSave,
      activeOpenRequestId: this.activeOpenRequestId,
      notesCache: [...this.notesCache],
    };
  }

  nextOpenRequestId(): number {
    this.activeOpenRequestId += 1;
    return this.activeOpenRequestId;
  }

  abortActiveRequest(): void {
    this.activeOpenController?.abort();
    this.activeOpenController = null;
  }

  setNewController(): AbortController {
    this.abortActiveRequest();
    const controller = new AbortController();
    this.activeOpenController = controller;
    return controller;
  }

  clearActiveController(requestId: number): void {
    if (requestId === this.activeOpenRequestId) {
      this.activeOpenController = null;
    }
  }

  updateCachedNote(
    id: string | null,
    updates: Partial<Pick<Note, "title" | "content" | "updatedAt">>,
  ): void {
    if (!id) return;
    this.notesCache = this.notesCache.map((note) =>
      note.id === id ? { ...note, ...updates } : note,
    );
  }

  findCachedNote(id: string): Note | undefined {
    return this.notesCache.find((n) => n.id === id);
  }

  replaceTempId(tempId: string, realId: string): void {
    this.notesCache = this.notesCache.map((note) =>
      note.id === tempId ? { ...note, id: realId } : note,
    );
  }

  removeNoteFromCache(id: string): void {
    this.notesCache = this.notesCache.filter((note) => note.id !== id);
  }
}

export const appState = new AppState();
