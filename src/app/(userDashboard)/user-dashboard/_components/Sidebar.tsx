"use client";

import { logout } from "@/redux/features/auth/authSlice";
import { clearAuthCookie } from "@/utils/cookieUtils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import {
  MdClose,
  MdCreditCard,
  MdDashboard,
  MdFolder,
  MdSettings,
  MdSupportAgent,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { App } from "antd";

const navigation = [
  {
    section: "Core",
    items: [
      { name: "Overview", icon: MdDashboard, href: "/user-dashboard" },
      { name: "Projects", icon: MdFolder, href: "/user-dashboard/projects" },
      { name: "Billing", icon: MdCreditCard, href: "/user-dashboard/billing" },
    ],
  },
  {
    section: "System",
    items: [
      {
        name: "Support",
        icon: MdSupportAgent,
        href: "/user-dashboard/support",
      },
      {
        name: "Settings",
        icon: MdSettings,
        href: "/user-dashboard/settings",
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
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

  // Exact match for the index route, prefix match for the rest, so nested
  // pages (e.g. /user-dashboard/settings/profile) still highlight "Settings".
  const isActive = (href: string) =>
    href === "/user-dashboard" ? pathname === href : pathname.startsWith(href);

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
      {/* Sidebar - Fixed position for both mobile and desktop */}
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
          <Link href="/" className="flex flex-col flex-1">
            <h1 className="text-xl font-bold text-white">
              Pixel<span className="text-blue-500">Grade</span> AI
            </h1>
            <p className="text-xs text-gray-400 mt-1">Your tagline here</p>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation - Scrollable only when content overflows */}
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

        {/* User Profile - Fixed at bottom */}
        <div className="p-4 border-t border-gray-700 dark:border-gray-800 shrink-0">
          {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center text-white font-semibold shrink-0">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-400 truncate">Pro Plan</p>
            </div>
          </div> */}
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
