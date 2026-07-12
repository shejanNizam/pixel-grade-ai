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
        <Link
          key={label}
          href={href}
          className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#111113] p-4 transition-colors hover:border-violet-500/50"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
            <Icon />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-white">{label}</span>
            <span className="block truncate text-xs text-zinc-500">
              {caption}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
