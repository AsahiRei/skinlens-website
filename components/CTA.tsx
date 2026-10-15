"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Play, Zap } from "lucide-react";
import { Reveal } from "./Reveal";
import { DownloadModal } from "./DownloadModal";

// TODO: paste the Google Play URL when live — modal shows while empty.
const PLAY_STORE_URL: string = "";

export function CTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const hasStoreUrl =
    Boolean(PLAY_STORE_URL) && PLAY_STORE_URL !== "#";

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-white" id="download">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <Reveal>
          <div className="rounded-[20px] sm:rounded-[24px] bg-gradient-to-r from-[#14532D] to-[#10241A] p-6 sm:p-8 md:p-16 text-white relative overflow-hidden shadow-xl min-w-0">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#22B358]/20 rounded-full blur-3xl pointer-events-none" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -left-24 w-80 h-80 rounded-full border border-white/10 pointer-events-none"
            />
            <div className="max-w-2xl relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#95F8A7] text-[12px] border border-white/10">
                <Zap size={16} />
                Free Early Access
              </span>
              <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold tracking-tight text-balance">
                Start Your Skin Journey Today
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#AFCEBA] leading-relaxed text-pretty">
                Take a guided selfie or upload a photo, answer a short survey,
                and get your 0–100 score plus a morning, afternoon and evening
                routine. Download the app now to get started — free. Currently
                available for Android only.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-lg w-full">
                {hasStoreUrl ? (
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-full bg-[#15803D] hover:bg-[#22B358] text-white text-[14px] font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto whitespace-nowrap min-h-[48px] border border-white/20"
                  >
                    <Play size={18} />
                    <span>Download for Android</span>
                  </motion.a>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalOpen(true)}
                    className="px-7 py-3.5 rounded-full bg-[#15803D] hover:bg-[#22B358] text-white text-[14px] font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto whitespace-nowrap min-h-[48px] border border-white/20"
                  >
                    <Play size={18} />
                    <span>Download for Android</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <DownloadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
