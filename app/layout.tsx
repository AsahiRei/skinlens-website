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
    "A free Android app that checks a photo of your face for acne, dryness, eczema or oiliness, gives you a 0–100 skin health score, and builds a morning, afternoon and evening routine. The scan runs on your phone and works offline.",
  icons: {
    icon: "/skinlens-icon.png",
    apple: "/skinlens-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jakarta.variable} ${inter.variable} min-h-screen flex flex-col min-w-0 overflow-x-clip bg-[#F4F7F5] text-[#131e19] antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
