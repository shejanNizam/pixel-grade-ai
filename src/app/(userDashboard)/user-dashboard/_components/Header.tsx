"use client";

import HeaderProfile from "@/components/shared/HeaderProfile";
import NotificationBell from "@/components/shared/NotificationBell";
import PillButton from "@/components/shared/PillButton";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";
import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiShoppingCart } from "react-icons/fi";

const pageTitles: Record<string, string> = {
  "/user-dashboard": "Dashboard",
  "/user-dashboard/creator-profile": "Creator Profile",
  "/user-dashboard/new-analysis": "New analysis",
  "/user-dashboard/analysis-report": "Analysis report",
  "/user-dashboard/slab-generator": "Slab Generator",
  "/user-dashboard/cart": "Shopping Cart",
  "/user-dashboard/checkout": "Checkout",
  "/user-dashboard/my-collection": "My Collection",
  "/user-dashboard/price-tracker": "Price Tracker",
  "/user-dashboard/subscription": "Subscription",
  "/user-dashboard/support": "Support",
  "/user-dashboard/settings": "Settings",
};

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { data: mySub } = useGetMySubscriptionQuery();
  const { data: cartData } = useGetCartQuery();

  const cartItemCount = cartData?.data?.items?.length ?? 0;

  const isPaidUser = Boolean(
    mySub?.subscription ||
      (mySub?.plan?.name && mySub.plan.name !== "Free"),
  );
  const showUpgradeButton = !isPaidUser;

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(
      ([href]) => href !== "/user-dashboard" && pathname.startsWith(href),
    )?.[1] ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 bg-black px-4 py-4 sm:gap-4 md:px-6 md:py-6">
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
        {showUpgradeButton && (
          <PillButton
            href="/user-dashboard/subscription"
            variant="gradient"
            className="px-3! py-2! text-xs! sm:px-5! sm:py-2.5! sm:text-sm!"
          >
            <span className="md:hidden">Upgrade</span>
            <span className="hidden md:inline">Upgrade to premium</span>
          </PillButton>
        )}

        <Link
          href="/user-dashboard/cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-white"
          title="Shopping Cart"
          aria-label="Shopping Cart"
        >
          <FiShoppingCart size={18} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          )}
        </Link>

        <NotificationBell
          audience="user"
          seeAllHref="/user-dashboard/settings/notification"
        />

        <HeaderProfile
          href="/user-dashboard/settings/profile"
          subtitle="My Profile"
          links={[
            {
              href: "/user-dashboard/creator-profile",
              label: "Creator Profile",
            },
            { href: "/user-dashboard/settings/profile", label: "My Profile" },
          ]}
        />
      </div>
    </header>
  );
}
