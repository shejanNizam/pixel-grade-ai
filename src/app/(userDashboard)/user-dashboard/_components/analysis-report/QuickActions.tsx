import Link from "next/link";
import type { IconType } from "react-icons";
import { FiCamera, FiGrid, FiPackage, FiUser } from "react-icons/fi";

interface Action {
  label: string;
  caption: string;
  href: string;
  Icon: IconType;
}

const actions: Action[] = [
  {
    label: "Scan card",
    caption: "Start AI Inspection",
    href: "/user-dashboard/new-analysis",
    Icon: FiCamera,
  },
  {
    label: "Buy custom slab",
    caption: "Order your own slab",
    href: "/user-dashboard/subscription",
    Icon: FiPackage,
  },
  {
    label: "My collection",
    caption: "Browse your cards",
    href: "/user-dashboard/my-collection",
    Icon: FiGrid,
  },
  {
    label: "Creators profile",
    caption: "View your profile",
    href: "/user-dashboard/settings/profile",
    Icon: FiUser,
  },
];

export default function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map(({ label, caption, href, Icon }) => (
        /* Same shell as <StatCard>, but these are links rather than figures. */
        <Link
          key={label}
          href={href}
          className="flex items-center gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4 transition-colors hover:border-violet-500/70"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
            <Icon />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-white">{label}</span>
            <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
              {caption}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
