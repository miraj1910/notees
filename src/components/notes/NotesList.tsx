"use client";

import { useNotes } from "@/components/NotesProvider";
import NoteCard from "./NoteCard";

export default function NotesList() {
  const { notes, currentNoteId } = useNotes();

  return (
    <div
      className="sidebar-notes-list"
      role="list"
      aria-label="Notes list"
    >
      {notes.length === 0 ? (
        <div className="sidebar-no-notes">
          <p className="sidebar-no-notes-text">No notes yet</p>
          <p className="sidebar-no-notes-sub">Create one to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-1">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === currentNoteId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
