"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function FAB() {
  const createNote = useStore((s) => s.createNote);

  return (
    <motion.button
      onClick={createNote}
      className="fixed bottom-[88px] right-[20px] z-40 flex items-center justify-center w-[56px] h-[56px] rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.25)] lg:hidden"
      style={{
        background: "linear-gradient(180deg, #D58C4C, #B56E36)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: 0.4,
      }}
      whileHover={{ scale: 1.08, boxShadow: "0 12px 28px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.92 }}
      aria-label="Create new note"
    >
      <Plus size={26} strokeWidth={2.5} color="white" />
    </motion.button>
  );
}
