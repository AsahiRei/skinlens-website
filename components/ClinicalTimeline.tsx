"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ScanFace, Sparkles, TrendingUp } from "lucide-react";
import { Reveal, SectionPill } from "./Reveal";

const METRICS = [
  { label: "Routine Adherence", delta: "AM / PM steps checked", width: 84 },
  { label: "Sensitivity History", delta: "Logged per scan", width: 68 },
  { label: "Health-Score Trend", delta: "0–100 over time", width: 54 },
];

function SkinCard({
  day,
  score,
  scoreTone,
  barrier,
  barrierTone,
  tewl,
  tewlTone,
  active,
  gradient,
  highlight,
}: {
  day: string;
  score: string;
  scoreTone: string;
  barrier: string;
  barrierTone: string;
  tewl: string;
  tewlTone: string;
  active: string;
  gradient: string;
  highlight?: boolean;
}) {
  return (
      <div
      className={`bg-white rounded-[18px] sm:rounded-[20px] p-4 sm:p-5 border shadow-xs min-w-0 ${
        highlight ? "border-[#15803D]/30 ring-1 ring-[#15803D]/20" : "border-[#E5EDE8]"
      }`}
    >
      <div className="flex justify-between items-center gap-2 mb-3">
        <span className="font-semibold text-[14px] text-[#10241A] truncate">{day}</span>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 ${scoreTone}`}>
          {score}
        </span>
      </div>
      <div className={`h-36 sm:h-44 rounded-[14px] overflow-hidden relative ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <ScanFace size={56} className="text-white/50" strokeWidth={1.2} />
        </div>
        {/* simulated skin texture rings */}
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,.7),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,.4),transparent_40%)]" />
        <div
          className={`absolute bottom-2 left-2 px-2 py-1 backdrop-blur-md rounded-md text-white text-[11px] font-mono ${barrierTone}`}
        >
          {barrier}
        </div>
      </div>
      <div className="mt-3 text-[12px] text-[#6B7280] space-y-1">
        <div className="flex justify-between">
          <span>Transepidermal Water Loss:</span>
          <span className={`${tewlTone} font-medium`}>{tewl}</span>
        </div>
        <div className="flex justify-between">
          <span>Targeted Active:</span>
          <span className="text-[#10241A] font-medium">{active}</span>
        </div>
      </div>
    </div>
  );
}

export function ClinicalTimeline() {
  const [view, setView] = useState<"both" | "day1" | "day28">("both");

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-white border-b border-[#E5EDE8]" id="clinical">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3 px-1">
          <SectionPill icon={<TrendingUp size={16} />}>Progress Tracking</SectionPill>
          <Reveal>
            <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
              Watch Your Score Change Scan to Scan
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
              The Progress tab charts your 0–100 scores, routine completion and
              sensitivity history — the same data you can share as a report
              with your dermatologist.
            </p>
          </Reveal>
          {/* Interactive view toggle */}
          <div className="inline-flex items-center gap-1 p-1 mt-4 rounded-full bg-[#F4F7F5] border border-[#E5EDE8] max-w-full">
            {(["both", "day1", "day28"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 sm:px-4 py-2 rounded-full text-[13px] font-semibold transition-all min-h-[36px] whitespace-nowrap cursor-pointer ${
                  view === v ? "bg-[#10241A] text-white shadow" : "text-[#3F4A44] hover:text-[#10241A]"
                }`}
              >
                {v === "both" ? "Compare" : v === "day1" ? "Day 01" : "Day 28"}
              </button>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-[#F4F7F5] rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 md:p-12 border border-[#E5EDE8] min-w-0">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-h-[320px] min-w-0">
              <AnimatePresence mode="popLayout">
                {(view === "both" || view === "day1") && (
                  <motion.div
                    key="day1"
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                  >
                    <SkinCard
                      day="Earlier Scan"
                      score="Score: 58/100"
                      scoreTone="bg-[#FFFBEB] text-[#92400E]"
                      barrier="Detected: Acne"
                      barrierTone="bg-black/60"
                      tewl="Survey: Fair band"
                      tewlTone="text-[#92400E]"
                      active="Salicylic Acid + Niacinamide"
                      gradient="bg-gradient-to-br from-[#e8b48c] via-[#d99a76] to-[#c98a68]"
                    />
                  </motion.div>
                )}
                {(view === "both" || view === "day28") && (
                  <motion.div
                    key="day28"
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                  >
                    <SkinCard
                      highlight
                      day="Latest Scan"
                      score="Score: 82/100"
                      scoreTone="bg-[#EAF6EE] text-[#15803D]"
                      barrier="Detected: Normal"
                      barrierTone="bg-[#14532D]/80"
                      tewl="Survey: Good band"
                      tewlTone="text-[#15803D]"
                      active="Vitamin C + Ceramides + SPF"
                      gradient="bg-gradient-to-br from-[#f3c9a5] via-[#eebd92] to-[#e2a87e]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-5 space-y-5 sm:space-y-6 min-w-0">
              <h3 className="font-display text-[20px] leading-[28px] sm:text-[24px] sm:leading-[32px] font-semibold text-[#10241A] flex items-center gap-2 text-balance">
                <Sparkles size={22} className="text-[#15803D] shrink-0" />
                Real App Data, Not Stock Photos
              </h3>
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
                Every scan saves your result, answers, score and routine, so
                trends reflect your own history over time.
              </p>
              <div className="space-y-4">
                {METRICS.map((m, i) => (
                  <div key={m.label} className="space-y-1.5 min-w-0">
                    <div className="flex justify-between items-baseline gap-3 text-[13px] sm:text-[14px]">
                      <span className="font-medium text-[#10241A] truncate">{m.label}</span>
                      <span className="font-bold text-[#15803D] whitespace-nowrap shrink-0 text-[12px] sm:text-[14px]">{m.delta}</span>
                    </div>
                    <div className="w-full bg-[#E5EDE8] rounded-full h-2.5">
                      <motion.div
                        className="bg-[#15803D] h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.width}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <a
                  href="#faq"
                  className="text-[#15803D] font-semibold flex items-center gap-1.5 hover:underline text-[14px]"
                >
                  <span>Read the FAQ on scores, surveys and routines</span>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
