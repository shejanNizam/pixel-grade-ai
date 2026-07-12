import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import type { Plan } from "./data";

interface PlanCardProps {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const included = plan.facilities.filter(
    (facility) => facility.included && facility.text.trim(),
  );

  return (
    <article className="flex flex-col rounded-3xl border border-violet-500/40 bg-linear-to-b from-violet-950/30 to-black p-6">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">
        <HiOutlineSparkles size={18} />
      </span>

      <h3 className="mt-5 text-sm text-white">{plan.name}</h3>

      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-white tabular-nums">
          $ {plan.price}
        </span>
        <span className="text-xs text-zinc-500">/per month</span>
      </p>

      {/* flex-1 pins the buttons to the bottom so cards of unequal length still
          line their actions up across the row. */}
      <ul className="mt-8 flex flex-1 flex-col gap-3.5">
        {included.map((facility, i) => (
          <li key={i} className="flex items-center gap-2.5 text-xs text-white">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
              <FiCheck size={10} />
            </span>
            {facility.text}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 py-2.5 pr-2 pl-5 text-sm text-white transition-colors hover:bg-violet-700"
        >
          Edit
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-violet-600">
            <FiArrowUpRight size={13} />
          </span>
        </button>

        <button
          onClick={onDelete}
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:border-red-400 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
