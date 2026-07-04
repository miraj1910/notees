"use client";

import { useNotes } from "@/components/NotesProvider";
import NoteCard from "./NoteCard";

export default function NotesList() {
  const { notes, currentNoteId } = useNotes();

  return (
    <div
      className="flex-1 overflow-y-auto no-scrollbar -mx-1 px-1"
      role="list"
      aria-label="Notes list"
    >
      <div className="flex flex-col gap-2 py-2">
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#7A6F67]">No notes yet</p>
            <p className="text-xs text-[#7A6F67] mt-1">
              Create one to get started
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === currentNoteId}
            />
          ))
        )}
      </div>
    </div>
  );
}
