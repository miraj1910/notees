"use client";

import { useCallback } from "react";
import type { Note } from "@/types/note";
import { useNotes } from "@/components/NotesProvider";

interface NoteCardProps {
  note: Note;
  isActive: boolean;
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
  const preview = note.content
    ? note.content.replace(/<[^>]*>/g, "").slice(0, 80)
    : "No content yet";

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`group w-full text-left px-4 py-3.5 rounded-[--radius-card] border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8835D]/40 ${
        isActive
          ? "bg-white border-[rgba(184,131,93,0.3)] shadow-sm"
          : "bg-white/60 border-transparent hover:bg-white hover:border-[rgba(0,0,0,0.06)] hover:shadow-sm"
      }`}
      aria-current={isActive ? "true" : undefined}
      aria-label={`Open note: ${title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-[#2D2623] truncate leading-snug">
            {title}
          </h3>
          {note.content !== null && (
            <p className="text-[13px] text-[#7A6F67] mt-1 line-clamp-2 leading-relaxed">
              {preview}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#7A6F67] hover:text-[#D95858] hover:bg-[rgba(217,88,88,0.08)] transition-colors duration-150 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
          aria-label={`Delete note: ${title}`}
          tabIndex={-1}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
