"use client";

import { logout } from "@/redux/features/auth/authSlice";
import { clearAuthCookie } from "@/utils/cookieUtils";
import { App, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  MdOutlineAutoAwesome,
  MdOutlineCollectionsBookmark,
  MdOutlineInsertChart,
  MdOutlineLogout,
  MdOutlinePieChart,
  MdOutlineQrCodeScanner,
  MdOutlineSettings,
  MdOutlineSupportAgent,
  MdOutlineTravelExplore,
  MdOutlineVerifiedUser,
  MdOutlineWorkspacePremium,
} from "react-icons/md";

const SETTINGS_ROOT = "/user-dashboard/settings";

const navItems = [
  { href: "/user-dashboard", label: "Dashboard", Icon: MdOutlinePieChart },
  {
    href: "/user-dashboard/new-analysis",
    label: "New analysis",
    Icon: MdOutlineTravelExplore,
  },
  {
    href: "/user-dashboard/analysis-report",
    label: "Analysis report",
    Icon: MdOutlineQrCodeScanner,
  },
  {
    href: "/user-dashboard/slab-generator",
    label: "Slab Generator",
    Icon: MdOutlineAutoAwesome,
  },
  {
    href: "/user-dashboard/my-collection",
    label: "My Collection",
    Icon: MdOutlineCollectionsBookmark,
  },
  {
    href: "/user-dashboard/price-tracker",
    label: "Price Tracker",
    Icon: MdOutlineInsertChart,
  },
  {
    href: "/user-dashboard/creator-profile",
    label: "Creator profile",
    Icon: MdOutlineVerifiedUser,
  },
  {
    href: "/user-dashboard/subscription",
    label: "Subscription",
    Icon: MdOutlineWorkspacePremium,
  },
  {
    href: "/user-dashboard/support",
    label: "Support",
    Icon: MdOutlineSupportAgent,
  },
];

const settingsItems = [
  { href: `${SETTINGS_ROOT}/profile`, label: "Profile" },
  { href: `${SETTINGS_ROOT}/change-password`, label: "Change Password" },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = App.useApp();

  const inSettings = pathname.startsWith(SETTINGS_ROOT);
  const [settingsOpen, setSettingsOpen] = useState(inSettings);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = () => {
    setIsSigningOut(true);

    // Clear both auth layers: the redux store + the cookie middleware reads,
    // and the localStorage tokens baseApi attaches to requests.
    dispatch(logout());
    clearAuthCookie();
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");

    setConfirmingSignOut(false);
    setIsSigningOut(false);
    message.success("Signed out.");
    router.push("/login");
  };

  // Keep the group open when navigating straight to one of its pages.
  useEffect(() => {
    if (inSettings) setSettingsOpen(true);
  }, [inSettings]);

  const isActive = (href: string) =>
    href === "/user-dashboard" ? pathname === href : pathname.startsWith(href);

  // `text-*!` is required on links: antd's `.ant-app a { color: colorLink }`
  // outranks Tailwind's utilities and would otherwise tint every item violet.
  const itemClass = (active: boolean) =>
    `flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
      active
        ? "bg-violet-500 font-medium text-white! shadow-lg shadow-violet-500/25"
        : "text-zinc-400! hover:bg-white/5 hover:text-white!"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-full w-64 transform p-4 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Neutral fill, not the cards' violet gradient — the active nav pill is
          violet-500 and needs a flat panel to read against. */}
      <div className="flex h-full flex-col overflow-y-auto rounded-3xl border border-violet-500/20 bg-[#111113] p-5">
        <div className="mb-10 flex items-center justify-between px-2 pt-3">
          <Link href="/" aria-label="PixelGrade AI home">
            <Image
              src="/assets/main_logo_all.png"
              alt="PixelGrade AI"
              width={160}
              height={36}
              className="h-6 w-auto"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            aria-label="Close menu"
            className="text-zinc-400 hover:text-white lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleSidebar}
              aria-current={isActive(href) ? "page" : undefined}
              className={itemClass(isActive(href))}
            >
              <Icon className="shrink-0 text-xl" />
              {label}
            </Link>
          ))}

          {/* Settings — a disclosure, not a link: it has no page of its own.
              It stays muted while a child is active so only one row reads as
              the current page. */}
          <button
            type="button"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-expanded={settingsOpen}
            aria-controls="settings-submenu"
            className={`flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-white ${
              inSettings ? "font-medium text-white" : "text-zinc-400"
            }`}
          >
            <MdOutlineSettings className="shrink-0 text-xl" />
            <span className="flex-1 text-left">Settings</span>
            <FiChevronDown
              className={`shrink-0 transition-transform duration-200 ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {settingsOpen && (
            <ul
              id="settings-submenu"
              className="mt-0.5 ml-5 flex flex-col gap-1 border-l border-white/10 pl-3"
            >
              {settingsItems.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={toggleSidebar}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      isActive(href)
                        ? "bg-violet-500 font-medium text-white! shadow-lg shadow-violet-500/25"
                        : "text-zinc-400! hover:bg-white/5 hover:text-white!"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setConfirmingSignOut(true)}
            className="mt-1.5 flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <MdOutlineLogout className="shrink-0 text-xl" />
            Sign out
          </button>
        </nav>
      </div>

      <Modal
        open={confirmingSignOut}
        onCancel={() => setConfirmingSignOut(false)}
        onOk={signOut}
        okText="Sign out"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: isSigningOut }}
        centered
        title="Sign out"
      >
        <p className="text-sm text-zinc-400">
          Are you sure you want to sign out of your account?
        </p>
      </Modal>
    </aside>
  );
}
