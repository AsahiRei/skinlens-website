"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { Reveal, SectionPill } from "./Reveal";

const FAQS = [
  {
    q: "Is SkinLens a replacement for a dermatologist?",
    a: "No. As stated in the app itself: this app does not replace a dermatologist and is not a medical diagnosis. If you notice unusual, painful, or rapidly changing skin conditions, please consult a doctor or visit a hospital. SkinLens is for wellness tracking and routine guidance only.",
  },
  {
    q: "Do I need internet to use it?",
    a: "No. Your scan is checked right on your phone, so you can scan offline. Your results are backed up automatically the next time you're online.",
  },
  {
    q: "How does the 0–100 score work?",
    a: "The app recognizes acne, dry, eczema, normal or oily skin and shows your closest matches. Your short survey answers are combined with the scan into one simple 0–100 score, from Excellent to Critical.",
  },
  {
    q: "Where do my photos and results go?",
    a: "Your photos and results are saved on your phone first. When you're online, they're backed up securely. You can sign in with email or Google — the first sign-in needs internet, then the app works offline.",
  },
  {
    q: "What can I do inside the app?",
    a: "Take guided photos or upload from your gallery, check front, left and right angles, get morning, afternoon and evening routines, chat for skincare guidance, follow your progress with charts, get reminders, find nearby clinics, and share reports.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 bg-[#F4F7F5]" id="faq">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 space-y-3">
          <SectionPill icon={<CircleHelp size={16} />}>Clear Answers</SectionPill>
          <Reveal>
            <h2 className="font-display text-[28px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A]">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] text-[#3F4A44]">
              Simple answers about scans, scores, privacy and daily use.
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`bg-white rounded-[20px] border p-6 transition-colors ${
                  isOpen ? "border-[#15803D]/40 shadow-sm" : "border-[#E5EDE8]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex items-center justify-between w-full cursor-pointer text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-display text-[18px] font-semibold text-[#10241A]">{f.q}</h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-[#15803D] shrink-0"
                  >
                    <ChevronDown size={22} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed border-t border-[#EEF2EF] pt-4">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
