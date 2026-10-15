import Image from "next/image";

const LINKS = [
  { label: "Features", href: "#technology" },
  { label: "How It Works", href: "#diagnostics" },
  { label: "Privacy & Sync", href: "#privacy" },
  { label: "Progress", href: "#clinical" },
  { label: "FAQ", href: "#faq" },
  { label: "Get the App", href: "#download" },
];

export function Footer() {
  return (
    <footer className="bg-[#f0fcf4] border-t border-[#E5EDE8]">
      <div className="w-full px-6 md:px-12 py-12 md:py-16 max-w-[1200px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-display text-[20px] font-semibold text-[#131e19] flex items-center gap-2">
              <Image
                src="/skinlens-icon.png"
                alt="SkinLens app icon"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5EDE8]"
              />
              <span>SkinLens</span>
            </div>
            <p className="text-[14px] text-[#3f493f]">
              Simple skin checks, 0–100 scores, daily routines and progress
              tracking.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[12px] font-semibold">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-[#3f493f] hover:text-[#00652c] underline transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-[#E5EDE8] flex flex-col gap-4 text-[11px] text-[#3f493f] leading-relaxed">
          <p>
            © 2026 SkinLens. For routine wellness insights and tracking only —
            this app does not replace a dermatologist and is not a medical
            diagnosis. If you notice unusual, painful, or rapidly changing skin
            conditions, please consult a doctor or visit a hospital.
          </p>
        </div>
      </div>
    </footer>
  );
}
