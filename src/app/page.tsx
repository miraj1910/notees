"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginScreen from "@/components/LoginScreen";
import Sidebar from "@/components/Sidebar";
import Notebook from "@/components/Notebook";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import Drawer from "@/components/Drawer";
import FAB from "@/components/FAB";

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <motion.div
      className="relative w-full h-dvh h-screen flex flex-col lg:flex-row overflow-hidden z-10 lg:w-[95vw] lg:h-[94vh] lg:rounded-[22px]"
      style={{
        background: "#F8F5F1",
        boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col flex-1 min-h-0 lg:hidden">
        <TopAppBar onMenuClick={() => setDrawerOpen(true)} />
        <div className="flex-1 overflow-hidden">
          <Notebook />
        </div>
        <BottomNav />
        <FAB />
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Desktop notebook */}
      <div className="hidden lg:flex flex-1 min-h-0">
        <Notebook />
      </div>
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
