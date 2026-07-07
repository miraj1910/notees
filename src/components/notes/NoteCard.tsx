"use client";

import { useCallback } from "react";
import type { Note } from "@/types/note";
import { useNotes } from "@/components/NotesProvider";

interface NoteCardProps {
  note: Note;
  isActive: boolean;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NoteCard({ note, isActive }: NoteCardProps) {
  const { openNote, deleteNote } = useNotes();

  const handleClick = useCallback(() => {
    openNote(note.id);
  }, [openNote, note.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openNote(note.id);
      }
    },
    [openNote, note.id],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteNote(note.id);
    },
    [deleteNote, note.id],
  );

  const title = note.title || "Untitled";
  const time = formatTimestamp(new Date(note.updatedAt || note.createdAt));

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`note-card ${isActive ? "active" : ""}`}
      aria-current={isActive ? "true" : undefined}
      aria-label={`Open note: ${title}`}
    >
      <div className="note-card-icon">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>

      <div className="note-card-body">
        <div className="note-card-title">{title}</div>
        <div className="note-card-time">{time}</div>
      </div>

      <button
        onClick={handleDelete}
        className="note-card-menu"
        aria-label={`Delete note: ${title}`}
        tabIndex={-1}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
    </div>
  );
}
