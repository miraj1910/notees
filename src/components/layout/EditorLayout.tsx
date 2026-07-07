"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useNotes } from "@/components/NotesProvider";
import EditorToolbar from "@/components/editor/EditorToolbar";
import EditorCanvas from "@/components/editor/EditorCanvas";

export default function EditorLayout() {
  const {
    currentNoteId,
    activeNote,
    noteLoading,
    saveStatus,
    editorRef,
    onContentChange,
  } = useNotes();

  const isProgrammaticChange = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        heading: false,
        undoRedo: {
          depth: 100,
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-[#B67842] underline hover:text-[#C88A55] cursor-pointer",
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[18rem]",
      },
    },
    onUpdate: () => {
      if (!isProgrammaticChange.current) {
        onContentChange();
      }
    },
  });

  useEffect(() => {
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && activeNote && currentNoteId) {
      isProgrammaticChange.current = true;
      editor.commands.setContent(activeNote.content || "");
      isProgrammaticChange.current = false;
      editor.commands.focus();
    }
  }, [editor, currentNoteId]);

  const isEmpty = !activeNote || !currentNoteId;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusDotClass =
    saveStatus === "Saved"
      ? "saved"
      : saveStatus === "Saving..." || saveStatus === "Creating..."
        ? "saving"
        : saveStatus === "Error Saving"
          ? "error"
          : saveStatus === "Unsaved Changes"
            ? "unsaved"
            : "";

  return (
    <div className="notebook">
      {/* Paper */}
      <div className="notebook-paper">
        <div className="notebook-ruled-lines" />

        <div className="notebook-content">
          {/* Header */}
          <header className="notebook-header">
            <time className="notebook-date">{today}</time>
            {saveStatus && (
              <div className="notebook-save-status">
                <span className={`notebook-save-dot ${statusDotClass}`} />
                <span className="notebook-save-label">{saveStatus}</span>
              </div>
            )}
          </header>

          {/* Toolbar */}
          <EditorToolbar editor={isEmpty ? null : editor} />

          {/* Editor / Empty State */}
          <div className="notebook-editor">
            {!isEmpty ? (
              <>
                {noteLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner" />
                    <p className="loading-text">Loading note...</p>
                  </div>
                ) : (
                  <EditorCanvas editor={editor} />
                )}
              </>
            ) : (
              <div className="empty-state-notebook">
                <div className="empty-state-notebook-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B67842"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <p className="empty-state-notebook-title">Select a note</p>
                <p className="empty-state-notebook-subtitle">or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Tabs */}
      <div className="side-tabs">
        <div className="side-tab side-tab-notes">Notes</div>
        <div className="side-tab side-tab-ideas">Ideas</div>
        <div className="side-tab side-tab-tasks">Tasks</div>
        <div className="side-tab side-tab-work">Work</div>
        <div className="side-tab side-tab-archive">Archive</div>
      </div>
    </div>
  );
}
