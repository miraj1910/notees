"use client";

import { useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FileText, Trash2 } from "lucide-react";
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
  const isDeleting = useRef(false);

  const isActive = note.id === activeNoteId;

  const handleClick = useCallback(() => {
    setActiveNote(note.id);
  }, [note.id, setActiveNote]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDeleting.current) return;
      isDeleting.current = true;
      deleteNote(note.id);
    },
    [note.id, deleteNote],
  );

  // Swipe gesture for mobile
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-80, -40, 0, 40, 80],
    ["rgba(217,88,88,0.06)", "rgba(217,88,88,0.02)", "transparent", "rgba(76,175,80,0.02)", "rgba(76,175,80,0.06)"],
  );
  const deleteOpacity = useTransform(x, [-80, -20], [1, 0]);
  const pinOpacity = useTransform(x, [20, 80], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -60) {
      if (!isDeleting.current) {
        isDeleting.current = true;
        deleteNote(note.id);
      }
    } else if (info.offset.x > 60) {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[12px]">
      {/* Swipe indicators */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-0">
        <motion.div style={{ opacity: pinOpacity }} className="text-green-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12H8m0 0l-4 4m4-4l-4-4" />
          </svg>
        </motion.div>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-0">
        <motion.div style={{ opacity: deleteOpacity }} className="text-[#D95858]">
          <Trash2 size={18} />
        </motion.div>
      </div>

      <motion.div
        onClick={handleClick}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.3, right: 0.1 }}
        onDragEnd={handleDragEnd}
        style={{ x, background }}
        className={`group relative flex items-start gap-3 px-[14px] py-[14px] rounded-[12px] cursor-pointer border transition-colors duration-200 z-10 touch-pan-y ${
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
          className={`flex-shrink-0 w-[36px] h-[36px] lg:w-[34px] lg:h-[34px] rounded-[8px] flex items-center justify-center mt-[2px] ${
            isActive
              ? "bg-[rgba(182,120,66,0.15)] text-[#8E6D4F]"
              : "bg-[rgba(182,120,66,0.07)] text-[#B67842]"
          }`}
        >
          <FileText size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[15px] lg:text-[14px] font-semibold text-[#2F2923] truncate leading-snug">
            {note.title || "Untitled"}
          </div>
          <div className="text-[12px] lg:text-[11px] text-[rgba(122,111,103,0.55)] mt-[3px] font-normal">
            {formatRelativeTime(new Date(note.updatedAt))}
          </div>
        </div>

        <motion.button
          onClick={handleDelete}
          className="flex-shrink-0 w-[32px] h-[32px] lg:w-[26px] lg:h-[26px] rounded-[8px] flex items-center justify-center text-[rgba(122,111,103,0.4)] opacity-0 group-hover:opacity-100 hover:bg-[rgba(217,88,88,0.08)] hover:text-[#D95858] transition-all duration-150 mt-[2px]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Delete note"
        >
          <Trash2 size={14} />
        </motion.button>
      </motion.div>
    </div>
  );
}
