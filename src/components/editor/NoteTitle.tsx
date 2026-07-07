"use client";

import { useNotes } from "@/components/NotesProvider";

export default function NoteTitle() {
  const { titleRef, onTitleChange, activeNote } = useNotes();

  return (
    <input
      ref={titleRef}
      id="note-title"
      type="text"
      className="note-title-input"
      placeholder="Untitled"
      defaultValue={activeNote?.title || ""}
      onInput={onTitleChange}
      aria-label="Note title"
    />
  );
}
