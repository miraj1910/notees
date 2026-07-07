"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import NoteCard from "@/components/NoteCard";

export default function Sidebar() {
  const notes = useStore((s) => s.notes);
  const createNote = useStore((s) => s.createNote);
  const saveStatus = useStore((s) => s.saveStatus);

  return (
    <motion.aside
      className="w-[320px] min-w-[320px] h-full flex flex-col z-10"
      style={{
        background: "linear-gradient(180deg, #FAF6EF, #F4EBDD)",
        borderRight: "1px solid #E6D9C9",
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-col h-full px-[28px] py-[28px]">
        <p
          className="text-[12px] tracking-[2px] uppercase font-medium"
          style={{ color: "#8E6D4F" }}
        >
          Workspace
        </p>

        <h1
          className="text-[44px] font-bold leading-[1.1] mt-1 mb-6"
          style={{ color: "#2F2923" }}
        >
          Notes
        </h1>

        <motion.button
          onClick={createNote}
          className="w-full h-[54px] rounded-[10px] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
          style={{
            background: "linear-gradient(180deg, #D58C4C, #BA6E32)",
          }}
          whileHover={{
            y: -2,
            filter: "brightness(1.05)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            transition: { duration: 0.2 },
          }}
          whileTap={{ y: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Plus size={18} strokeWidth={2.5} />
          New Note
        </motion.button>

        <div className="h-px bg-[rgba(0,0,0,0.06)] my-[14px]" />

        <div className="flex items-center gap-2 mb-[10px]">
          <span className="text-[12px] text-[rgba(122,111,103,0.7)] font-normal">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
          <span
            className="w-[3px] h-[3px] rounded-full"
            style={{ background: "rgba(122,111,103,0.3)" }}
          />
          <span className="text-[12px] text-[rgba(122,111,103,0.7)]">
            Drive sync
          </span>
        </div>

        <div className="flex-1 overflow-y-auto -mx-[4px] px-[4px]">
          <AnimatePresence mode="popLayout">
            {notes.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-[13px] text-[rgba(122,111,103,0.6)]">
                  No notes yet
                </p>
                <p className="text-[11px] text-[rgba(122,111,103,0.4)] mt-1">
                  Create one to get started
                </p>
              </motion.div>
            ) : (
              notes.map((note, i) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  className="mb-[4px]"
                >
                  <NoteCard note={note} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-2">
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{
              background: "#4CAF50",
              boxShadow: "0 0 6px rgba(76,175,80,0.3)",
            }}
          />
          <span className="text-[12px] text-[rgba(122,111,103,0.6)]">
            {saveStatus}
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
