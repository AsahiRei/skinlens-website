"use client";

import { motion } from "motion/react";
import { LayoutGrid, Lock, MessageCircle, WifiOff } from "lucide-react";

const STATS = [
  { icon: LayoutGrid, title: "5 Skin Types", sub: "acne · dry · eczema · normal · oily" },
  { icon: Lock, title: "Private by Design", sub: "checked right on your phone" },
  { icon: WifiOff, title: "Works Offline", sub: "scan anytime, syncs later" },
  { icon: MessageCircle, title: "Routine + Chat + Map", sub: "daily steps, guidance & clinic finder" },
];

export function TrustBar() {
  return (
    <section className="bg-white border-b border-[#E5EDE8] py-6 sm:py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center min-w-0 px-1"
            >
              <s.icon size={24} className="text-[#15803D] mb-1.5 shrink-0" />
              <span className="font-display text-[15px] sm:text-[18px] font-bold text-[#10241A] leading-tight">{s.title}</span>
              <span className="text-[11px] text-[#6B7280] mt-1 leading-snug text-balance">{s.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
