import AppShowcase from "@/components/home/AppShowcase";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import ScanningEngine from "@/components/home/ScanningEngine";
import SlabShowcase from "@/components/home/SlabShowcase";
import SupportCta from "@/components/home/SupportCta";
import WorkingProcess from "@/components/home/WorkingProcess";

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <ScanningEngine />
      <SlabShowcase />
      <WorkingProcess />
      <Pricing />
      <AppShowcase />
      <SupportCta />
    </main>
  );
}
