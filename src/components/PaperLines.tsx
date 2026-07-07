"use client";

import { motion } from "framer-motion";

export default function PaperLines() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-[3]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent 0px, transparent 30px, #D8DDE7 30px, #D8DDE7 31px)",
      }}
    >
      {/* Desktop margin line */}
      <div
        className="hidden sm:block absolute top-0 bottom-0 w-[1.5px] pointer-events-none"
        style={{
          left: "80px",
          background:
            "linear-gradient(180deg, rgba(228,170,160,0.4) 0%, rgba(228,170,160,0.2) 100%)",
        }}
      />

      {/* Mobile margin line */}
      <div
        className="sm:hidden absolute top-0 bottom-0 w-[1.5px] pointer-events-none"
        style={{
          left: "44px",
          background:
            "linear-gradient(180deg, rgba(228,170,160,0.4) 0%, rgba(228,170,160,0.2) 100%)",
        }}
      />

      <div
        className="absolute top-[-1px] left-0 right-0 h-[3px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #F8F2E7 30%, #F0E8D8 50%, #F8F2E7 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 left-[20%] right-[30%] h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200,180,160,0.15) 50%, transparent)",
        }}
      />
    </motion.div>
  );
}
