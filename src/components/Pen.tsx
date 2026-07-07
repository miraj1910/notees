"use client";

import { motion } from "framer-motion";

export default function Pen() {
  return (
    <motion.div
      className="absolute right-[-18px] bottom-[60px] z-20 flex flex-col items-center pointer-events-none"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
    >
      <div
        className="w-[8px] h-[24px] rounded-t-[4px] relative"
        style={{
          background: "linear-gradient(180deg, #4D2F1D, #3D2618)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="absolute top-full left-0 right-0 h-[6px] rounded-b-[4px]"
          style={{ background: "#3D2618" }}
        />
      </div>
      <div className="relative mt-[2px]">
        <div
          className="w-[6px] h-[90px] rounded-t-[3px] relative"
          style={{
            background:
              "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 30%, #1a1a1a 60%, #111 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="absolute top-[6px] right-[-2px] w-[3px] h-[36px] rounded-[1px]"
            style={{
              background: "linear-gradient(180deg, #d4af37, #b8962e)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          />
          <div
            className="absolute top-[40%] left-[-1.5px] right-[-1.5px] h-[4px] rounded-[2px]"
            style={{
              background: "linear-gradient(90deg, #d4af37, #f0d060 50%, #d4af37)",
            }}
          />
        </div>
        <div
          className="w-[8px] h-[14px] mx-auto -mt-[1px] relative"
          style={{
            background: "linear-gradient(180deg, #d4af37, #b8962e)",
            clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[1px] h-[8px]"
            style={{ background: "rgba(0,0,0,0.2)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
