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

  const goTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    e.preventDefault();
    setActive(label);
    setOpen(false);
    // Let the dropdown start closing so layout settles, then scroll.
    // scroll-margin-top in globals.css offsets the sticky header.
    window.setTimeout(() => {
      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        try {
          window.history.replaceState(null, "", href);
        } catch {
          /* ignore */
        }
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        (target as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        try {
          window.history.replaceState(null, "", href);
        } catch {
          /* ignore */
        }
      } else {
        window.location.hash = href;
      }
    }, 60);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);

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
      <div className="flex justify-between items-center gap-3 w-full px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto h-16 sm:h-20">
        <a
          href="#top"
          onClick={(e) => goTo(e, "#top", "Features")}
          className="flex items-center gap-2 min-w-0 shrink-0"
        >
          <Image
            src="/skinlens-icon.png"
            alt="SkinLens app icon"
            width={36}
            height={36}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-sm ring-1 ring-[#E5EDE8] shrink-0"
            priority
          />
          <span className="font-display text-[18px] sm:text-[20px] font-semibold tracking-tight text-[#10241A] truncate">
            SkinLens
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => goTo(e, l.href, l.label)}
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#download"
            onClick={(e) => goTo(e, "#download", active)}
            className="custom-pill-cta text-white text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:opacity-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="sm:hidden">Get App</span>
            <span className="hidden sm:inline">Get Early Access</span>
            <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
          </motion.a>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full border border-[#E5EDE8] flex items-center justify-center text-[#10241A] shrink-0 bg-white"
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
            <div className="px-4 sm:px-6 py-3 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => goTo(e, l.href, l.label)}
                    className="py-3 px-3 rounded-xl text-[15px] font-medium text-[#10241A] hover:bg-[#EAF6EE] active:bg-[#EAF6EE] min-h-[44px] flex items-center cursor-pointer"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
