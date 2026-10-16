"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { adminLogin } from "./actions";

const initialState: { error?: string } = {};

export function AdminLogin() {
  const [state, formAction, isPending] = useActionState(
    adminLogin,
    initialState
  );

  return (
    <div className="hero-wash min-h-screen flex items-center justify-center px-4 sm:px-6 py-14 sm:py-20 border-b border-[#E5EDE8]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white border border-[#E5EDE8] text-[#3f493f] text-[13px] font-medium hover:bg-[#EAF6EE] hover:text-[#00652c] transition-all active:scale-[0.98]"
        >
          <ArrowLeft size={15} />
          Back to site
        </Link>

        <div className="bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 border border-[#E5EDE8] shadow-xs">
          <div className="flex items-center gap-2.5">
            <Image
              src="/skinlens-icon.png"
              alt="SkinLens app icon"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-[#E5EDE8]"
            />
            <div>
              <p className="font-display text-[17px] font-semibold tracking-tight text-[#10241A] leading-none">
                SkinLens
              </p>
              <p className="text-[12px] text-[#6B7280] mt-1">Admin page</p>
            </div>
          </div>
          <h1 className="font-display text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] font-semibold tracking-tight text-[#10241A] text-balance mt-3">
            Admin {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#2E6A41]">
              Login
            </span>
          </h1>
          <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-2 text-pretty">
            Enter your admin password to continue.
          </p>

          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <label
              htmlFor="admin-password"
              className="text-[12px] font-semibold tracking-wide text-[#3F4A44]"
            >
              Password
            </label>
            <div className="flex items-center gap-2.5 h-[52px] rounded-full bg-white border border-[#E5EDE8] px-4 focus-within:border-[#15803D] focus-within:ring-2 focus-within:ring-[#15803D]/15 transition-all">
              <LockKeyhole size={18} className="text-[#15803D] shrink-0" />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter password"
                className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-[#10241A] placeholder:text-[#9CA3AF]"
              />
            </div>
            {state?.error ? (
              <p
                role="alert"
                className="text-[13px] font-medium text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-[16px] px-4 py-2.5"
              >
                {state.error}
              </p>
            ) : null}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="custom-pill-cta text-white text-[14px] font-medium px-7 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-60 w-full"
            >
              {isPending ? "Checking…" : "Unlock admin"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
