"use client";

import { useNotes } from "@/components/NotesProvider";
import NoteTitle from "./NoteTitle";

export default function EditorCanvas() {
  const { contentRef, onContentChange, activeNote } = useNotes();

  return (
    <div className="flex-1 flex flex-col">
      <NoteTitle />

      <div className="relative flex-1 flex mt-4">
        <textarea
          ref={contentRef}
          id="note-content"
          className="w-full h-full bg-transparent border-none outline-none resize-none text-[#2D2623] text-[16px] leading-[1.85] font-sans placeholder:text-[#7A6F67]/40"
          placeholder="Start writing..."
          defaultValue={activeNote?.content || ""}
          onInput={onContentChange}
          aria-label="Note content"
          style={{ minHeight: "20rem" }}
        />
      </div>
    </div>
  );
}
