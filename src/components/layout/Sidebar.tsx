"use client";

import { useNotes } from "@/components/NotesProvider";
import NewNoteButton from "@/components/notes/NewNoteButton";
import NotesList from "@/components/notes/NotesList";

export default function Sidebar() {
  const { notes, saveStatus } = useNotes();

  const noteCount = notes.length;

  return (
    <aside className="sidebar" aria-label="Notes sidebar">
      <p className="sidebar-label">Workspace</p>
      <h2 className="sidebar-heading">Notes</h2>

      <NewNoteButton />

      <div className="sidebar-divider" />

      <div className="sidebar-meta">
        <span className="sidebar-meta-text">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </span>
        <span className="sidebar-meta-dot" />
        <span className="sidebar-meta-text">Drive sync</span>
      </div>

      <NotesList />

      <div className="sidebar-status">
        <span className="sidebar-status-dot" />
        <span className="sidebar-status-text">{saveStatus}</span>
      </div>
    </aside>
  );
}
