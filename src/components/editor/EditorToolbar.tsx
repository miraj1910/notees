"use client";

const tools = [
  {
    label: "Bold",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      </svg>
    ),
    shortcut: "Ctrl+B",
  },
  {
    label: "Italic",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="4" x2="10" y2="4" />
        <line x1="14" y1="20" x2="5" y2="20" />
        <line x1="15" y1="4" x2="9" y2="20" />
      </svg>
    ),
    shortcut: "Ctrl+I",
  },
  {
    label: "Strikethrough",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3 1-5.3 4 0 3.5 4.2 4.5 6.8 5.3 2.6.8 6 1.5 6 5 0 2-2 4-6.2 4-2.5 0-4.8-.5-7-1.4" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
    shortcut: "Ctrl+Shift+S",
  },
  {
    label: "Bullet list",
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
    shortcut: "Ctrl+Shift+8",
  },
  {
    label: "Numbered list",
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
    shortcut: "Ctrl+Shift+7",
  },
  {
    label: "Link",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    shortcut: "Ctrl+K",
  },
];

export default function EditorToolbar() {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 bg-white/80 backdrop-blur-lg border border-[rgba(0,0,0,0.06)] rounded-[--radius-card] shadow-[--shadow-glass]"
      role="toolbar"
      aria-label="Text formatting"
    >
      {tools.map((tool) => (
        <button
          key={tool.label}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7A6F67] hover:text-[#2D2623] hover:bg-[rgba(0,0,0,0.04)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8835D]/40"
          aria-label={tool.label}
          title={`${tool.label} (${tool.shortcut})`}
          tabIndex={0}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
