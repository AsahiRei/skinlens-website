"use client";

import { motion } from "motion/react";
import { Reveal, SectionPill } from "./Reveal";

const CARDS = [
  {
    title: "Guided Photo",
    body: "The camera checks your lighting and framing before taking the shot. You can capture front, left and right angles, or pick a photo from your gallery.",
    foot: "Camera or gallery",
  },
  {
    title: "Skin Condition Check",
    body: "A model built into the app sorts your photo into acne, dry, eczema, oily or normal, and shows how closely it matched each one.",
    foot: "acne · dry · eczema · normal · oily",
  },
  {
    title: "0–100 Health Score",
    body: "After the scan, you answer a few questions about the condition: how long you've had it, how bad it is, and where it shows up. Your answers set the score, from Excellent down to Critical.",
    foot: "Scan + short survey",
  },
  {
    title: "Daily Routine",
    body: "Morning, afternoon and evening steps based on your result, skin type and survey answers. Each step names the ingredient to look for, and you check steps off as you go.",
    foot: "Morning · afternoon · evening",
  },
  {
    title: "Offline First",
    body: "Scans are saved on your phone the moment you take them. Once you're online, they sync to your account, so switching phones doesn't lose your history.",
    foot: "Syncs when online",
  },
  {
    title: "Assistant, Progress & Dermatologists",
    body: "Ask Derma questions about your results and products sold in the Philippines. Track your score over time, log flare-up triggers, find dermatologists within 5 km, and book a visit.",
    foot: "Chat · progress · clinics · PDF reports",
  },
];

export function Features() {
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#F4F7F5]" id="technology">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3 px-1">
          <SectionPill>Features</SectionPill>
          <Reveal>
            <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
              From Selfie to Score to Routine
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
              A photo, a short survey, and a routine you can follow every
              day. Everything below is in the app today.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 18px 40px -18px rgba(16,36,26,.22)" }}
              className="bg-white rounded-[18px] sm:rounded-[20px] p-6 sm:p-8 border border-[#E5EDE8] shadow-xs flex flex-col justify-between cursor-default min-w-0"
            >
              <div>
                <h3 className="font-display text-[20px] leading-[28px] text-[#10241A] mb-2 font-semibold">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-[20px] text-[#3F4A44]">{c.body}</p>
              </div>
              <div className="pt-6 border-t border-[#EEF2EF] mt-6 text-[12px] text-[#15803D] font-semibold">
                <span>{c.foot}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
