"use client";

import { EditorContent, type Editor } from "@tiptap/react";
import NoteTitle from "./NoteTitle";

interface EditorCanvasProps {
  editor: Editor | null;
}

export default function EditorCanvas({ editor }: EditorCanvasProps) {
  if (!editor) return null;

  return (
    <div className="notebook-editor">
      <NoteTitle />
      <div className="relative flex-1 flex">
        <EditorContent
          editor={editor}
          className="w-full h-full"
          aria-label="Note content"
        />
      </div>
    </div>
  );
}
