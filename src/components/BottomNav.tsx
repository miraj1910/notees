"use client";

import { motion } from "framer-motion";
import { FileText, Lightbulb, CheckSquare, Briefcase, Archive } from "lucide-react";

const tabs = [
  { id: "notes", label: "Notes", icon: FileText },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "archive", label: "Archive", icon: Archive },
];

export default function BottomNav() {
  return (
    <motion.nav
      className="flex items-center justify-around px-4 pb-2 pt-2 lg:hidden"
      style={{
        paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
        background: "rgba(248, 242, 231, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      {tabs.map((tab, i) => {
        const Icon = tab.icon;
        const isActive = tab.id === "notes";
        return (
          <motion.button
            key={tab.id}
            className="flex flex-col items-center gap-[2px] py-1 px-3 rounded-[12px] min-w-[56px] transition-colors duration-200"
            style={{
              color: isActive ? "#8E6D4F" : "rgba(122,111,103,0.45)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.25 }}
            aria-label={tab.label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span
              className="text-[10px] font-medium tracking-[0.03em]"
              style={{
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
