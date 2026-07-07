"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Archive, Settings } from "lucide-react";
import { useStore } from "@/store/useStore";
import NoteCard from "@/components/NoteCard";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function Drawer({ open, onClose }: DrawerProps) {
  const notes = useStore((s) => s.notes);
  const createNote = useStore((s) => s.createNote);
  const saveStatus = useStore((s) => s.saveStatus);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleCreateAndClose = () => {
    createNote();
    onClose();
  };

  const handleBackdropTap = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={handleBackdropTap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            className="absolute top-0 left-0 bottom-0 flex flex-col z-10"
            style={{
              width: "85%",
              maxWidth: "340px",
              background: "linear-gradient(180deg, #FAF6EF, #F4EBDD)",
              borderRight: "1px solid #E6D9C9",
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex flex-col h-full px-[20px] py-[20px]">
              {/* Close + Workspace */}
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-[12px] tracking-[2px] uppercase font-medium"
                  style={{ color: "#8E6D4F" }}
                >
                  Workspace
                </p>
                <motion.button
                  onClick={onClose}
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] text-[rgba(122,111,103,0.5)] hover:text-[#2F2923] hover:bg-[rgba(0,0,0,0.04)]"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <h1
                className="text-[32px] font-bold leading-[1.1] mb-5"
                style={{ color: "#2F2923" }}
              >
                Notes
              </h1>

              <motion.button
                onClick={handleCreateAndClose}
                className="w-full h-[50px] rounded-[10px] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
                style={{
                  background: "linear-gradient(180deg, #D58C4C, #BA6E32)",
                }}
                whileHover={{
                  y: -1,
                  filter: "brightness(1.05)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
                whileTap={{ y: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              >
                <Plus size={18} strokeWidth={2.5} />
                New Note
              </motion.button>

              <div className="h-px bg-[rgba(0,0,0,0.06)] my-[12px]" />

              <div className="flex items-center gap-2 mb-[8px]">
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

              <div className="flex-1 overflow-y-auto -mx-[2px] px-[2px]">
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
                        exit={{
                          opacity: 0,
                          y: -12,
                          height: 0,
                          marginTop: 0,
                          marginBottom: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        className="mb-[4px]"
                        onClick={onClose}
                      >
                        <NoteCard note={note} />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom actions */}
              <div className="mt-auto pt-3 border-t border-[rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-1">
                    <motion.button
                      className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] text-[rgba(122,111,103,0.5)] hover:text-[#2F2923] hover:bg-[rgba(0,0,0,0.04)]"
                      whileTap={{ scale: 0.9 }}
                      aria-label="Archive"
                    >
                      <Archive size={18} />
                    </motion.button>
                    <motion.button
                      className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] text-[rgba(122,111,103,0.5)] hover:text-[#2F2923] hover:bg-[rgba(0,0,0,0.04)]"
                      whileTap={{ scale: 0.9 }}
                      aria-label="Settings"
                    >
                      <Settings size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
