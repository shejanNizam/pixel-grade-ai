"use client";

import { getPlan } from "@/config/plans";
import {
  useGetAdminPlansQuery,
  useUpdatePlanMutation,
  type TPlan,
} from "@/redux/features/plan/planApi";
import { App } from "antd";
import { useState } from "react";
import BackHeading from "../BackHeading";
import { type Plan } from "./data";
import PlanCard from "./PlanCard";
import PlanFormModal from "./PlanFormModal";

/** Backend plan → the editor's view model. `expiry` is display-only and comes
 *  from the frontend catalogue; the server has no such field. */
const toViewModel = (plan: TPlan): Plan => ({
  id: plan._id,
  name: plan.name,
  price: plan.priceMonthly,
  priceYearly: plan.priceYearly,
  expiry: getPlan(plan.name).expiry,
  credits: plan.creditAmount,
  creditInterval: plan.creditInterval,
  pixelscope: plan.pixelscope,
  facilities: plan.features.map((text) => ({ text, included: true })),
});

export default function SubscriptionPlans() {
  const { message } = App.useApp();

  // The four canonical plans are fixed — admin edits them in place, never
  // creates or deletes — so this is always the full catalogue.
  const { data, isLoading, isError } = useGetAdminPlansQuery();
  const [updatePlan, { isLoading: isSaving }] = useUpdatePlanMutation();
  const [editing, setEditing] = useState<Plan | null>(null);

  const plans = (data ?? []).map(toViewModel);

  const submit = async (values: Omit<Plan, "id">) => {
    if (!editing || isSaving) return;

    try {
      await updatePlan({
        planId: editing.id,
        // `name` and `expiry` stay out of the body: the backend rejects a
        // rename, and expiry is a frontend-catalogue field.
        body: {
          priceMonthly: values.price,
          priceYearly: values.priceYearly,
          creditAmount: values.credits,
          creditInterval: values.creditInterval,
          pixelscope: values.pixelscope,
          features: values.facilities.map((facility) => facility.text),
        },
      }).unwrap();
      message.success(`${values.name} plan updated.`);
      setEditing(null);
    } catch {
      message.error("Couldn't save the plan. Try again.");
    }
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

      {isError && (
        <p className="mx-auto mt-12 max-w-lg rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-center text-sm text-red-400">
          Couldn&apos;t load the plan catalogue. Refresh to try again.
        </p>
      )}

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black"
              />
            ))
          : plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={() => setEditing(plan)}
              />
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
