"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor | null;
}

interface ToolItem {
  icon: React.ReactNode;
  label: string;
  format: string;
  action: (editor: Editor) => void;
}

const tools: ToolItem[] = [
  { icon: <Undo2 size={16} />, label: "Undo", format: "undo", action: (e) => e.chain().focus().undo().run() },
  { icon: <Redo2 size={16} />, label: "Redo", format: "redo", action: (e) => e.chain().focus().redo().run() },
  { icon: <Bold size={16} />, label: "Bold", format: "bold", action: (e) => e.chain().focus().toggleBold().run() },
  { icon: <Italic size={16} />, label: "Italic", format: "italic", action: (e) => e.chain().focus().toggleItalic().run() },
  { icon: <Strikethrough size={16} />, label: "Strikethrough", format: "strike", action: (e) => e.chain().focus().toggleStrike().run() },
  { icon: <List size={16} />, label: "Bullet List", format: "bulletList", action: (e) => e.chain().focus().toggleBulletList().run() },
  { icon: <ListOrdered size={16} />, label: "Numbered List", format: "orderedList", action: (e) => e.chain().focus().toggleOrderedList().run() },
  { icon: <Quote size={16} />, label: "Blockquote", format: "blockquote", action: (e) => e.chain().focus().toggleBlockquote().run() },
  {
    icon: <Link size={16} />,
    label: "Link",
    format: "link",
    action: (e) => {
      const url = window.prompt("URL:", e.getAttributes("link").href || "");
      if (!url) return;
      e.chain().focus().setLink({ href: url }).run();
    },
  },
];

export default function Toolbar({ editor }: ToolbarProps) {
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  if (!editor) return null;

  const handleAction = (tool: ToolItem) => {
    tool.action(editor);
    if (["undo", "redo"].includes(tool.format)) return;
    setActiveFormat(tool.format);
  };

  const isActive = (format: string) => {
    if (["undo", "redo"].includes(format)) return false;
    return editor.isActive(format);
  };

  return (
    <motion.div
      className="relative flex-shrink-0 z-10 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.35 }}
    >
      <div
        className="inline-flex items-center gap-[2px] px-3 py-2 rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
        style={{
          background: "#F6EFE3",
          backgroundImage:
            "repeating-conic-gradient(rgba(140,120,100,0.002) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px",
        }}
      >
        {tools.map((tool, i) => (
          <div key={tool.label} className="flex items-center">
            {i === 2 || i === 5 || i === 7 ? (
              <div className="w-px h-5 bg-[rgba(0,0,0,0.06)] mx-[3px]" />
            ) : null}
            <motion.button
              onClick={() => handleAction(tool)}
              className={`flex items-center justify-center w-[32px] h-[32px] rounded-[8px] transition-colors duration-150 outline-none ${
                isActive(tool.format)
                  ? "text-[#2D2D2D] bg-[rgba(182,120,66,0.10)]"
                  : "text-[rgba(122,111,103,0.6)] hover:text-[#2D2D2D] hover:bg-[#EFE6D8]"
              }`}
              title={tool.label}
              whileHover={{ y: -1, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
              whileTap={{ y: 0 }}
            >
              {tool.icon}
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
