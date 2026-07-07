"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const initRef = useRef(false);

  const handleLogin = useCallback(() => {
    setLoading(true);
    setError("");
    if (authService.isInitialized) {
      authService.requestLogin();
    } else {
      setLoading(false);
      setError("Authentication is not ready yet. Please try again.");
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      while (
        typeof google === "undefined" ||
        !google.accounts?.oauth2
      ) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      authService.init({
        onSuccess: () => {
          setLoading(false);
          onLogin();
        },
        onError: (msg) => {
          setLoading(false);
          setError(msg);
        },
      });
    };

    init();
  }, [onLogin]);

  useEffect(() => {
    const check = () => {
      if (typeof google !== "undefined" && google.accounts?.oauth2) {
        setScriptReady(true);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

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

        <AnimatePresence>
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Leather-bound card */}
            <motion.div
              className="relative p-[3px] rounded-[18px]"
              style={{
                background:
                  "linear-gradient(145deg, #9A6134, #6D3E1E)",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.15)",
              }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            >
              {/* Paper insert */}
              <div
                className="relative rounded-[15px] px-10 py-12 sm:px-14 sm:py-14 overflow-hidden"
                style={{ background: "#F8F2E7" }}
              >
                {/* Paper grain */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: [
                      "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(160,140,120,0.04) 95%, rgba(160,140,120,0.07) 100%)",
                      "repeating-conic-gradient(rgba(140,120,100,0.003) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px",
                    ].join(","),
                  }}
                />

                {/* Ruled lines decoration */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(transparent 0px, transparent 28px, #D8DDE7 28px, #D8DDE7 29px)",
                  }}
                />

                <div className="relative z-10 text-center">
                  <motion.p
                    className="text-[11px] tracking-[2px] uppercase font-medium mb-2"
                    style={{ color: "#8E6D4F" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    Private Workspace
                  </motion.p>

                  <motion.h1
                    className="text-[48px] sm:text-[56px] font-bold leading-[1.05] mb-3"
                    style={{
                      color: "#2F2923",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      letterSpacing: "-0.03em",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    Notebook
                  </motion.h1>

                  <motion.p
                    className="text-[15px] max-w-xs mx-auto mb-8"
                    style={{ color: "rgba(122,111,103,0.7)", lineHeight: "1.6" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    A premium leather notebook for your thoughts, ideas, and daily notes.
                  </motion.p>

                  <motion.button
                    onClick={handleLogin}
                    disabled={loading || !scriptReady}
                    className="inline-flex items-center justify-center gap-3 h-[50px] px-8 rounded-[10px] text-white font-semibold text-[14px] shadow-[0_5px_15px_rgba(0,0,0,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(180deg, #D58C4C, #BA6E32)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    whileHover={{
                      y: -2,
                      filter: "brightness(1.05)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ y: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    {loading ? (
                      <>
                        <div
                          className="w-[16px] h-[16px] rounded-full border-2 border-white/40 border-t-white animate-spin"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className="mt-4 text-[13px] px-4 py-3 rounded-[10px] border"
                        style={{
                          color: "#D95858",
                          background: "rgba(217,88,88,0.08)",
                          borderColor: "rgba(217,88,88,0.2)",
                        }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.p
                    className="mt-6 text-[11px]"
                    style={{ color: "rgba(122,111,103,0.45)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    Encrypted by your Google session
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
