"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import {
  MdOutlineAutoAwesome,
  MdOutlineCollectionsBookmark,
  MdOutlineInsertChart,
  MdOutlinePieChart,
  MdOutlineQrCodeScanner,
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
    href: "/user-dashboard/slab-orders",
    label: "My Slab Orders",
    Icon: FiShoppingBag,
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
    href: "/pixelscope",
    label: "Pixelscope",
    Icon: FiSearch,
    isOrange: true,
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/user-dashboard" ? pathname === href : pathname.startsWith(href);

  const itemClass = (active: boolean, isOrange?: boolean) =>
    isOrange
      ? `flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-bold text-orange-400! hover:bg-orange-500/10 hover:text-orange-300! transition-all ${
          active ? "bg-orange-500/20 border border-orange-500/40" : ""
        }`
      : `flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
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
          {navItems.map(({ href, label, Icon, isOrange }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleSidebar}
              aria-current={isActive(href) ? "page" : undefined}
              className={itemClass(isActive(href), isOrange)}
            >
              <Icon className="shrink-0 text-xl" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
