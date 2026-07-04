"use client";

import { useNotes } from "@/components/NotesProvider";

export default function NoteTitle() {
  const { titleRef, onTitleChange, activeNote } = useNotes();

  return (
    <input
      ref={titleRef}
      id="note-title"
      type="text"
      className="w-full bg-transparent border-none outline-none text-[#2D2623] font-serif text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight tracking-[-0.03em] placeholder:text-[#7A6F67]/40 p-0 m-0"
      placeholder="Untitled"
      defaultValue={activeNote?.title || ""}
      onInput={onTitleChange}
      aria-label="Note title"
    />
  );
}
