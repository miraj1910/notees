"use client";

import { useNotes } from "@/components/NotesProvider";

export default function NewNoteButton() {
  const { createNote, isCreatingNote } = useNotes();

  return (
    <button
      onClick={createNote}
      disabled={isCreatingNote}
      className="sidebar-new-btn"
      aria-label="Create new note"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {isCreatingNote ? "Creating..." : "New Note"}
    </button>
  );
}
