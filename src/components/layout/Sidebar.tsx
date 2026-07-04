"use client";

import { useNotes } from "@/components/NotesProvider";
import NewNoteButton from "@/components/notes/NewNoteButton";
import NotesList from "@/components/notes/NotesList";

export default function Sidebar() {
  const { notes, saveStatus } = useNotes();

  const noteCount = notes.length;

  return (
    <aside
      className="flex flex-col w-full md:w-[290px] lg:w-[340px] xl:w-[370px] min-h-0 bg-white/60 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] rounded-[--radius-panel] shadow-[--shadow-glass] p-4 sm:p-5 sm:max-h-[35dvh] md:max-h-[calc(100dvh-2.5rem)] lg:max-h-[calc(100dvh-2rem)]"
      aria-label="Notes sidebar"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="eyebrow mb-1">Workspace</p>
          <h2 className="text-2xl font-semibold text-[#2D2623] tracking-tight">
            Notes
          </h2>
        </div>
      </div>

      <NewNoteButton />

      <div className="flex items-center gap-2 mt-4 mb-2 pt-3 border-t border-[rgba(0,0,0,0.06)]">
        <span className="text-xs font-medium text-[#7A6F67]">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </span>
        <span className="w-1 h-1 rounded-full bg-[#B8835D]" />
        <span className="text-xs text-[#7A6F67] flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#7A6F67]/40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7A6F67]/60" />
          </span>
          Drive sync
        </span>
      </div>

      <NotesList />

      {saveStatus && (
        <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-1.5 text-xs text-[#7A6F67]">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                saveStatus === "Saved"
                  ? "bg-green-500"
                  : saveStatus.includes("Saving") || saveStatus.includes("Creating") || saveStatus.includes("Deleting")
                    ? "bg-[#B8835D] animate-pulse"
                    : saveStatus.includes("fail") || saveStatus.includes("Failed")
                      ? "bg-[#D95858]"
                      : "bg-[#7A6F67]/40"
              }`}
            />
            {saveStatus}
          </div>
        </div>
      )}
    </aside>
  );
}
