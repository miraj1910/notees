"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X, FileText } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatRelativeTime } from "@/lib/utils";

interface TopAppBarProps {
  onMenuClick: () => void;
}

export default function TopAppBar({ onMenuClick }: TopAppBarProps) {
  const notes = useStore((s) => s.notes);
  const activeNoteId = useStore((s) => s.activeNoteId);
  const setActiveNote = useStore((s) => s.setActiveNote);
  const activeNote = notes.find((n) => n.id === activeNoteId);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? notes.filter((n) =>
        n.title?.toLowerCase().includes(query.toLowerCase()),
      )
    : notes;

  const handleClose = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen, handleClose]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen, handleClose]);

  const handleSelect = (id: string) => {
    setActiveNote(id);
    handleClose();
  };

  return (
    <div ref={containerRef} className="relative shrink-0 lg:hidden">
      <motion.header
        className="flex items-center justify-between h-[60px] px-4"
        style={{
          background: "#F8F2E7",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.button
            onClick={onMenuClick}
            className="flex items-center justify-center w-[44px] h-[44px] rounded-[10px] text-[rgba(122,111,103,0.6)] hover:text-[#2F2923] hover:bg-[rgba(0,0,0,0.04)] shrink-0"
            whileTap={{ scale: 0.92 }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </motion.button>

          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search"
                className="flex-1 flex items-center"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-transparent border-none outline-none text-[15px] text-[#2F2923] placeholder:text-[rgba(122,111,103,0.35)] font-['Inter',sans-serif]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="title"
                className="flex flex-col min-w-0"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <span
                  className="text-[11px] tracking-[1.5px] uppercase font-medium"
                  style={{ color: "#8E6D4F" }}
                >
                  Notebook
                </span>
                <h1
                  className="text-[17px] font-semibold leading-tight truncate"
                  style={{ color: "#2F2923" }}
                >
                  {activeNote?.title || "Notes"}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            onClick={() => setSearchOpen((p) => !p)}
            className="flex items-center justify-center w-[44px] h-[44px] rounded-[10px] text-[rgba(122,111,103,0.6)] hover:text-[#2F2923] hover:bg-[rgba(0,0,0,0.04)]"
            whileTap={{ scale: 0.92 }}
            aria-label={searchOpen ? "Close search" : "Search"}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Search results dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="absolute left-0 right-0 z-50 overflow-hidden"
            style={{
              background: "#FAF6EF",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              borderBottom: "1px solid #E6D9C9",
              maxHeight: "min(60vh, 400px)",
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-y-auto max-h-[min(60vh,400px)]">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-[13px] text-[rgba(122,111,103,0.5)]">
                    {query ? "No notes match your search" : "Start typing to search"}
                  </p>
                </div>
              ) : (
                filtered.map((note, i) => (
                  <motion.button
                    key={note.id}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[rgba(182,120,66,0.06)] transition-colors"
                    onClick={() => handleSelect(note.id)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.15 }}
                  >
                    <div className="w-[32px] h-[32px] rounded-[8px] bg-[rgba(182,120,66,0.07)] flex items-center justify-center shrink-0">
                      <FileText size={14} style={{ color: "#B67842" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#2F2923] truncate">
                        {note.title || "Untitled"}
                      </p>
                      <p className="text-[11px] text-[rgba(122,111,103,0.5)]">
                        {formatRelativeTime(new Date(note.updatedAt))}
                      </p>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
