"use client";

import { useNotes } from "@/components/NotesProvider";
import EditorToolbar from "@/components/editor/EditorToolbar";
import EditorCanvas from "@/components/editor/EditorCanvas";

export default function EditorLayout() {
  const { currentNoteId, activeNote, noteLoading, saveStatus } = useNotes();

  return (
    <main
      className="flex flex-col flex-1 min-h-0 bg-white/70 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] rounded-[--radius-panel] shadow-[--shadow-glass] overflow-hidden md:max-h-[calc(100dvh-2.5rem)] lg:max-h-[calc(100dvh-2rem)]"
      aria-label="Editor"
    >
      {/* Editor header */}
      <header className="flex items-center justify-between px-4 sm:px-5 lg:px-6 pt-4 sm:pt-5 pb-2 sm:pb-3 shrink-0">
        <div>
          <p className="eyebrow !mb-0 !text-[11px]">Editor</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs text-[#7A6F67] flex items-center gap-1.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  saveStatus === "Saved"
                    ? "bg-green-500"
                    : saveStatus.includes("Saving") ||
                        saveStatus.includes("Creating") ||
                        saveStatus.includes("Deleting")
                      ? "bg-[#B8835D] animate-pulse"
                      : saveStatus.includes("fail") ||
                          saveStatus.includes("Failed")
                        ? "bg-[#D95858]"
                        : "bg-[#7A6F67]/40"
                }`}
              />
              {saveStatus}
            </span>
          )}
        </div>
      </header>

      {/* Toolbar - floating */}
      <div className="px-4 sm:px-5 lg:px-6 pb-2 sm:pb-3 shrink-0">
        <EditorToolbar />
      </div>

      {/* Editor content */}
      <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
        {activeNote && currentNoteId ? (
          <div key={currentNoteId} className="flex-1 flex flex-col bg-white rounded-[--radius-card] border border-[rgba(0,0,0,0.04)] shadow-[--shadow-card] p-6 lg:p-10">
            {noteLoading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#B8835D] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[#7A6F67]">Loading note...</p>
                </div>
              </div>
            ) : (
              <EditorCanvas />
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-[--radius-card] border border-[rgba(0,0,0,0.04)] shadow-[--shadow-card]">
            <div className="text-center max-w-sm px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#B8835D]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B8835D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#2D2623]">
                Select a note or create a new one
              </p>
              <p className="text-xs text-[#7A6F67] mt-1.5 leading-relaxed">
                Your writing area will appear here once a note is open.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
