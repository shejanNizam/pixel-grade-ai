"use client";

import { logout } from "@/redux/features/auth/authSlice";
import { clearAuthCookie } from "@/utils/cookieUtils";
import { App } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import {
  MdBarChart,
  MdClose,
  MdDashboard,
  MdDescription,
  MdPeople,
  MdSettings,
  MdShoppingCart,
} from "react-icons/md";
import { useDispatch } from "react-redux";

const navigation = [
  {
    section: "Core",
    items: [
      { name: "Overview", icon: MdDashboard, href: "/admin" },
      { name: "Analytics", icon: MdBarChart, href: "/admin/analytics" },
      { name: "Users", icon: MdPeople, href: "/admin/users" },
      { name: "Orders", icon: MdShoppingCart, href: "/admin/orders" },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Reports", icon: MdDescription, href: "/admin/reports" },
      { name: "Settings", icon: MdSettings, href: "/admin/settings" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { modal, message } = App.useApp();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen) {
      toggleSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Exact match for the index route, prefix match for the rest.
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    modal.confirm({
      title: "Are you sure?",
      content: "Do you want to logout?",
      okText: "Yes, logout!",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
        clearAuthCookie();
        dispatch(logout());
        router.push("/login");
        message.success("You have successfully logged out.");
      },
    });
  };

  return (
    <>
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-30
          w-64 bg-[#1a1d29] dark:bg-gray-950 text-gray-300
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo & Close Button - Fixed at top */}
        <div className="p-6 border-b border-gray-700 dark:border-gray-800 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex flex-col flex-1">
            <h1 className="text-xl font-bold text-white">
              Pixel<span className="text-blue-500">Grade</span> AI
            </h1>
            <span className="mt-1 inline-flex w-fit items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
              Admin Panel
            </span>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar min-h-0">
          {navigation?.map((section) => (
            <div key={section.section} className="mb-6">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-600 uppercase tracking-wider">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section?.items?.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          active
                            ? "bg-gray-700 dark:bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800/50 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout - Fixed at bottom */}
        <div className="p-4 border-t border-gray-700 dark:border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center gap-2 text-red-500 cursor-pointer bg-primary/20 px-3 py-3 rounded-lg transition-colors dark:bg-gray-800"
          >
            <IoIosLogOut size={24} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
