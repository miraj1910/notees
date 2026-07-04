import type { Note } from "../types/note";
import { appState } from "../state/app-state";

export const cacheService = {
  getNotes(): Note[] {
    return appState.notesCache;
  },

  setNotes(notes: Note[]): void {
    appState.notesCache = notes;
  },

  findNote(id: string): Note | undefined {
    return appState.findCachedNote(id);
  },

  updateNote(id: string | null, updates: Partial<Pick<Note, "title" | "content">>): void {
    appState.updateCachedNote(id, updates);
  },

  addOptimistic(note: Note): void {
    appState.notesCache.unshift(note);
  },

  replaceId(tempId: string, realId: string): void {
    appState.replaceTempId(tempId, realId);
  },

  removeNote(id: string): void {
    appState.removeNoteFromCache(id);
  },

  snapshotNotes(): Note[] {
    return [...appState.notesCache];
  },
};
