"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  BatteryFull,
  Bell,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  ClipboardList,
  Home,
  MessageSquareText,
  ScanLine,
  Signal,
  Smartphone,
  Sparkles,
  Stethoscope,
  Sun,
  TrendingUp,
  User,
  Wifi,
  Zap,
} from "lucide-react";
import { useRef } from "react";

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



function PhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const score = useCountUp(69, inView);
  const R = 27;
  const C = 2 * Math.PI * R;
  const offset = C - (C * Math.min(score, 100)) / 100;

  return (
    <div ref={ref} className="w-full max-w-[300px] min-[400px]:max-w-[320px] rounded-[36px] sm:rounded-[44px] bg-[#10241A] p-2.5 sm:p-3.5 glass-phone relative mx-auto">
      <div className="rounded-[28px] sm:rounded-[36px] bg-[#EFF6F0] overflow-hidden border border-[#E5EDE8] flex flex-col h-[540px] min-[400px]:h-[580px] relative">
        <div className="pt-3 px-4 sm:px-6 flex justify-between items-center text-[11px] text-[#10241A] bg-[#EFF6F0] z-10">
          <span className="font-semibold">9:41</span>
          <div className="w-14 sm:w-16 h-4 bg-[#10241A] rounded-full mx-auto shrink-0" />
          <div className="flex items-center gap-1 shrink-0">
            <Signal size={14} />
            <Wifi size={14} />
            <BatteryFull size={14} />
          </div>
        </div>

        <div className="phone-scroll flex-1 overflow-y-auto px-3 pt-1.5 pb-24 space-y-2.5">
          {/* Greeting */}
          <div className="flex items-start justify-between px-1 pt-1">
            <div>
              <p className="text-[11px] leading-[14px] font-medium text-[#7A8580]">Good morning</p>
              <p className="text-[21px] leading-[24px] font-extrabold text-[#101815] tracking-tight">Test</p>
            </div>
            <div className="relative w-8 h-8 rounded-full bg-white shadow-sm border border-[#E5EDE8] flex items-center justify-center">
              <Bell size={15} className="text-[#15803D]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E53935] ring-2 ring-white" />
            </div>
          </div>

          {/* Skin Health */}
          <p className="px-1 text-[14px] font-bold text-[#101815] tracking-tight">Skin Health</p>
          <div className="rounded-[20px] p-3 flex gap-2.5 items-center bg-gradient-to-br from-[#245A3C] via-[#123324] to-[#07130D] shadow-md">
            <div className="relative w-[68px] h-[68px] shrink-0 flex items-center justify-center">
              <svg className="w-[68px] h-[68px] -rotate-90" viewBox="0 0 68 68">
                <circle cx="34" cy="34" fill="transparent" r={R} stroke="rgba(255,255,255,0.22)" strokeWidth="7" />
                <motion.circle
                  cx="34"
                  cy="34"
                  fill="transparent"
                  r={R}
                  stroke="#FFFFFF"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={inView ? { strokeDashoffset: offset } : {}}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <span className="absolute text-white text-[15px] font-extrabold tabular-nums">{score}%</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold tracking-[0.12em] text-[#A8D5B5]">HEALTH SCORE</p>
              <p className="text-[14px] font-extrabold text-white leading-[17px] mt-0.5">Fair Progress</p>
              <p className="text-[8.5px] leading-[11px] text-[#C9D8CE]/90 mt-1">
                There&apos;s room to improve. Your routine for your normal skin, with a focus on dryness targets the key habits holding your skin health back.
              </p>
              <div className="mt-1.5 inline-flex px-3 py-1 rounded-full bg-white text-[#146334] text-[10px] font-bold">
                View Progress
              </div>
            </div>
          </div>

          {/* Today's Routine */}
          <p className="px-1 text-[14px] font-bold text-[#101815] tracking-tight">Today&apos;s Routine</p>
          <div className="rounded-[20px] bg-white border border-[#E5EDE8] shadow-sm p-3">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-[#EFF6F0] flex items-center justify-center">
                <ChevronLeft size={13} className="text-[#15803D]" />
              </div>
              <div className="flex items-center gap-1">
                <Sun size={13} className="text-[#15803D]" />
                <span className="text-[12.5px] font-bold text-[#101815]">Morning Routine</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#EFF6F0] flex items-center justify-center">
                <ChevronRight size={13} className="text-[#15803D]" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <span className="w-5 h-1 rounded-full bg-[#15803D]" />
              <span className="w-1 h-1 rounded-full bg-[#DDE7E0]" />
              <span className="w-1 h-1 rounded-full bg-[#DDE7E0]" />
            </div>
            <div className="flex justify-center mt-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6F0] text-[#14432F] text-[10px] font-bold">2 / 3 done</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#EFF6F0] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#15803D]"
                initial={{ width: 0 }}
                animate={inView ? { width: "66%" } : {}}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2.5 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full bg-[#15803D] flex items-center justify-center">
                  <Check size={15} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[8.5px] leading-[10px] font-medium text-[#7A8580]">Hydrating Cleanser</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full bg-[#15803D] flex items-center justify-center">
                  <Check size={15} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[8.5px] leading-[10px] font-medium text-[#7A8580]">Moisture Repair ...</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full border-[1.5px] border-[#15803D] bg-white flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                </div>
                <span className="text-[8.5px] leading-[10px] font-medium text-[#7A8580]">Sunscreen</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <p className="px-1 text-[14px] font-bold text-[#101815] tracking-tight">Quick Actions</p>
          <div className="rounded-[20px] p-2.5 flex items-center gap-2.5 bg-gradient-to-br from-[#245A3C] via-[#123324] to-[#07130D] shadow-md">
            <div className="w-[42px] h-[42px] rounded-[14px] bg-gradient-to-br from-[#2FB768] to-[#15803D] flex items-center justify-center shrink-0">
              <Camera size={19} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13.5px] font-bold leading-[16px]">Scan Your Skin</p>
              <p className="text-[#BFD4C5] text-[10px]">Take or upload a photo</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-[16px] bg-white border border-[#E5EDE8] p-2 flex flex-col items-center gap-0.5 shadow-sm">
              <div className="w-9 h-9 rounded-[12px] bg-[#EFF6F0] flex items-center justify-center">
                <MessageSquareText size={17} className="text-[#15803D]" />
              </div>
              <p className="text-[10.5px] font-bold text-[#101815]">Ask Derma</p>
              <p className="text-[8.5px] text-[#7A8580] -mt-0.5">Chat advice</p>
            </div>
            <div className="rounded-[16px] bg-white border border-[#E5EDE8] p-2 flex flex-col items-center gap-0.5 shadow-sm">
              <div className="w-9 h-9 rounded-[12px] bg-[#EFF6F0] flex items-center justify-center">
                <TrendingUp size={17} className="text-[#15803D]" />
              </div>
              <p className="text-[10.5px] font-bold text-[#101815]">Progress</p>
              <p className="text-[8.5px] text-[#7A8580] -mt-0.5">View trends</p>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-2 left-2 right-2 rounded-[22px] bg-gradient-to-br from-[#245A3C] via-[#123324] to-[#07130D] px-1.5 py-1.5 flex items-end justify-between shadow-lg">
          <div className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-[16px] bg-white/15 flex-1">
            <Home size={15} className="text-white" />
            <span className="text-[8px] font-bold text-white">Home</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-1.5 py-1 flex-1 opacity-60">
            <ClipboardList size={15} className="text-white" />
            <span className="text-[8px] font-medium text-white">Routine</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-1 -mt-6">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md ring-4 ring-[#123324]/30">
              <ScanLine size={19} className="text-[#15803D]" />
            </div>
            <span className="text-[8px] font-medium text-white/80">Scan</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-1.5 py-1 flex-1 opacity-60">
            <Stethoscope size={15} className="text-white" />
            <span className="text-[8px] font-medium text-white">Derma</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-1.5 py-1 flex-1 opacity-60">
            <User size={15} className="text-white" />
            <span className="text-[8px] font-medium text-white">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero-wash relative pt-10 sm:pt-12 md:pt-20 pb-14 sm:pb-20 md:pb-28 overflow-hidden border-b border-[#E5EDE8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="lg:col-span-7 flex flex-col items-start min-w-0 space-y-5 sm:space-y-6"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="inline-flex max-w-full flex-wrap justify-center sm:justify-start items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#EAF6EE] border border-[#DCFCE7] text-[#15803D] text-[11px] sm:text-[12px] font-semibold shadow-xs text-center sm:text-left"
            >
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse shrink-0" />
              <span className="break-words">Smart skin checks • 0–100 score • Daily routine</span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65 }}
              className="font-display text-[32px] leading-[40px] min-[400px]:text-[36px] min-[400px]:leading-[44px] sm:text-[56px] sm:leading-[64px] font-bold tracking-tight text-[#10241A] text-balance"
            >
              Know Your Skin, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#2E6A41]">
                Right On Your Phone
              </span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65 }}
              className="text-[16px] leading-[26px] sm:text-[18px] sm:leading-[28px] text-[#3F4A44] max-w-xl text-pretty"
            >
              Stop guessing — start glowing. Snap one 30-second selfie and
              SkinLens instantly reads your skin, reveals your 0–100 health
              score, and builds your perfect morning / afternoon / evening
              routine for acne, dryness, eczema, oiliness and more. 100%
              private, right on your phone — even offline.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65 }}
              className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto"
            >
              <motion.a
                whileHover={{ scale: 1.04, boxShadow: "0 12px 30px -8px rgba(16,36,26,.35)" }}
                whileTap={{ scale: 0.97 }}
                href="#download"
                className="custom-pill-cta text-white text-[14px] font-medium px-7 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto min-h-[48px]"
              >
                <Smartphone size={20} />
                <span>Get the App</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="#diagnostics"
                className="bg-white border border-[#E5EDE8] hover:bg-[#EAF6EE] text-[#10241A] text-[14px] font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-xs w-full sm:w-auto min-h-[48px]"
              >
                <CirclePlay size={20} className="text-[#15803D]" />
                <span>See How It Works</span>
              </motion.a>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-3 sm:pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] sm:text-[14px] text-[#3F4A44]"
            >
              <span>5 skin types detected</span>
              <span className="text-[#9CA3AF]">•</span>
              <span>Works offline</span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#E5EDE8] text-[#14532D] font-medium text-[11px] max-w-full">
                Wellness tracking — not a medical diagnosis
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5 relative flex justify-center min-w-0 w-full"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#DCFCE7]/60 to-white/40 rounded-full blur-3xl -z-10" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-2 xl:-left-10 top-16 hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#E5EDE8] p-3.5 rounded-[20px] shadow-sm z-20 max-w-[230px]"
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
              className="absolute -right-2 xl:-right-10 bottom-16 hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#E5EDE8] p-3.5 rounded-[20px] shadow-sm z-20 max-w-[230px]"
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
