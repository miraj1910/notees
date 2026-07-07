"use client";

import { motion } from "framer-motion";

const RING_COUNT = 14;

export default function Spiral() {
  return (
    <div className="absolute left-[-10px] top-[20px] bottom-[20px] w-[22px] z-30 pointer-events-none">
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 w-[26px] h-[14px] rounded-[50%] border-2 border-solid border-[#666]/60 border-b-transparent"
          style={{
            top: `${((i + 0.5) / RING_COUNT) * 100}%`,
            background:
              "linear-gradient(180deg, #b8b8b8 0%, #888 25%, #555 55%, #444 75%, #333 100%)",
            boxShadow:
              "3px 4px 8px rgba(0,0,0,0.35), inset 0 1.5px 2px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.15)",
            transform: "translateY(-50%)",
          }}
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="absolute top-[2px] left-[5px] right-[5px] h-[3px] rounded-[50%] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
