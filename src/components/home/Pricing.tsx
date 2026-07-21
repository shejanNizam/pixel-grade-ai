"use client";

import PricingPlans from "@/components/pricing/PricingPlans";
import { useGetMeQuery } from "@/redux/features/user/userApi";

export default function Pricing() {
  // Determine auth the same way the dashboard does — the Redux auth slice is
  // empty after a fresh load, so getMe is the source of truth.
  const { data: me } = useGetMeQuery();

  // Signed-in visitors go to their in-app billing page to review their current
  // plan, pick a billing period, and check out from there. Anonymous visitors
  // sign up first. We deliberately don't launch Stripe straight from here: the
  // Free plan has no checkout, and users should confirm what they're changing
  // before paying — jumping a marketing click straight to payment is jarring.
  const ctaHref = me ? "/user-dashboard/subscription" : "/signup";

  return (
    <section id="pricing" className="bg-black px-4 py-20">
      <PricingPlans ctaHref={ctaHref} />
    </section>
  );
}
