"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { motion } from "framer-motion";
import { Save, MoreHorizontal } from "lucide-react";
import { useStore } from "@/store/useStore";
import Toolbar from "@/components/Toolbar";
import PaperLines from "@/components/PaperLines";
import Spiral from "@/components/Spiral";
import Tabs from "@/components/Tabs";
import Pen from "@/components/Pen";
import { formatDate } from "@/lib/utils";

export default function Notebook() {
  const notes = useStore((s) => s.notes);
  const activeNoteId = useStore((s) => s.activeNoteId);
  const updateNote = useStore((s) => s.updateNote);
  const setSaveStatus = useStore((s) => s.setSaveStatus);
  const saveStatus = useStore((s) => s.saveStatus);

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const isProgrammaticChange = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        link: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-[#4A7DB4] underline hover:text-[#5A8DC4] cursor-pointer" },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      TaskList.configure({
        HTMLAttributes: { class: "not-prose pl-0" },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: "flex items-start gap-2 my-1" },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[180px] lg:min-h-[280px]",
      },
    },
    onUpdate: () => {
      if (!isProgrammaticChange.current && activeNoteId) {
        const html = editor?.getHTML() || "";
        updateNote(activeNoteId, { content: html });
        setSaveStatus("Unsaved Changes");

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          setSaveStatus("Saved");
        }, 800);
      }
    },
  });

  useEffect(() => {
    if (editor && activeNote && activeNoteId) {
      isProgrammaticChange.current = true;
      editor.commands.setContent(activeNote.content || "");
      isProgrammaticChange.current = false;
    }
  }, [editor, activeNoteId]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const isEmpty = !activeNote || !activeNoteId;

  const today = formatDate(new Date());

  const statusColor =
    saveStatus === "Saved"
      ? "#4CAF50"
      : saveStatus === "Saving..." || saveStatus === "Unsaved Changes"
        ? "#B67842"
        : "#D95858";

  const statusGlow =
    saveStatus === "Saved"
      ? "0 0 5px rgba(76,175,80,0.2)"
      : "none";

  return (
    <motion.div
      className="relative flex-1 h-full flex items-center justify-center pl-0 lg:pl-[16px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Leather Cover */}
      <motion.div
        className="relative w-full h-full lg:h-[calc(100%-8px)] lg:max-h-[800px] rounded-none lg:rounded-[18px] flex flex-col overflow-hidden z-[5] lg:mx-0"
        style={{
          background: [
            "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.012) 3px, rgba(0,0,0,0.012) 4px)",
            "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, rgba(0,0,0,0.008) 5px, rgba(0,0,0,0.008) 6px)",
            "linear-gradient(145deg, #9A6134 0%, #7B4B26 30%, #6D3E1E 60%, #5A3520 100%)",
          ].join(","),
          boxShadow: [
            "0 30px 80px -12px rgba(0,0,0,0.35)",
            "0 15px 35px -8px rgba(0,0,0,0.2)",
            "0 5px 15px rgba(0,0,0,0.1)",
            "inset 0 1px 1px rgba(255,255,255,0.06)",
            "inset 0 -1px 1px rgba(0,0,0,0.12)",
          ].join(","),
        }}
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Decorative stitch - hide on mobile */}
        <div
          className="absolute inset-[10px] rounded-[12px] pointer-events-none z-[6] max-lg:hidden"
          style={{
            border: "1.5px dashed rgba(220,200,180,0.12)",
          }}
        />

        {/* Bevel highlight */}
        <div
          className="absolute inset-0 rounded-none lg:rounded-[18px] pointer-events-none z-[7]"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Paper */}
        <div
          className="relative mx-0 lg:mx-[14px] my-0 lg:my-[14px] flex-1 rounded-none lg:rounded-[3px] overflow-hidden z-[5] flex flex-col"
          style={{
            background: "#F8F2E7",
            boxShadow: [
              "0 0 0 1px rgba(0,0,0,0.03)",
              "inset 1px 0 0 rgba(255,255,255,0.5)",
              "inset -1px 0 0 rgba(0,0,0,0.02)",
              "inset 0 1px 0 rgba(255,255,255,0.5)",
              "inset 0 -1px 0 rgba(0,0,0,0.03)",
            ].join(","),
          }}
        >
          {/* Paper grain */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: [
                "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(160,140,120,0.04) 95%, rgba(160,140,120,0.07) 100%)",
                "repeating-conic-gradient(rgba(140,120,100,0.003) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px",
                "linear-gradient(180deg, rgba(245,235,220,0.3) 0%, transparent 30%, transparent 70%, rgba(230,215,195,0.2) 100%)",
                "repeating-linear-gradient(85deg, transparent 0px, transparent 30px, rgba(180,160,140,0.006) 30px, rgba(180,160,140,0.006) 31px)",
              ].join(","),
            }}
          />

          {/* Ruled lines + margin */}
          <PaperLines />

          {/* Content */}
          <div className="relative z-[4] flex-1 flex flex-col px-[24px] sm:px-[40px] lg:px-[70px] py-[16px] sm:py-[24px] lg:py-[40px] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0 mb-[6px] min-h-[24px]">
              <time
                className="text-[11px] italic tracking-[0.02em]"
                style={{ color: "rgba(122,111,103,0.45)", fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {today}
              </time>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-[5px]">
                  <span
                    className="w-[6px] h-[6px] rounded-full transition-all duration-300"
                    style={{ background: statusColor, boxShadow: statusGlow }}
                  />
                  <span
                    className="text-[10px] tracking-wide hidden sm:inline"
                    style={{ color: "rgba(122,111,103,0.45)", fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {saveStatus}
                  </span>
                </div>
                <motion.button
                  className="w-[32px] h-[32px] lg:w-[24px] lg:h-[24px] rounded-[8px] flex items-center justify-center text-[rgba(122,111,103,0.35)] hover:text-[rgba(122,111,103,0.6)] hover:bg-[rgba(0,0,0,0.03)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal size={16} />
                </motion.button>
              </div>
            </div>

            {/* Toolbar */}
            <Toolbar editor={isEmpty ? null : editor} />

            {/* Editor / Empty State */}
            <div className="flex-1 flex flex-col min-h-0">
              {!isEmpty ? (
                <div className="flex-1 flex flex-col">
                  <input
                    className="w-full bg-transparent border-none outline-none font-['Caveat',cursive] text-[30px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.2] tracking-[-0.02em] p-0 mb-[6px] lg:mb-[8px]"
                    style={{ color: "#2F2923" }}
                    placeholder="Untitled"
                    defaultValue={activeNote?.title || ""}
                    onInput={(e) => {
                      if (activeNoteId) {
                        updateNote(activeNoteId, {
                          title: (e.target as HTMLInputElement).value,
                        });
                        setSaveStatus("Unsaved Changes");
                        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                        saveTimerRef.current = setTimeout(() => {
                          setSaveStatus("Saved");
                        }, 800);
                      }
                    }}
                  />
                  <div className="flex-1 relative">
                    <EditorContent
                      editor={editor}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center font-['Caveat',cursive]">
                  <div className="w-[44px] h-[44px] rounded-full bg-[rgba(182,120,66,0.07)] flex items-center justify-center mb-[12px]">
                    <Save size={18} style={{ color: "#B67842" }} />
                  </div>
                  <p className="text-[22px] lg:text-[26px] font-semibold" style={{ color: "rgba(45,45,45,0.35)" }}>
                    Select a note
                  </p>
                  <p className="text-[16px] lg:text-[18px]" style={{ color: "rgba(122,111,103,0.3)" }}>
                    or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spiral Binding */}
        <Spiral />

        {/* Side Tabs */}
        <Tabs />

        {/* Pen Holder */}
        <Pen />
      </motion.div>
    </motion.div>
  );
}
