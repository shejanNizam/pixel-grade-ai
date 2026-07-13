"use client";

import HardwareCard from "@/components/pricing/HardwareCard";
import PricingPlans from "@/components/pricing/PricingPlans";
import { App } from "antd";

export default function Subscription() {
  const { message } = App.useApp();

  return (
    <div className="py-6">
      <PricingPlans
        onSelect={(plan) =>
          message.success(`Switched to the ${plan.name} plan (demo).`)
        }
      />
      <HardwareCard />
    </div>
  );
}
