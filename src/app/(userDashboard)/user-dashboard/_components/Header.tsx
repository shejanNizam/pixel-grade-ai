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
    // Sticky so the title and actions stay reachable while the page scrolls.
    // z-10 keeps it above the content but below the mobile overlay (z-20) and
    // the sidebar (z-30), so an open menu still covers it.
    <header className="sticky top-0 z-10 flex items-center gap-3 bg-black px-4 py-4 sm:gap-4 md:px-6 md:py-6">
      {/* min-w-0 lets the title truncate instead of pushing the actions off-screen. */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="shrink-0 text-zinc-300 hover:text-white lg:hidden"
        >
          <FiMenu size={22} />
        </button>
        <h1 className="truncate text-lg font-medium text-white sm:text-xl md:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-5">
        {/* Label shortens rather than disappearing — upgrading is the point of
            the header, so it stays reachable on a phone. */}
        <PillButton
          href="/user-dashboard/subscription"
          variant="gradient"
          className="px-3! py-2! text-xs! sm:px-5! sm:py-2.5! sm:text-sm!"
        >
          <span className="md:hidden">Upgrade</span>
          <span className="hidden md:inline">Upgrade to premium</span>
        </PillButton>

        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 transition-colors hover:bg-zinc-200 md:h-10 md:w-10"
        >
          <FiBell size={17} />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-red-500" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white md:h-10 md:w-10">
            AA
          </span>
          <div className="hidden leading-tight lg:block">
            <p className="text-sm font-medium text-white">Alex alfred</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
