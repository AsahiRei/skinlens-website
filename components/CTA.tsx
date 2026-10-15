"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, Loader2, Send, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

export function CTA() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9\s\-()]{7,}$/.test(v);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    // Simulated async link dispatch (no backend yet)
    setTimeout(() => setStatus("done"), 1200);
  };

  return (
    <section className="py-20 md:py-28 bg-white" id="download">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="rounded-[24px] bg-gradient-to-r from-[#14532D] to-[#10241A] p-8 md:p-16 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#22B358]/20 rounded-full blur-3xl pointer-events-none" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -left-24 w-80 h-80 rounded-full border border-white/10 pointer-events-none"
            />
            <div className="max-w-2xl relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#95F8A7] text-[12px] border border-white/10">
                <Zap size={16} />
                Free Early Access
              </span>
              <h2 className="font-display text-[28px] sm:text-[40px] sm:leading-[48px] font-semibold tracking-tight">
                Start Your Skin Journey Today
              </h2>
              <p className="text-[16px] text-[#AFCEBA] leading-relaxed">
                Take a guided selfie or upload a photo, answer a short survey,
                and get your 0–100 score plus a morning, afternoon and evening
                routine. Leave your email or number and we&apos;ll send you the
                download link.
              </p>

              <form onSubmit={submit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-lg" noValidate>
                <input
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter email or phone for download link"
                  type="text"
                  className="px-5 py-3.5 rounded-full bg-white text-[#10241A] placeholder-[#9CA3AF] border-0 focus:ring-2 focus:ring-[#95F8A7] focus:outline-none flex-grow text-[16px]"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={status === "sending" || status === "done"}
                  type="submit"
                  className="px-7 py-3.5 rounded-full bg-[#15803D] hover:bg-[#22B358] disabled:opacity-70 text-white text-[14px] font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : status === "done" ? (
                    <>
                      <CircleCheck size={18} /> Link Sent
                    </>
                  ) : (
                    <>
                      <span>Send Link</span> <Send size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <AnimatePresence>
                {status === "done" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-[14px] text-[#95F8A7]"
                  >
                    <CircleCheck size={16} />
                    Check your inbox — your download link is on its way to {value.trim()}.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[14px] text-[#fca5a5]"
                  >
                    Please enter a valid email address or phone number.
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-[12px] text-[#AFCEBA]">
                <span className="flex items-center gap-1.5">
                  <CircleCheck size={16} className="text-[#95F8A7]" />
                  Private scan on your phone
                </span>
                <span className="flex items-center gap-1.5">
                  <CircleCheck size={16} className="text-[#95F8A7]" />
                  Works offline, syncs later
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
