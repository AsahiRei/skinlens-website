"use client";

import { motion } from "motion/react";
import { Reveal } from "./Reveal";

const ON_PHONE = [
  "The skin check runs on your phone. No server sees the photo to analyze it.",
  "Ask Derma runs on your phone too, after a one-time model download.",
  "New scans are saved locally first, so the app works without a signal.",
];

const IN_ACCOUNT = [
  "When you're online, scans, photos and results back up to your account.",
  "Your enrolled face is used to check that new scans are really you.",
  "Deleting your account deletes the photos and records stored with it.",
];

export function Privacy() {
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#F4F7F5]" id="privacy">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#E5EDE8] p-5 sm:p-8 md:p-14 shadow-xs min-w-0">
          <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
            <Reveal>
              <h2 className="font-display text-[26px] leading-[34px] sm:text-[40px] sm:leading-[48px] font-semibold text-[#10241A] text-balance">
                Where Your Data Goes
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] text-pretty">
                Here is what happens on your phone and what gets saved to your
                account.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="bg-[#F4F7F5] border border-[#E5EDE8] rounded-[18px] sm:rounded-[20px] p-5 sm:p-8 space-y-4 min-w-0"
            >
              <h4 className="font-display text-[16px] sm:text-[18px] font-bold text-[#10241A] leading-snug">
                  On Your Phone
                </h4>
              <ul className="space-y-3 text-[14px] list-disc pl-5 marker:text-[#15803D] text-[#10241A]">
                {ON_PHONE.map((c) => (
                  <li key={c}>{c}</li>
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
              <h4 className="font-display text-[16px] sm:text-[18px] font-bold text-[#14532D] leading-snug">
                  In Your Account
                </h4>
              <ul className="space-y-3 text-[14px] list-disc pl-5 marker:text-[#15803D] text-[#14532D]">
                {IN_ACCOUNT.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#EEF2EF] flex flex-wrap items-center justify-start sm:justify-between gap-x-6 gap-y-4">
            {[
              { label: "Sign in with email or Google" },
              { label: "First sign-in needs internet" },
              { label: "Delete your account anytime" },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-0"
              >
                <span className="text-[13px] sm:text-[14px] font-semibold text-[#10241A]">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
