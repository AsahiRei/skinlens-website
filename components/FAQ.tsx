"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Reveal, SectionPill } from "./Reveal";

const FAQS = [
  {
    q: "Is SkinLens a replacement for a dermatologist?",
    a: "No. SkinLens can point out a likely skin concern and suggest a routine, but it can't diagnose or treat anything. If a spot is painful, spreading, bleeding or changing quickly, see a doctor. The app can help you find a dermatologist nearby.",
  },
  {
    q: "Do I need internet to use it?",
    a: "Not for scanning. The skin check runs on your phone, and new scans are saved locally until you reconnect. You do need internet for your first sign-in, the one-time assistant download, product search and the clinic finder.",
  },
  {
    q: "How is the 0–100 score calculated?",
    a: "The scan picks the closest match among acne, dry, eczema, normal and oily. You then answer a few questions about that condition, such as how long you've had it and how severe it is. Each answer is worth points, and the total becomes your score: Excellent (85+), Good (70+), Fair (50+), Poor (30+) or Critical.",
  },
  {
    q: "Where do my photos and results go?",
    a: "The photo is analyzed on your phone. Scans, photos and results are then backed up to your account when you're online, so your history survives a phone change. If you delete your account, the stored photos and records are deleted with it.",
  },
  {
    q: "What can I do inside the app?",
    a: "Scan your skin, get a score and a daily routine, and set reminders for each step. You can also chat with Ask Derma, chart your progress, log flare-up triggers, find dermatologists within 5 km, book an appointment and export a PDF report.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#F4F7F5]" id="faq">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-8 sm:mb-12 space-y-3 px-1">
          <SectionPill>FAQ</SectionPill>
          <Reveal>
            <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] sm:text-[16px] text-[#3F4A44]">
              Scans, scores, privacy and what the app can&apos;t do.
            </p>
          </Reveal>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`bg-white rounded-[18px] sm:rounded-[20px] border p-5 sm:p-6 transition-colors min-w-0 ${
                  isOpen ? "border-[#15803D]/40 shadow-sm" : "border-[#E5EDE8]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex items-center justify-between w-full cursor-pointer text-left gap-3 sm:gap-4 min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-display text-[16px] sm:text-[18px] font-semibold text-[#10241A] leading-snug">{f.q}</h3>
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
                      <p className="mt-4 text-[15px] sm:text-[16px] text-[#6B7280] leading-relaxed border-t border-[#EEF2EF] pt-4 text-pretty">
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
