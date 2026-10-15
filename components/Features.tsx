"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Database,
  Droplets,
  FlaskConical,
  Focus,
  Gauge,
  HeartPulse,
  LayoutGrid,
} from "lucide-react";
import { Reveal, SectionPill } from "./Reveal";

const CARDS = [
  {
    icon: Focus,
    title: "Guided Capture",
    body: "The camera guides you with lighting and positioning tips. Capture front, left and right angles, or upload a photo from your gallery.",
    foot: "Camera + gallery input",
  },
  {
    icon: LayoutGrid,
    title: "Smart Skin Detection",
    body: "Recognizes acne, dry, eczema, oily and normal skin and shows your closest matches with clear, easy-to-understand explanations.",
    foot: "acne · dry · eczema · normal · oily",
  },
  {
    icon: Gauge,
    title: "0–100 Health Score",
    body: "Combines your scan result with your short survey answers into one simple 0–100 score, from Excellent to Critical.",
    foot: "Scan + survey score",
  },
  {
    icon: Droplets,
    title: "Personalized Routine",
    body: "Get morning, afternoon and evening steps matched to your skin profile and lifestyle, with ingredients picked for your concern.",
    foot: "Morning / afternoon / evening",
  },
  {
    icon: Database,
    title: "Works Offline, Stays in Sync",
    body: "Every scan is saved on your phone right away. When you're back online, everything is backed up automatically.",
    foot: "Auto backup when online",
  },
  {
    icon: HeartPulse,
    title: "Chat, Progress & Clinic Finder",
    body: "Ask questions with your scan history in mind, follow your score over time, and find nearby skin clinics on the map.",
    foot: "Assistant · progress · map · reports",
  },
];

export function Features() {
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#F4F7F5]" id="technology">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3 px-1">
          <SectionPill icon={<FlaskConical size={16} />}>What the app actually does</SectionPill>
          <Reveal>
            <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
              From Selfie to Score to Routine
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
              SkinLens checks your skin right on your phone: a quick scan, a
              short survey, and a daily routine made for you — all saved even
              without internet.
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
                <div className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center mb-6">
                  <c.icon size={24} />
                </div>
                <h3 className="font-display text-[20px] leading-[28px] text-[#10241A] mb-2 font-semibold">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-[20px] text-[#3F4A44]">{c.body}</p>
              </div>
              <div className="pt-6 border-t border-[#EEF2EF] mt-6 flex items-center justify-between text-[12px] text-[#15803D] font-semibold">
                <span>{c.foot}</span>
                <ArrowRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
