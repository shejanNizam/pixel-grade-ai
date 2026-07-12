"use client";

import { App, ConfigProvider, Modal } from "antd";
import { useEffect, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import {
  EXPIRY_OPTIONS,
  FACILITY_ROWS,
  PLAN_NAMES,
  type Facility,
  type Plan,
  type PlanExpiry,
  type PlanName,
} from "./data";

interface PlanFormModalProps {
  open: boolean;
  /** Present when editing; absent when creating. */
  plan?: Plan;
  /** Names already used by other plans — one plan per name. */
  takenNames: PlanName[];
  onCancel: () => void;
  onSubmit: (values: Omit<Plan, "id">) => void;
}

/** Pads the plan's facilities out to a full set of form rows. */
const toRows = (facilities: Facility[] = []): Facility[] =>
  Array.from({ length: FACILITY_ROWS }, (_, i) => ({
    text: facilities[i]?.text ?? "",
    included: facilities[i]?.included ?? false,
  }));

export default function PlanFormModal({
  open,
  plan,
  takenNames,
  onCancel,
  onSubmit,
}: PlanFormModalProps) {
  const { message } = App.useApp();

  const available = PLAN_NAMES.filter((name) => !takenNames.includes(name));
  const firstFree = available[0] ?? PLAN_NAMES[0];

  const [name, setName] = useState<PlanName>(firstFree);
  const [price, setPrice] = useState("");
  const [expiry, setExpiry] = useState<PlanExpiry>("1 Month");
  const [facilities, setFacilities] = useState<Facility[]>(toRows());

  // Reset on each open so an edit never leaks into the next create.
  useEffect(() => {
    if (!open) return;

    setName(plan?.name ?? firstFree);
    setPrice(plan ? String(plan.price) : "");
    setExpiry(plan?.expiry ?? "1 Month");
    setFacilities(toRows(plan?.facilities));
    // `firstFree` is derived from props and stable for a given open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, plan]);

  const updateFacility = (index: number, patch: Partial<Facility>) =>
    setFacilities((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  const submit = () => {
    if (!/^\d+$/.test(price.trim())) {
      message.error("Enter the plan price in whole dollars.");
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
      expiry,
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
          <label className="block">
            <span className="text-lg font-semibold text-white">Plan Name</span>
            <div className="relative mt-3">
              <select
                value={name}
                onChange={(event) => setName(event.target.value as PlanName)}
                className={`${fieldClass} appearance-none pr-10`}
              >
                {PLAN_NAMES.map((option) => (
                  <option
                    key={option}
                    value={option}
                    // Taken by another plan — but keep the one we're editing.
                    disabled={
                      takenNames.includes(option) && option !== plan?.name
                    }
                    className="bg-zinc-800"
                  >
                    {option}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white" />
            </div>
          </label>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-lg font-semibold text-white">
                Plan Price
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
                  placeholder="17"
                  className={`${fieldClass} pl-8`}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-lg font-semibold text-white">
                Plan Expiry
              </span>
              <div className="relative mt-3">
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
            </label>
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
                    placeholder="Add quote"
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
              {plan ? "Save plan" : "Create plan"}
            </button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
