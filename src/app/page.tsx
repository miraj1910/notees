"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginScreen from "@/components/LoginScreen";
import Sidebar from "@/components/Sidebar";
import Notebook from "@/components/Notebook";

function AppLayout() {
  return (
    <motion.div
      className="relative flex items-start w-[95vw] h-[94vh] rounded-[22px] overflow-hidden z-10"
      style={{
        boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
        background: "#F8F5F1",
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Sidebar />
      <Notebook />
    </motion.div>
  );
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

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

      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <AppLayout key="app" />
        ) : (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}
      </AnimatePresence>
    </div>
  );
}
