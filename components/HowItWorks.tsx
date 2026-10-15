"use client";

import { motion } from "motion/react";
import { Brain, CircleCheck, Cpu, Sun } from "lucide-react";
import { Reveal, SectionPill } from "./Reveal";

const STEPS = [
  {
    n: "01",
    tag: "Capture",
    title: "Guided Photo",
    body: "Center your face in the guide. The app helps with lighting and positioning, with front, left and right angles, or choose a photo from your gallery.",
    icon: Sun,
    line1: "Step-by-step guidance",
    line2: "Good light · fill frame · hold still",
  },
  {
    n: "02",
    tag: "Analysis",
    title: "Smart Check + Survey",
    body: "Your photo is checked for acne, dry, eczema, oily or normal skin, your identity is verified, then a short survey measures severity.",
    icon: Cpu,
    line1: "Closest matches + face check",
    line2: "Quick, private and secure",
  },
  {
    n: "03",
    tag: "Action",
    title: "Score, Routine & Tracking",
    body: "Get your 0–100 score and a morning, afternoon and evening routine, then follow your progress, chat for guidance, or share a report.",
    icon: CircleCheck,
    line1: "Clear score levels",
    line2: "Steps · clinics · reports",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E5EDE8]" id="diagnostics">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <SectionPill icon={<Brain size={16} />}>How it works in the app</SectionPill>
          <Reveal>
            <h2 className="font-display text-[28px] leading-[36px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A]">
              Capture, Answer, Improve
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] text-[#3F4A44]">
              Three simple steps: capture or upload, check your skin, then get
              clear steps to follow.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-[#F4F7F5] border border-[#E5EDE8] rounded-[20px] p-8 flex flex-col justify-between relative"
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
              <div className="mt-8 bg-white border border-[#E5EDE8] rounded-[16px] p-4 flex items-center gap-3">
                <s.icon size={22} className="text-[#15803D] shrink-0" />
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
