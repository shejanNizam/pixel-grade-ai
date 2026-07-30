"use client";

import { App, ConfigProvider, Modal } from "antd";
import { useEffect, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import {
  CREDIT_INTERVALS,
  EXPIRY_OPTIONS,
  FACILITY_ROWS,
  type CreditInterval,
  type Facility,
  type Plan,
  type PlanExpiry,
  type PlanName,
} from "./data";

interface PlanFormModalProps {
  open: boolean;
  /** The plan being edited. The four plans are fixed, so this is edit-only —
   *  there is no create mode. */
  plan?: Plan;
  onCancel: () => void;
  onSubmit: (values: Omit<Plan, "id">) => void;
}

/** Pads the plan's facilities out to a full set of form rows, never fewer than
 *  the plan already has so no bullet is dropped. */
const toRows = (facilities: Facility[] = []): Facility[] => {
  const count = Math.max(FACILITY_ROWS, facilities.length);
  return Array.from({ length: count }, (_, i) => ({
    text: facilities[i]?.text ?? "",
    included: facilities[i]?.included ?? false,
  }));
};

export default function PlanFormModal({
  open,
  plan,
  onCancel,
  onSubmit,
}: PlanFormModalProps) {
  const { message } = App.useApp();

  // Name is the plan's identity — the frontend gates features on it — so it is
  // shown but not editable. Everything else is admin-editable.
  const [name, setName] = useState<PlanName>("Free");
  const [price, setPrice] = useState("");
  const [priceYearly, setPriceYearly] = useState("");
  const [expiry, setExpiry] = useState<PlanExpiry>("1 Month");
  const [credits, setCredits] = useState("");
  const [creditInterval, setCreditInterval] =
    useState<CreditInterval>("monthly");
  const [unlimited, setUnlimited] = useState(false);
  const [pixelscope, setPixelscope] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>(toRows());

  // Reload from the plan on each open so one edit never leaks into the next.
  useEffect(() => {
    if (!open || !plan) return;

    setName(plan.name);
    setPrice(String(plan.price));
    setPriceYearly(String(plan.priceYearly));
    setExpiry(plan.expiry);
    setUnlimited(plan.credits === null);
    setCredits(plan.credits != null ? String(plan.credits) : "");
    setCreditInterval(plan.creditInterval);
    setPixelscope(plan.pixelscope);
    setFacilities(toRows(plan.facilities));
  }, [open, plan]);

  const updateFacility = (index: number, patch: Partial<Facility>) =>
    setFacilities((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  const submit = () => {
    if (!/^\d+$/.test(price.trim())) {
      message.error("Enter the monthly price in whole dollars.");
      return;
    }

    if (!/^\d+$/.test(priceYearly.trim())) {
      message.error("Enter the yearly price (effective per month).");
      return;
    }

    if (Number(priceYearly) > Number(price)) {
      message.error("Yearly price should not exceed the monthly price.");
      return;
    }

    if (!unlimited && !/^\d+$/.test(credits.trim())) {
      message.error("Enter the credit allowance, or mark the plan unlimited.");
      return;
    }

    const kept = facilities.filter(
      (facility) => facility.included && facility.text.trim(),
    );

    if (kept.length === 0) {
      message.error("Add and check at least one facility.");
      return;
    }

    onSubmit({
      name,
      price: Number(price),
      priceYearly: Number(priceYearly),
      expiry,
      credits: unlimited ? null : Number(credits),
      creditInterval,
      pixelscope,
      facilities: kept.map((facility) => ({
        text: facility.text.trim(),
        included: true,
      })),
    });
  };

  const fieldClass =
    "w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-violet-400";

  return (
    // The plan form sits on a lighter grey than the app's other dialogs, so the
    // panel colour is overridden here rather than in the global theme.
    <ConfigProvider theme={{ components: { Modal: { contentBg: "#3f3f46" } } }}>
      <Modal open={open} onCancel={onCancel} footer={null} centered width={620}>
        <div className="py-2">
          <div className="block">
            <span className="text-lg font-semibold text-white">Plan Name</span>
            <div
              className={`${fieldClass} mt-3 flex items-center justify-between text-zinc-300`}
              aria-readonly
            >
              {name}
              <span className="text-[11px] text-zinc-500">Fixed tier</span>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-lg font-semibold text-white">
                Monthly Price
              </span>
              <div className="relative mt-3">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-white">
                  $
                </span>
                <input
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value.replace(/\D/g, ""))
                  }
                  inputMode="numeric"
                  placeholder="10"
                  aria-label="Monthly price in dollars"
                  className={`${fieldClass} pl-8`}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-lg font-semibold text-white">
                Yearly Price
              </span>
              <div className="relative mt-3">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-white">
                  $
                </span>
                <input
                  value={priceYearly}
                  onChange={(event) =>
                    setPriceYearly(event.target.value.replace(/\D/g, ""))
                  }
                  inputMode="numeric"
                  placeholder="8"
                  aria-label="Yearly price, effective per month"
                  className={`${fieldClass} pl-8`}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-zinc-400">
                Effective / month · charged{" "}
                <span className="text-zinc-300">
                  ${(Number(priceYearly) || 0) * 12}
                </span>{" "}
                up front per year
              </p>
            </label>
          </div>

          <div className="mt-6">
            <span className="text-lg font-semibold text-white">
              Plan Expiry
            </span>
            <div className="relative mt-3 sm:max-w-64">
              <select
                value={expiry}
                onChange={(event) =>
                  setExpiry(event.target.value as PlanExpiry)
                }
                className={`${fieldClass} appearance-none pr-10`}
              >
                {EXPIRY_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-zinc-800">
                    {option}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white" />
            </div>
          </div>

          {/* Credits are what the plan actually meters (10 credits = 1 scan),
              so they belong on the plan itself rather than being implied by the
              facility copy. Free refills daily; paid plans refill monthly. */}
          <div className="mt-6">
            <span className="text-lg font-semibold text-white">
              Credits Included
            </span>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={unlimited ? "" : credits}
                onChange={(event) =>
                  setCredits(event.target.value.replace(/\D/g, ""))
                }
                disabled={unlimited}
                inputMode="numeric"
                placeholder="1500"
                aria-label="Credits included per interval"
                className={`${fieldClass} sm:max-w-40 disabled:cursor-not-allowed disabled:text-zinc-500 disabled:placeholder:text-zinc-600`}
              />

              <div className="relative">
                <select
                  value={creditInterval}
                  onChange={(event) =>
                    setCreditInterval(event.target.value as CreditInterval)
                  }
                  disabled={unlimited}
                  aria-label="Credit refill interval"
                  className={`${fieldClass} appearance-none pr-10 capitalize disabled:cursor-not-allowed disabled:text-zinc-500`}
                >
                  {CREDIT_INTERVALS.map((option) => (
                    <option key={option} value={option} className="bg-zinc-800">
                      per {option === "daily" ? "day" : "month"}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white" />
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={unlimited}
                onClick={() => setUnlimited((on) => !on)}
                className="inline-flex items-center gap-2.5 text-sm text-white"
              >
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
                    unlimited
                      ? "bg-emerald-500 text-white"
                      : "border border-white/30 text-transparent hover:border-white/60"
                  }`}
                >
                  <FiCheck size={12} />
                </span>
                Unlimited
              </button>
            </div>
          </div>

          {/* PixelScope (Advanced scan) + Pixel Verified are paid-only; this
              flag is what the scan screen gates the feature on. */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-white/15 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">
                PixelScope &amp; Pixel Verified
              </p>
              <p className="text-[11px] text-zinc-400">
                Allow Advanced multi-image scans and the Pixel Verified badge.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pixelscope}
              aria-label="Enable PixelScope for this plan"
              onClick={() => setPixelscope((on) => !on)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                pixelscope ? "bg-violet-500" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                  pixelscope ? "left-[calc(100%-1.375rem)]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">Facilities</h3>

            <ul className="mt-3 flex flex-col gap-2">
              {facilities.map((facility, i) => (
                <li key={i} className="flex items-center gap-3">
                  <input
                    value={facility.text}
                    onChange={(event) =>
                      updateFacility(i, { text: event.target.value })
                    }
                    placeholder="Add feature"
                    aria-label={`Facility ${i + 1}`}
                    className="min-w-0 flex-1 border-b border-transparent bg-transparent py-1 text-xs text-white outline-none placeholder:text-zinc-400 focus:border-white/30"
                  />

                  <button
                    type="button"
                    role="switch"
                    aria-checked={facility.included}
                    aria-label={`Include facility ${i + 1}`}
                    onClick={() =>
                      updateFacility(i, { included: !facility.included })
                    }
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
                      facility.included
                        ? "bg-emerald-500 text-white"
                        : "border border-white/30 text-transparent hover:border-white/60"
                    }`}
                  >
                    <FiCheck size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={submit}
              className="w-full max-w-xs rounded-full bg-violet-600 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-700"
            >
              Save plan
            </button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
