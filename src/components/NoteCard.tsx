"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, MoreHorizontal } from "lucide-react";
import type { Note } from "@/types/note";
import { useStore } from "@/store/useStore";
import { formatRelativeTime } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const activeNoteId = useStore((s) => s.activeNoteId);
  const setActiveNote = useStore((s) => s.setActiveNote);
  const deleteNote = useStore((s) => s.deleteNote);

  const isActive = note.id === activeNoteId;

  const handleClick = useCallback(() => {
    setActiveNote(note.id);
  }, [note.id, setActiveNote]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteNote(note.id);
    },
    [note.id, deleteNote],
  );

  return (
    <motion.div
      onClick={handleClick}
      className={`group relative flex items-start gap-3 px-[14px] py-[14px] rounded-[12px] cursor-pointer border transition-all duration-200 ${
        isActive
          ? "bg-[#F4E1C8] border-[#DFC1A0] shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
          : "bg-white border-transparent hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-[rgba(0,0,0,0.04)]"
      }`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -1 }}
    >
      <div
        className={`flex-shrink-0 w-[34px] h-[34px] rounded-[8px] flex items-center justify-center mt-[2px] ${
          isActive
            ? "bg-[rgba(182,120,66,0.15)] text-[#8E6D4F]"
            : "bg-[rgba(182,120,66,0.07)] text-[#B67842]"
        }`}
      >
        <FileText size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-[#2F2923] truncate leading-snug">
          {note.title || "Untitled"}
        </div>
        <div className="text-[11px] text-[rgba(122,111,103,0.55)] mt-[3px] font-normal">
          {formatRelativeTime(new Date(note.updatedAt))}
        </div>
      </div>

      <motion.button
        onClick={handleDelete}
        className="flex-shrink-0 w-[26px] h-[26px] rounded-[6px] flex items-center justify-center text-[rgba(122,111,103,0.4)] opacity-0 group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.04)] hover:text-[#D95858] transition-all duration-150 mt-[2px]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MoreHorizontal size={14} />
      </motion.button>
    </motion.div>
  );
}
