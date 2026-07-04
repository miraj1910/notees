"use client";

export default function BrandRail() {
  return (
    <aside
      className="hidden lg:flex flex-col items-center w-[72px] min-h-screen py-6 px-2 shrink-0"
      aria-label="Brand navigation"
    >
      <div className="flex flex-col items-center gap-1 mb-2">
        <div className="w-8 h-8 rounded-xl bg-[#B8835D] flex items-center justify-center shadow-sm">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-[#7A6F67] tracking-wide">
          NOTES
        </span>
      </div>

      <nav className="flex flex-col items-center gap-4 mt-8" aria-label="Main navigation">
        <button
          className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#7A6F67] hover:text-[#2D2623] hover:bg-white transition-all duration-200 shadow-sm"
          aria-label="All notes"
          title="All notes"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#7A6F67] hover:text-[#2D2623] hover:bg-white transition-all duration-200 shadow-sm"
          aria-label="Search notes"
          title="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <button
          className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#7A6F67] hover:text-[#2D2623] hover:bg-white transition-all duration-200 shadow-sm"
          aria-label="Settings"
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </nav>

      <div className="mt-auto">
        <div className="w-10 h-10 rounded-full bg-[#B8835D]/10 border-2 border-white flex items-center justify-center text-sm font-semibold text-[#B8835D] shadow-sm">
          U
        </div>
      </div>
    </aside>
  );
}
