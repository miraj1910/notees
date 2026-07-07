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
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

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

function ToolbarInner({ editor, keyboardOpen }: { editor: Editor | null; keyboardOpen: boolean }) {
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
    <div
      className={`inline-flex items-center gap-[2px] px-2 lg:px-3 py-2 rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ${
        keyboardOpen ? "mx-2" : ""
      }`}
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
            className={`flex items-center justify-center rounded-[10px] transition-colors duration-150 outline-none
              w-[38px] h-[38px] lg:w-[34px] lg:h-[34px]
              ${
                isActive(tool.format)
                  ? "text-[#2D2D2D] bg-[rgba(182,120,66,0.10)]"
                  : "text-[rgba(122,111,103,0.6)] hover:text-[#2D2D2D] hover:bg-[#EFE6D8]"
              }`}
            title={tool.label}
            whileHover={{ y: -1, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.92 }}
          >
            {tool.icon}
          </motion.button>
        </div>
      ))}
    </div>
  );
}

export default function Toolbar({ editor }: ToolbarProps) {
  const keyboardHeight = useKeyboardHeight();
  const keyboardOpen = keyboardHeight > 0;

  if (!editor) return null;

  return (
    <>
      {/* Desktop / mobile no-keyboard: inline toolbar */}
      <div className="relative flex-shrink-0 z-10 mb-4 lg:mb-6 overflow-x-auto no-scrollbar lg:block hidden">
        <ToolbarInner editor={editor} keyboardOpen={false} />
      </div>
      <div className="relative flex-shrink-0 z-10 mb-4 lg:mb-6 overflow-x-auto no-scrollbar lg:hidden block">
        <ToolbarInner editor={editor} keyboardOpen={false} />
      </div>

      {/* Keyboard-open: fixed toolbar above keyboard */}
      {keyboardOpen && (
        <motion.div
          className="fixed left-0 right-0 z-50 flex justify-center lg:hidden"
          style={{ bottom: keyboardHeight + 8 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ToolbarInner editor={editor} keyboardOpen={true} />
        </motion.div>
      )}
    </>
  );
}
