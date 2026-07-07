export interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: number | string;
  updatedAt: number | string;
}

export interface NoteData {
  title: string;
  content: string;
}

export type SaveStatus = "Saved" | "Saving..." | "Unsaved Changes" | "Error Saving";
