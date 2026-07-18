"use client";

import { App } from "antd";
import { useState } from "react";
import BackHeading from "../BackHeading";
import { seedPlans, type Plan } from "./data";
import PlanCard from "./PlanCard";
import PlanFormModal from "./PlanFormModal";

export default function SubscriptionPlans() {
  const { message } = App.useApp();

  // The four canonical plans are fixed — admin edits them in place, never
  // creates or deletes — so this is always the full catalogue.
  const [plans, setPlans] = useState<Plan[]>(seedPlans);
  const [editing, setEditing] = useState<Plan | null>(null);

  const submit = (values: Omit<Plan, "id">) => {
    if (!editing) return;
    setPlans((current) =>
      current.map((plan) =>
        plan.id === editing.id ? { ...values, id: plan.id } : plan,
      ),
    );
    message.success(`${values.name} plan updated.`);
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-10">
        <BackHeading label="Subscription" className="" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-white md:text-2xl">
          Your Subscription Plans
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Edit pricing, credits, and features for each plan.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onEdit={() => setEditing(plan)} />
        ))}
      </div>

      <PlanFormModal
        open={editing !== null}
        plan={editing ?? undefined}
        onCancel={() => setEditing(null)}
        onSubmit={submit}
      />
    </div>
  );
}
