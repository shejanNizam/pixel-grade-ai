"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import {
  MdOutlineAssessment,
  MdOutlineCollectionsBookmark,
  MdOutlineInsertChart,
  MdOutlineLogout,
  MdOutlinePieChart,
  MdOutlineQrCodeScanner,
  MdOutlineSettings,
  MdOutlineTravelExplore,
} from "react-icons/md";

const navItems = [
  { href: "/user-dashboard", label: "Dashboard", Icon: MdOutlinePieChart },
  {
    href: "/user-dashboard/new-analysis",
    label: "New analysis",
    Icon: MdOutlineTravelExplore,
  },
  {
    href: "/user-dashboard/my-scans",
    label: "My Scans",
    Icon: MdOutlineQrCodeScanner,
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
    href: "/user-dashboard/report",
    label: "Report",
    Icon: MdOutlineAssessment,
  },
  {
    href: "/user-dashboard/settings",
    label: "Settings",
    Icon: MdOutlineSettings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/user-dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-full w-64 transform p-4 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col rounded-3xl bg-[#111113] p-5">
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
              className={`flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive(href)
                  ? "bg-white/5 font-medium text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="shrink-0 text-xl" />
              {label}
            </Link>
          ))}

          <button
            onClick={() => router.push("/login")}
            className="mt-1.5 flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <MdOutlineLogout className="shrink-0 text-xl" />
            Sign out
          </button>
        </nav>
      </div>
    </aside>
  );
}
