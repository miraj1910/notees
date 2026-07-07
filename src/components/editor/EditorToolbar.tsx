"use client";

import { useState, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolItem {
  label: string;
  format: string;
  shortcut: string;
  command: (editor: Editor) => void;
  icon: React.ReactNode;
}

const separator = <div className="toolbar-separator" />;

const toolsLeft: ToolItem[] = [
  {
    label: "Undo",
    format: "undo",
    shortcut: "Ctrl+Z",
    command: (editor: Editor) => { editor.chain().focus().undo().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    ),
  },
  {
    label: "Redo",
    format: "redo",
    shortcut: "Ctrl+Shift+Z",
    command: (editor: Editor) => { editor.chain().focus().redo().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
];

const toolsCenter: ToolItem[] = [
  {
    label: "Bold",
    format: "bold",
    shortcut: "Ctrl+B",
    command: (editor: Editor) => { editor.chain().focus().toggleBold().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      </svg>
    ),
  },
  {
    label: "Italic",
    format: "italic",
    shortcut: "Ctrl+I",
    command: (editor: Editor) => { editor.chain().focus().toggleItalic().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="4" x2="10" y2="4" />
        <line x1="14" y1="20" x2="5" y2="20" />
        <line x1="15" y1="4" x2="9" y2="20" />
      </svg>
    ),
  },
  {
    label: "Strikethrough",
    format: "strike",
    shortcut: "Ctrl+Shift+S",
    command: (editor: Editor) => { editor.chain().focus().toggleStrike().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3 1-5.3 4 0 3.5 4.2 4.5 6.8 5.3 2.6.8 6 1.5 6 5 0 2-2 4-6.2 4-2.5 0-4.8-.5-7-1.4" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
];

const toolsRight: ToolItem[] = [
  {
    label: "Bullet list",
    format: "bulletList",
    shortcut: "Ctrl+Shift+8",
    command: (editor: Editor) => { editor.chain().focus().toggleBulletList().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    label: "Numbered list",
    format: "orderedList",
    shortcut: "Ctrl+Shift+7",
    command: (editor: Editor) => { editor.chain().focus().toggleOrderedList().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <path d="M4 6h1v4" />
        <path d="M4 10h2" />
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      </svg>
    ),
  },
  {
    label: "Quote",
    format: "blockquote",
    shortcut: "Ctrl+Shift+B",
    command: (editor: Editor) => { editor.chain().focus().toggleBlockquote().run(); },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
      </svg>
    ),
  },
  {
    label: "Link",
    format: "link",
    shortcut: "Ctrl+K",
    command: (editor: Editor) => {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("Enter URL", previousUrl || "");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    },
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const fn = () => forceUpdate((n) => n + 1);
    editor.on("selectionUpdate", fn);
    editor.on("transaction", fn);
    return () => {
      editor.off("selectionUpdate", fn);
      editor.off("transaction", fn);
    };
  }, [editor]);

  const handleCommand = useCallback(
    (tool: ToolItem) => {
      if (!editor) return;
      tool.command(editor);
    },
    [editor],
  );

  if (!editor) return null;

  const renderBtn = (tool: ToolItem) => {
    const active = editor.isActive(tool.format);
    return (
      <button
        key={tool.label}
        onClick={() => handleCommand(tool)}
        className={`toolbar-btn ${active ? "active" : ""}`}
        aria-label={tool.label}
        aria-pressed={active}
        title={`${tool.label} (${tool.shortcut})`}
        tabIndex={0}
      >
        {tool.icon}
      </button>
    );
  };

  return (
    <div className="notebook-toolbar">
      <div className="toolbar-strip" role="toolbar" aria-label="Text formatting">
        {toolsLeft.map(renderBtn)}
        {separator}
        {toolsCenter.map(renderBtn)}
        {separator}
        {toolsRight.map(renderBtn)}
      </div>
    </div>
  );
}
