"use client";

import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import { App } from "antd";
import { useState } from "react";
import { MdOutlineGridView } from "react-icons/md";
import BackHeading from "../BackHeading";
import { MAX_PLANS, seedPlans, type Plan } from "./data";
import PlanCard from "./PlanCard";
import PlanFormModal from "./PlanFormModal";

export default function SubscriptionPlans() {
  const { message } = App.useApp();

  const [plans, setPlans] = useState<Plan[]>(seedPlans);
  const [formOpen, setFormOpen] = useState(false);
  /** The plan being edited; null means the form is in create mode. */
  const [editing, setEditing] = useState<Plan | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const atCapacity = plans.length >= MAX_PLANS;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setFormOpen(true);
  };

  const submit = (values: Omit<Plan, "id">) => {
    if (editing) {
      setPlans((current) =>
        current.map((plan) =>
          plan.id === editing.id ? { ...values, id: plan.id } : plan,
        ),
      );
      message.success("Plan updated.");
    } else {
      // Guard the cap here too — not just on the button, which a stale render
      // could leave enabled.
      if (atCapacity) {
        message.error(`You can create at most ${MAX_PLANS} plans.`);
        return;
      }

      setPlans((current) => [
        ...current,
        { ...values, id: crypto.randomUUID() },
      ]);
      message.success("Plan created.");
    }

    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    setPlans((current) => current.filter((plan) => plan.id !== deletingId));
    setDeletingId(null);
    message.success("Plan deleted.");
  };

  // A plan's own name stays selectable while editing it.
  const takenNames = plans
    .filter((plan) => plan.id !== editing?.id)
    .map((plan) => plan.name);

  return (
    <div>
      <div className="mb-10 flex items-center justify-between gap-4">
        <BackHeading label="Subscription" className="" />

        <button
          onClick={openCreate}
          disabled={atCapacity}
          title={
            atCapacity ? `Limit of ${MAX_PLANS} plans reached.` : undefined
          }
          className="rounded-full bg-violet-600 px-5 py-2.5 text-sm text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
        >
          Create Plan
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-white md:text-2xl">
          Your Subscription Plan
        </h2>
        <p className="mt-1 text-sm text-zinc-400">Growth Your Bussiness</p>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-32 text-zinc-500">
          <MdOutlineGridView size={22} />
          <p className="text-sm">No Subscription Plan</p>
        </div>
      ) : (
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => openEdit(plan)}
              onDelete={() => setDeletingId(plan.id)}
            />
          ))}
        </div>
      )}

      <PlanFormModal
        open={formOpen}
        plan={editing ?? undefined}
        takenNames={takenNames}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={submit}
      />

      <DeleteConfirmationModal
        open={deletingId !== null}
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete plan"
        description="This subscription plan will be removed. This action cannot be undone."
      />
    </div>
  );
}
