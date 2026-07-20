"use client";

import HeaderProfile from "@/components/shared/HeaderProfile";
import NotificationBell from "@/components/shared/NotificationBell";
import PillButton from "@/components/shared/PillButton";
import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";

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
  const { data: mySub } = useGetMySubscriptionQuery();

  // Only Free plans see the upgrade CTA — a paying user has nothing to upgrade
  // to from here (they manage their plan on the subscription page).
  const onFreePlan = mySub?.plan.name === "Free";

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
        {/* Only shown on Free — a paid user has no upgrade to make here. Label
            shortens rather than disappearing so it stays reachable on a phone. */}
        {onFreePlan && (
          <PillButton
            href="/user-dashboard/subscription"
            variant="gradient"
            className="px-3! py-2! text-xs! sm:px-5! sm:py-2.5! sm:text-sm!"
          >
            <span className="md:hidden">Upgrade</span>
            <span className="hidden md:inline">Upgrade to premium</span>
          </PillButton>
        )}

        <NotificationBell seeAllHref="/user-dashboard/settings/notification" />

        <HeaderProfile
          href="/user-dashboard/settings/profile"
          subtitle="My Profile"
        />
      </div>
    </header>
  );
}
