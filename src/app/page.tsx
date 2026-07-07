"use client";

import Sidebar from "@/components/Sidebar";
import Notebook from "@/components/Notebook";

export default function HomePage() {
  return (
    <div
      className="relative w-full min-h-dvh min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#F8F5F1" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      <div
        className="relative flex items-start w-[95vw] h-[94vh] rounded-[22px] overflow-hidden z-10"
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
          background: "#F8F5F1",
        }}
      >
        <Sidebar />
        <Notebook />
      </div>
    </div>
  );
}
