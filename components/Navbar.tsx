"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Download, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features", href: "#technology", active: true },
  { label: "How It Works", href: "#diagnostics", active: false },
  { label: "Privacy", href: "#privacy", active: false },
  { label: "Progress", href: "#clinical", active: false },
  { label: "FAQ", href: "#faq", active: false },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Features");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-shadow ${
        scrolled
          ? "bg-white/90 border-[#E5EDE8] shadow-sm"
          : "bg-white/85 border-[#E5EDE8]/60"
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-[1200px] mx-auto h-20">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/skinlens-icon.png"
            alt="SkinLens app icon"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-[#E5EDE8]"
            priority
          />
          <span className="font-display text-[20px] font-semibold tracking-tight text-[#10241A]">
            SkinLens
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setActive(l.label)}
              className={`text-[14px] font-medium pb-1 transition-all active:scale-[0.98] ${
                active === l.label
                  ? "text-[#00652c] font-semibold border-b-2 border-[#00652c]"
                  : "text-[#3f493f] hover:text-[#00652c]"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#download"
            className="custom-pill-cta text-white text-[14px] font-medium px-5 py-2.5 rounded-full shadow-sm hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>Get Early Access</span>
            <Download size={18} />
          </motion.a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full border border-[#E5EDE8] flex items-center justify-center text-[#10241A]"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-[#E5EDE8] bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  href={l.href}
                  onClick={() => {
                    setActive(l.label);
                    setOpen(false);
                  }}
                  className="py-3 px-2 rounded-xl text-[15px] font-medium text-[#10241A] hover:bg-[#EAF6EE]"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
