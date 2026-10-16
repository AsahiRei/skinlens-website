"use client";

import { motion } from "motion/react";
import {
  Check,
  CloudOff,
  EyeOff,
  KeyRound,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";
import { Reveal, SectionPill } from "./Reveal";

const CLOUD_CONS = [
  "Many skincare apps upload full-resolution selfies to remote servers.",
  "Central photo libraries become breach targets when credentials leak.",
  "Cloud-only analysis fails completely when you're offline.",
];

const EDGE_PROS = [
  "Your scan is checked right on your phone — no waiting.",
  "Scans are saved on your phone so the app works offline.",
  "Everything is backed up automatically once you're back online.",
];

export function Privacy() {
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#F4F7F5]" id="privacy">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#E5EDE8] p-5 sm:p-8 md:p-14 shadow-xs min-w-0">
          <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
            <Reveal>
              <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
                Your Scan Stays With You
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
                SkinLens checks your photo right on your phone. Your results are
                saved on your device first, then backed up securely in the
                background once you have a connection.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[18px] sm:rounded-[20px] p-5 sm:p-8 space-y-4 min-w-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#92400E] flex items-center justify-center shrink-0">
                  <CloudOff size={20} />
                </div>
                <h4 className="font-display text-[16px] sm:text-[18px] font-bold text-[#92400E] leading-snug">
                  Typical Cloud-Only Apps
                </h4>
              </div>
              <ul className="space-y-3 text-[14px] text-[#92400E]">
                {CLOUD_CONS.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <X size={18} className="mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              whileHover={{ scale: 1.01 }}
              className="bg-[#EAF6EE] border border-[#DCFCE7] rounded-[18px] sm:rounded-[20px] p-5 sm:p-8 space-y-4 min-w-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#15803D] flex items-center justify-center shrink-0">
                  <Shield size={20} />
                </div>
                <h4 className="font-display text-[16px] sm:text-[18px] font-bold text-[#14532D] leading-snug">
                  How SkinLens Actually Works
                </h4>
              </div>
              <ul className="space-y-3 text-[14px] text-[#14532D]">
                {EDGE_PROS.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <Check size={18} className="text-[#15803D] mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#EEF2EF] flex flex-wrap items-center justify-start sm:justify-between gap-x-6 gap-y-4">
            {[
              { icon: ShieldCheck, label: "Sign in with email or Google" },
              { icon: KeyRound, label: "Saves offline, backs up online" },
              { icon: EyeOff, label: "Face check keeps results yours" },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 min-w-0"
              >
                <b.icon size={20} className="text-[#15803D] shrink-0" />
                <span className="text-[13px] sm:text-[14px] font-semibold text-[#10241A]">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
