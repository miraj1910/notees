import type { Note } from "../types/note";
import { appState } from "./app-state";

export const noteState = {
  get notesCache(): Note[] {
    return appState.notesCache;
  },

  set notesCache(value: Note[]) {
    appState.notesCache = value;
  },

  find(id: string): Note | undefined {
    return appState.findCachedNote(id);
  },

  update(id: string | null, updates: Partial<Pick<Note, "title" | "content" | "updatedAt">>): void {
    appState.updateCachedNote(id, updates);
  },

  replaceTempId(tempId: string, realId: string): void {
    appState.replaceTempId(tempId, realId);
  },

  remove(id: string): void {
    appState.removeNoteFromCache(id);
  },

  unshift(note: Note): void {
    appState.notesCache.unshift(note);
  },

  setCache(notes: Note[]): void {
    appState.notesCache = notes;
  },

  snapshot(): Note[] {
    return [...appState.notesCache];
  },
};
