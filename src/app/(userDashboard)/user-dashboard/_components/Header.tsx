"use client";

import PillButton from "@/components/shared/PillButton";
import { usePathname } from "next/navigation";
import { FiBell, FiMenu } from "react-icons/fi";

/** Page titles keyed by route — the header is shared by every dashboard screen. */
const pageTitles: Record<string, string> = {
  "/user-dashboard": "Dashboard",
  "/user-dashboard/new-analysis": "New analysis",
  "/user-dashboard/analysis-report": "Analysis report",
  "/user-dashboard/my-collection": "My Collection",
  "/user-dashboard/price-tracker": "Price Tracker",
  "/user-dashboard/subscription": "Subscription",
  "/user-dashboard/settings": "Settings",
};

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(
      ([href]) => href !== "/user-dashboard" && pathname.startsWith(href),
    )?.[1] ??
    "Dashboard";

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-6 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="text-zinc-300 hover:text-white lg:hidden"
        >
          <FiMenu size={22} />
        </button>
        <h1 className="text-xl font-medium text-white md:text-2xl">{title}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <PillButton
          href="/user-dashboard/subscription"
          variant="gradient"
          className="hidden sm:inline-flex"
        >
          Upgrade to premium
        </PillButton>

        <button
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          <FiBell size={18} />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-red-500" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white">
            AA
          </span>
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-medium text-white">Alex alfred</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
