import AppShowcase from "@/components/home/AppShowcase";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import ScanningEngine from "@/components/home/ScanningEngine";
import SupportCta from "@/components/home/SupportCta";

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <ScanningEngine />
      <AppShowcase />
      <Pricing />
      <SupportCta />
    </main>
  );
}
