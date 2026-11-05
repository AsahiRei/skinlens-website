import { SplashScreen } from "@/components/SplashScreen";
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
import { getDownloadUrl } from "@/lib/site-settings";

export default async function Home() {
  const downloadUrl = await getDownloadUrl();
  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-x-clip">
      <SplashScreen />
      <Navbar />
      <main className="flex-grow min-w-0">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Privacy />
        <ClinicalTimeline />
        <FAQ />
        <CTA downloadUrl={downloadUrl} />
      </main>
      <Footer />
    </div>
  );
}
