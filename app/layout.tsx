import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SkinLens — AI Skin Analysis On Your Phone",
  description:
    "SkinLens detects acne, dry, eczema, oily or normal skin right on your phone, gives you a 0–100 health score from your scan plus a short survey, and builds a morning/afternoon/evening routine. Works offline and keeps your progress saved.",
  icons: {
    icon: "/skinlens-icon.png",
    apple: "/skinlens-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jakarta.variable} ${inter.variable} min-h-screen flex flex-col bg-[#F4F7F5] text-[#131e19] antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
