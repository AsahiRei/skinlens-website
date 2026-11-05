"use client";

import { motion } from "motion/react";
import { Reveal, SectionPill } from "./Reveal";

const STEPS = [
  {
    n: "01",
    tag: "Capture",
    title: "Guided Photo",
    body: "Line your face up with the on-screen guide. The app tells you if the light is too dim or your face is off-center. You can also upload a photo instead.",
    line1: "Before the shot",
    line2: "Good light · fill the frame · hold still",
  },
  {
    n: "02",
    tag: "Analysis",
    title: "Scan + Survey",
    body: "The app checks the photo for acne, dry, eczema, oily or normal skin and confirms it's your face, not someone else's. Then it asks a few questions about the condition.",
    line1: "Match + face check",
    line2: "Runs on your phone",
  },
  {
    n: "03",
    tag: "Action",
    title: "Score, Routine & Tracking",
    body: "You get a 0–100 score and a routine for the day. Scan again later to see if the score moves, or export a PDF report to bring to a dermatologist.",
    line1: "Excellent · Good · Fair · Poor · Critical",
    line2: "Routine · progress · reports",
  },
];

export function HowItWorks() {
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-white border-b border-[#E5EDE8]" id="diagnostics">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3 px-1">
          <SectionPill>How it works</SectionPill>
          <Reveal>
            <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
              Capture, Answer, Improve
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
              Take a photo, answer a few questions, then follow the routine.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-[#F4F7F5] border border-[#E5EDE8] rounded-[18px] sm:rounded-[20px] p-6 sm:p-8 flex flex-col justify-between relative min-w-0"
            >
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-5 z-10 w-10 h-[2px] bg-gradient-to-r from-[#15803D]/50 to-transparent" />
              )}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <motion.span
                    whileHover={{ scale: 1.08 }}
                    className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-[14px]"
                  >
                    {s.n}
                  </motion.span>
                  <span className="text-[12px] text-[#15803D] font-semibold uppercase tracking-wider">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-display text-[20px] text-[#10241A] mb-3 font-semibold">{s.title}</h3>
                <p className="text-[14px] text-[#3F4A44] leading-relaxed">{s.body}</p>
              </div>
              <div className="mt-8 bg-white border border-[#E5EDE8] rounded-[16px] p-4">
                <div className="text-[12px]">
                  <p className="font-semibold text-[#10241A]">{s.line1}</p>
                  <p className="text-[#6B7280]">{s.line2}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
