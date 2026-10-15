"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DownloadModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#10241A]/60 backdrop-blur-sm"
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-modal-title"
            className="relative w-full max-w-md rounded-[24px] bg-white p-6 sm:p-8 shadow-2xl border border-[#E5EDE8] text-left"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F4F7F5] hover:bg-[#EAF6EE] flex items-center justify-center text-[#10241A] transition-colors"
            >
              <X size={18} />
            </button>

            <h3
              id="download-modal-title"
              className="font-display text-[22px] leading-[28px] font-bold text-[#10241A] tracking-tight"
            >
              Coming Soon
            </h3>
            <p className="mt-2 text-[14px] leading-[22px] text-[#3F4A44]">
              SkinLens is almost ready — we&apos;re putting the finishing
              touches on your 30-second skin scan, 0–100 health score, and
              daily routine. Check back soon.
            </p>

            <div className="mt-4 rounded-2xl bg-[#F4F7F5] border border-[#E5EDE8] p-4 flex items-start gap-3">
              <BellRing size={20} className="text-[#15803D] shrink-0 mt-0.5" />
              <p className="text-[13px] leading-[19px] text-[#3F4A44]">
                <span className="font-semibold text-[#10241A]">
                  Want early access?
                </span>{" "}
                Check back soon — launch is coming, and it&apos;ll be free.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full bg-[#15803D] hover:bg-[#22B358] text-white text-[14px] font-semibold transition-colors min-h-[48px]"
              >
                Got it
              </button>
              <a
                href="#diagnostics"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full bg-white border border-[#E5EDE8] hover:bg-[#EAF6EE] text-[#10241A] text-[14px] font-semibold transition-colors flex items-center justify-center min-h-[48px]"
              >
                See how it works
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
