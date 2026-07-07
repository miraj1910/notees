"use client";

import { motion } from "framer-motion";

const tabs = [
  { label: "Notes", bg: "rgba(184,131,93,0.12)", border: "rgba(184,131,93,0.3)", hoverBg: "rgba(184,131,93,0.2)" },
  { label: "Ideas", bg: "rgba(160,200,170,0.15)", border: "rgba(160,200,170,0.3)", hoverBg: "rgba(160,200,170,0.25)" },
  { label: "Tasks", bg: "rgba(200,170,210,0.12)", border: "rgba(200,170,210,0.3)", hoverBg: "rgba(200,170,210,0.2)" },
  { label: "Work", bg: "rgba(180,195,220,0.12)", border: "rgba(180,195,220,0.3)", hoverBg: "rgba(180,195,220,0.2)" },
  { label: "Archive", bg: "rgba(180,170,160,0.12)", border: "rgba(180,170,160,0.3)", hoverBg: "rgba(180,170,160,0.2)" },
];

export default function Tabs() {
  return (
    <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-20 flex flex-col gap-[3px] pointer-events-none max-lg:hidden">
      {tabs.map((tab, i) => (
        <motion.div
          key={tab.label}
          className="relative px-[10px] py-[14px] text-[10px] font-medium tracking-[0.06em] uppercase rounded-r-[10px] cursor-default select-none pointer-events-auto"
          style={{
            background: tab.bg,
            borderLeft: `2px solid ${tab.border}`,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            color: "rgba(122,111,103,0.5)",
          }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 + i * 0.08, duration: 0.35, ease: "easeOut" }}
          whileHover={{
            x: 4,
            background: tab.hoverBg,
            color: "#2D2D2D",
            transition: { duration: 0.2 },
          }}
        >
          {tab.label}
        </motion.div>
      ))}
    </div>
  );
}
