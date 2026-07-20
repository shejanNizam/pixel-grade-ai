"use client";

import HeaderProfile from "@/components/shared/HeaderProfile";
import NotificationBell from "@/components/shared/NotificationBell";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";

/** Page titles keyed by route — the header is shared by every admin screen. */
const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/subscribed-users": "Subscribed Users",
  "/admin/earnings": "Earnings",
  "/admin/subscription-plan": "Subscription Plan",
  "/admin/settings": "Settings",
};

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function AdminHeader({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(
      ([href]) => href !== "/admin" && pathname.startsWith(href),
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
        <NotificationBell />

        <HeaderProfile href="/admin/settings/profile" />
      </div>
    </header>
  );
}
