import PricingPlans from "@/components/pricing/PricingPlans";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-black px-4 py-20">
      <PricingPlans ctaHref="/signup" />
    </section>
  );
}
