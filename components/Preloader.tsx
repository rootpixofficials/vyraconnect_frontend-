"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the page is already fully loaded by the time this mounts, don't show the preloader!
    if (document.readyState === "complete") {
      setIsLoading(false);
      return;
    }

    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener("load", handleLoad);

    // Fallback: Max 1 second artificial limit just in case
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060d18]"
        >
          {/* Alloy Wheel SVG */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-24 h-24 text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
              <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="4" />
              <path d="M50 35 V10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M50 65 V90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M35 50 H10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M65 50 H90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M39 39 L22 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M61 61 L78 78" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M61 39 L78 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M39 61 L22 78" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-2xl font-bold tracking-widest font-heading"
          >
            VYRA CONNECT
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
