"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

export function SplashScreen({ duration = 2200 }: { duration?: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(t);
  }, [duration]);

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F4F7F5]"
          aria-hidden={!visible}
        >
          <div className="flex flex-col items-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative"
            >
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#95f8a7]"
              />
              <Image
                src="/skinlens-icon.png"
                alt="SkinLens"
                width={88}
                height={88}
                priority
                className="relative w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full object-cover shadow-lg ring-1 ring-[#E5EDE8]"
              />
            </motion.div>

            <motion.h1
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-display mt-5 text-[28px] font-bold tracking-tight text-[#10241A]"
            >
              SkinLens
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-1 text-[14px] text-[#3F4A44]"
            >
              Know Your Skin, Right On Your Phone
            </motion.p>

            <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#E5EDE8]">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  duration: duration / 1000 - 0.4,
                  ease: "easeInOut",
                }}
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#22b358] to-[#15803D]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
