"use client";

import Image from "next/image";
import { motion } from "motion/react";

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
              Take a photo of your face and SkinLens checks it for acne,
              dryness, eczema, oiliness or normal skin. A few follow-up
              questions turn that into a 0–100 skin health score and a
              morning, afternoon and evening routine. The scan runs on your
              phone, so it works without internet.
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
                <span>Get the App</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="#diagnostics"
                className="bg-white border border-[#E5EDE8] hover:bg-[#EAF6EE] text-[#10241A] text-[14px] font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-xs w-full sm:w-auto min-h-[48px]"
              >
                <span>See How It Works</span>
              </motion.a>
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
              <div>
                <p className="text-[12px] text-[#10241A] font-semibold">Scans on Your Phone</p>
                <p className="text-[11px] text-[#6B7280]">No internet needed to scan</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -right-2 xl:-right-10 bottom-16 hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#E5EDE8] p-3.5 rounded-[20px] shadow-sm z-20 max-w-[230px]"
            >
              <div>
                <p className="text-[12px] text-[#10241A] font-semibold">Daily Routine</p>
                <p className="text-[11px] text-[#6B7280]">Morning, afternoon and evening</p>
              </div>
            </motion.div>

            <Image
              src="/assets/nerma.png"
              alt="SkinLens mascot in a lab coat checking her skin in a hand mirror"
              width={829}
              height={1051}
              preload
              unoptimized
              sizes="(min-width: 1024px) 340px, 300px"
              className="w-full max-w-[280px] min-[400px]:max-w-[300px] lg:max-w-[340px] h-auto mx-auto drop-shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
