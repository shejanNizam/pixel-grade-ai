"use client";

import HardwareCard from "@/components/pricing/HardwareCard";
import PricingPlans, { type Plan } from "@/components/pricing/PricingPlans";
import type { Billing } from "@/config/plans";
import { useGetPlansQuery } from "@/redux/features/plan/planApi";
import {
  useCancelSubscriptionMutation,
  useCreateCheckoutSessionMutation,
  useGetMySubscriptionQuery,
} from "@/redux/features/subscription/subscriptionApi";
import { useGetMyTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { App } from "antd";

const money = (v: number, currency = "USD") =>
  v.toLocaleString("en-US", { style: "currency", currency });

const dateOf = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function Subscription() {
  const { message, modal } = App.useApp();

  const { data: mySub } = useGetMySubscriptionQuery();
  const { data: plans } = useGetPlansQuery();
  const { data: invoices } = useGetMyTransactionsQuery({
    limit: 5,
    sort: "-createdAt",
  });
  const [checkout, { isLoading: isCheckingOut }] =
    useCreateCheckoutSessionMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const currentPlanName = mySub?.plan.name ?? null;
  const subscription = mySub?.subscription ?? null;

  const selectPlan = async (plan: Plan, billing: Billing) => {
    if (isCheckingOut) return;

    if (plan.name === currentPlanName) {
      message.info(`You're already on the ${plan.name} plan.`);
      return;
    }
    if (plan.price === 0) {
      message.info(
        "Downgrading to Free happens by cancelling your subscription below.",
      );
      return;
    }

    // Checkout needs the backend plan document's id, not the catalogue entry.
    const backendPlan = plans?.find((p) => p.name === plan.name);
    if (!backendPlan) {
      message.error("Couldn't load the plan catalogue. Refresh and try again.");
      return;
    }

    try {
      const { url } = await checkout({
        planId: backendPlan._id,
        interval: billing,
      }).unwrap();
      // Stripe-hosted checkout: the browser leaves the app and comes back to
      // the success/cancel URLs the backend configured.
      window.location.href = url;
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      message.error(data?.message ?? "Couldn't start checkout. Try again.");
    }
  };

  const confirmCancel = () => {
    modal.confirm({
      title: "Cancel your subscription?",
      content:
        "Your plan stays active until the end of the current billing period, then drops to Free.",
      okText: "Cancel subscription",
      okButtonProps: { danger: true, loading: isCancelling },
      cancelText: "Keep my plan",
      onOk: async () => {
        try {
          await cancel().unwrap();
          message.success("Subscription cancelled — active until period end.");
        } catch (err) {
          const data = (err as { data?: { message?: string } })?.data;
          message.error(data?.message ?? "Couldn't cancel. Try again.");
        }
      },
    });
  };

  return (
    <div className="py-6">
      {mySub && (
        <div className="mx-auto mb-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-5">
          <div>
            <p className="text-xs text-zinc-400">Current plan</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {mySub.plan.name}
              {subscription && (
                <span className="ml-2 text-xs font-normal text-zinc-400 capitalize">
                  {subscription.interval} ·{" "}
                  {subscription.cancelAtPeriodEnd
                    ? `ends ${dateOf(subscription.currentPeriodEnd)}`
                    : `renews ${dateOf(subscription.currentPeriodEnd)}`}
                </span>
              )}
            </p>
          </div>

          {subscription &&
            subscription.status === "active" &&
            !subscription.cancelAtPeriodEnd && (
              <button
                type="button"
                onClick={confirmCancel}
                className="rounded-full border border-red-500/50 px-5 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                Cancel subscription
              </button>
            )}
        </div>
      )}

      <PricingPlans onSelect={selectPlan} />
      <HardwareCard />

      {(invoices?.data.length ?? 0) > 0 && (
        <section className="mx-auto mt-14 max-w-6xl">
          <h3 className="mb-4 text-lg font-medium text-white">
            Billing history
          </h3>
          <ul className="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8">
            {invoices?.data.map((txn) => (
              <li
                key={txn._id}
                className="flex flex-wrap items-center justify-between gap-3 bg-[#111113] px-5 py-3.5 text-sm"
              >
                <div>
                  <p className="text-white">
                    {txn.type === "subscription"
                      ? typeof txn.plan === "object"
                        ? `${txn.plan.name} plan`
                        : "Subscription"
                      : "Slab order"}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {dateOf(txn.createdAt)}
                    {txn.invoiceNumber && ` · ${txn.invoiceNumber}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white tabular-nums">
                    {money(txn.amount, (txn.currency || "usd").toUpperCase())}
                  </p>
                  <p
                    className={`mt-0.5 text-xs capitalize ${
                      txn.status === "succeeded"
                        ? "text-emerald-400"
                        : txn.status === "failed"
                          ? "text-red-400"
                          : "text-zinc-400"
                    }`}
                  >
                    {txn.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
