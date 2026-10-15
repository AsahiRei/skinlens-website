"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  BatteryFull,
  CircleCheck,
  CirclePlay,
  Signal,
  Smartphone,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return value;
}

const PREDICTIONS = [
  { label: "Oily", pct: 62, bar: "bg-[#D97706]", track: "bg-[#FFFBEB]", text: "text-[#D97706]" },
  { label: "Acne", pct: 24, bar: "bg-[#B45309]", track: "bg-[#FEF3C7]", text: "text-[#B45309]" },
  { label: "Normal", pct: 9, bar: "bg-[#15803D]", track: "bg-[#EAF6EE]", text: "text-[#15803D]" },
];

function PhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const score = useCountUp(72, inView);
  const R = 50;
  const C = 2 * Math.PI * R;
  const offset = C - (C * Math.min(score, 100)) / 100;

  return (
    <div ref={ref} className="w-[300px] sm:w-[320px] rounded-[44px] bg-[#10241A] p-3.5 glass-phone relative">
      <div className="rounded-[36px] bg-white overflow-hidden border border-[#E5EDE8] flex flex-col h-[580px]">
        <div className="pt-3 px-6 flex justify-between items-center text-[11px] text-[#10241A]">
          <span className="font-semibold">9:41</span>
          <div className="w-16 h-4 bg-[#10241A] rounded-full mx-auto" />
          <div className="flex items-center gap-1">
            <Signal size={14} />
            <Wifi size={14} />
            <BatteryFull size={14} />
          </div>
        </div>

        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-[#EEF2EF]">
          <div className="flex items-center gap-2">
            <Image
              src="/skinlens-icon.png"
              alt="SkinLens"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5EDE8]"
            />
            <span className="font-display text-[15px] font-bold text-[#10241A]">SkinLens</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#EAF6EE] text-[#15803D] text-[10px] font-semibold">
            SMART SCAN
          </span>
        </div>

        <div className="phone-scroll p-4 space-y-4 overflow-y-auto">
          <div className="bg-[#F4F7F5] border border-[#E5EDE8] rounded-[20px] p-4 text-center flex flex-col items-center">
            <p className="text-[14px] text-[#3F4A44] mb-2 font-medium">Skin Health Score</p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" fill="transparent" r={R} stroke="#DCFCE7" strokeWidth="9" />
                <motion.circle
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r={R}
                  stroke="#15803D"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={inView ? { strokeDashoffset: offset } : {}}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#10241A] tracking-tight tabular-nums">
                  {score}
                </span>
                <span className="text-[11px] font-medium text-[#6B7280]">/ 100 Good</span>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EE] text-[#15803D] text-[11px] font-semibold">
              <CircleCheck size={14} />
              Scan + short survey
            </div>
          </div>

          <div className="bg-white border border-[#E5EDE8] rounded-[20px] p-3.5 space-y-3">
            <p className="text-[14px] text-[#10241A] font-semibold flex items-center justify-between">
              <span>Your Results</span>
              <span className="text-[11px] font-normal text-[#6B7280]">acne · dry · eczema · normal · oily</span>
            </p>
            {PREDICTIONS.map((p, i) => (
              <div key={p.label} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-[#10241A]">{p.label}</span>
                  <span className={`font-bold ${p.text}`}>{p.pct}%</span>
                </div>
                <div className={`w-full ${p.track} rounded-full h-2 overflow-hidden`}>
                  <motion.div
                    className={`${p.bar} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${p.pct}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + i * 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-[#EEF2EF] bg-white mt-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-full custom-pill-cta text-white text-center text-[14px] font-medium cursor-pointer"
          >
            View Morning / Evening Routine
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero-wash relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-[#E5EDE8]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="lg:col-span-7 flex flex-col items-start space-y-6"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF6EE] border border-[#DCFCE7] text-[#15803D] text-[12px] font-semibold shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
              <span>Smart skin checks • 0–100 score • Daily routine</span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65 }}
              className="font-display text-[36px] leading-[44px] sm:text-[56px] sm:leading-[64px] font-bold tracking-tight text-[#10241A]"
            >
              Know Your Skin, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#2E6A41]">
                Right On Your Phone
              </span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65 }}
              className="text-[18px] leading-[28px] text-[#3F4A44] max-w-xl"
            >
              Take a guided selfie or pick from your gallery to detect acne, dry,
              eczema, oily or normal skin. Answer a short survey to get
              your 0–100 health score plus a personalized morning / afternoon /
              evening routine — your scan is checked right on your phone, and
              your progress stays saved even without internet.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65 }}
              className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <motion.a
                whileHover={{ scale: 1.04, boxShadow: "0 12px 30px -8px rgba(16,36,26,.35)" }}
                whileTap={{ scale: 0.97 }}
                href="#download"
                className="custom-pill-cta text-white text-[14px] font-medium px-7 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2.5"
              >
                <Smartphone size={20} />
                <span>Get the App</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="#diagnostics"
                className="bg-white border border-[#E5EDE8] hover:bg-[#EAF6EE] text-[#10241A] text-[14px] font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <CirclePlay size={20} className="text-[#15803D]" />
                <span>See How It Works</span>
              </motion.a>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-4 flex flex-wrap items-center gap-4 text-[14px] text-[#3F4A44]"
            >
              <span>5 skin types detected</span>
              <span className="text-[#9CA3AF]">•</span>
              <span>Works offline</span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#E5EDE8] text-[#14532D] font-medium text-[11px]">
                Wellness tracking — not a medical diagnosis
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#DCFCE7]/60 to-white/40 rounded-full blur-3xl -z-10" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-16 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#E5EDE8] p-3.5 rounded-[20px] shadow-sm z-20"
            >
              <div className="w-10 h-10 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-[12px] text-[#10241A] font-semibold">Private by Design</p>
                <p className="text-[11px] text-[#6B7280]">Checked right on your phone</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -right-6 bottom-16 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#E5EDE8] p-3.5 rounded-[20px] shadow-sm z-20"
            >
              <div className="w-10 h-10 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-[12px] text-[#10241A] font-semibold">Routine Ready</p>
                <p className="text-[11px] text-[#6B7280]">Morning / afternoon / evening</p>
              </div>
            </motion.div>

            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
