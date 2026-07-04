"use client";

import Script from "next/script";
import { NotesProvider, useNotes } from "@/components/NotesProvider";
import BrandRail from "@/components/layout/BrandRail";
import Sidebar from "@/components/layout/Sidebar";
import EditorLayout from "@/components/layout/EditorLayout";

function LoginScreen() {
  const { login, authError } = useNotes();

  return (
    <section className="relative z-10 min-h-dvh min-h-screen p-8 grid place-items-center">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <div className="w-full max-w-lg p-8 md:p-12 rounded-[--radius-card] bg-white/80 backdrop-blur-xl border border-[rgba(0,0,0,0.08)] shadow-[--shadow-elevated]">
        <p className="eyebrow">Private Workspace</p>
        <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-serif font-bold leading-[0.95] tracking-[-0.04em] text-[#2D2623] mt-2">
          Notes
        </h1>
        <p className="max-w-md mt-4 text-[#7A6F67] text-[15px] leading-relaxed">
          A calm, focused writing space that keeps your notes synced to Google
          Drive.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <button
            id="login-btn"
            onClick={login}
            className="inline-flex items-center justify-center gap-3 h-11 px-6 rounded-full bg-[#B8835D] text-white font-semibold text-sm hover:bg-[#D4A574] transition-all duration-200 shadow-lg shadow-[rgba(184,131,93,0.25)] hover:shadow-xl hover:shadow-[rgba(184,131,93,0.3)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8835D]/50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#fff"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#fff"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#fff"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#fff"
              />
            </svg>
            Continue with Google
          </button>

          {authError && (
            <p className="text-sm text-[#D95858] bg-[rgba(217,88,88,0.08)] px-4 py-3 rounded-xl border border-[rgba(217,88,88,0.2)]">
              {authError}
            </p>
          )}

          <p className="text-xs text-[#7A6F67] leading-relaxed">
            Encrypted by your Google session. Minimal surface. Fast editing.
          </p>
        </div>
      </div>
    </section>
  );
}

function AppLayout() {
  return (
    <section className="relative z-10 w-full max-w-[1760px] mx-auto min-h-dvh min-h-screen p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col md:flex-row gap-3 md:gap-3 lg:gap-4">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <BrandRail />
      <Sidebar />
      <EditorLayout />
    </section>
  );
}

function AppContent() {
  const { isAuthenticated, activeNote } = useNotes();

  return isAuthenticated ? <AppLayout /> : <LoginScreen />;
}

export default function HomePage() {
  return (
    <NotesProvider>
      <AppContent />
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
    </NotesProvider>
  );
}
