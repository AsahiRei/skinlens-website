import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Privacy } from "@/components/Privacy";
import { ClinicalTimeline } from "@/components/ClinicalTimeline";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Privacy />
        <ClinicalTimeline />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
