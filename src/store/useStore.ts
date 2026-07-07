import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note, SaveStatus } from "@/types/note";
import { generateId } from "@/lib/utils";

const DEFAULT_CONTENT = `<!--note-->

## Things to do

- [ ] Buy groceries
- [ ] Finish project report
- [x] Call dentist
- [ ] Read "The Design of Everyday Things"
- [x] Pay electricity bill

## Ideas

> Design is not just what it looks like and feels like. Design is how it works.
> — Steve Jobs

The new app should feel warm and tactile. Think about the paper texture, the leather grain, the sound of pages turning.

## Links

- [Notion](https://notion.so)
- [Obsidian](https://obsidian.md)
- [Figma](https://figma.com)

Keep writing...`;

interface AppState {
  notes: Note[];
  activeNoteId: string | null;
  saveStatus: SaveStatus;

  createNote: () => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  setActiveNote: (id: string) => void;
  setSaveStatus: (status: SaveStatus) => void;
  getActiveNote: () => Note | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: "demo-1",
          title: "first note",
          content: DEFAULT_CONTENT,
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now() - 3600000,
        } as Note,
      ],
      activeNoteId: "demo-1",
      saveStatus: "Saved",

      createNote: () => {
        const now = Date.now();
        const note: Note = {
          id: generateId(),
          title: "Untitled",
          content: "Start writing...",
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          notes: [note, ...state.notes],
          activeNoteId: note.id,
          saveStatus: "Saved",
        }));
      },

      deleteNote: (id: string) => {
        set((state) => {
          const filtered = state.notes.filter((n) => n.id !== id);
          const nextId =
            filtered.length > 0
              ? state.activeNoteId === id
                ? filtered[0].id
                : state.activeNoteId
              : null;
          return {
            notes: filtered,
            activeNoteId: nextId,
          };
        });
      },

      updateNote: (id: string, data: Partial<Note>) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...data, updatedAt: Date.now() } : n,
          ),
        }));
      },

      setActiveNote: (id: string) => {
        set({ activeNoteId: id });
      },

      setSaveStatus: (status: SaveStatus) => {
        set({ saveStatus: status });
      },

      getActiveNote: () => {
        const state = get();
        return state.notes.find((n) => n.id === state.activeNoteId);
      },
    }),
    {
      name: "notebook-storage",
    },
  ),
);
