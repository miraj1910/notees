"use client";

import { useNotes } from "@/components/NotesProvider";

export default function NewNoteButton() {
  const { createNote, isCreatingNote } = useNotes();

  return (
    <button
      onClick={createNote}
      disabled={isCreatingNote}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[--radius-card] bg-[#B8835D] text-white font-medium text-sm hover:bg-[#D4A574] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Create new note"
    >
      <svg
        width="16"
        height="16"
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
