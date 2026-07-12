"use client";

import { logout } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import { App, Avatar, Drawer, Dropdown, type MenuProps } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import CustomPrimaryButton from "./CustomPrimaryButton";
import ThemeToggle from "./ThemeToggle";

// Add your public marketing pages here
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
];

/** Gradient brand mark — matches the auth pages for a consistent identity. */
function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-lg font-bold text-white shadow-md shadow-primary/30 transition-transform group-hover:scale-105">
        P
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Pixel<span className="text-primary">Grade</span> AI
        </span>
        <span className="mt-0.5 text-[10px] tracking-wide text-slate-400 dark:text-slate-500">
          Your tagline here
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = App.useApp();

  const { user } = useSelector((state: RootState) => state.auth);

  // Frost + shadow the bar once the user scrolls past the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide the active-link underline to the current route (and keep it aligned
  // on resize). Hidden when the route isn't one of the nav links.
  useEffect(() => {
    const active = navLinks.find((l) => l.href === pathname);
    const node = active ? linkRefs.current[active.href] : null;
    if (!node) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const update = () =>
      setIndicator({
        left: node.offsetLeft,
        width: node.offsetWidth,
        opacity: 1,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [pathname]);

  const closeDrawer = () => setIsOpen(false);
  const isActive = (href: string) => pathname === href;

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  const handleLogout = () => {
    dispatch(logout());
    closeDrawer();
    message.success("Signed out.");
    router.push("/");
  };

  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="px-1 py-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "dashboard",
      icon: <FiGrid />,
      label: <Link href="/user-dashboard">Dashboard</Link>,
    },
    {
      key: "settings",
      icon: <FiUser />,
      label: <Link href="/user-dashboard">Profile settings</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <FiLogOut />,
      label: "Sign out",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1220]/80"
          : "border-b border-transparent bg-white/60 backdrop-blur-md dark:bg-[#0b1220]/40"
      }`}
    >
      <div
        className={`container mx-auto flex items-center justify-between px-4 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Left — Brand */}
        <Brand />

        {/* Center — nav with sliding underline (desktop) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                linkRefs.current[link.href] = el;
              }}
              className={`px-1 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-slate-900 hover:text-primary dark:text-slate-100 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Single sliding underline — a curved, rounded border-bottom that
              glides between routes */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-1.5 h-2 rounded-[50%] border-b-3 border-primary transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />
        </div>

        {/* Right — actions (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {user ? (
            <Dropdown
              menu={{ items: userMenu }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <button className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 py-1 pl-1 pr-2.5 transition-colors hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
                <Avatar
                  size={34}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    fontWeight: 600,
                  }}
                >
                  {initials || <FiUser />}
                </Avatar>
                <span className="max-w-24 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user.first_name}
                </span>
                <FiChevronDown className="text-slate-400" />
              </button>
            </Dropdown>
          ) : (
            <CustomPrimaryButton href="/signup" size="sm">
              Get Started
            </CustomPrimaryButton>
          )}
        </div>

        {/* Right — actions (mobile) */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        open={isOpen}
        onClose={closeDrawer}
        closable={false}
        width={320}
        styles={{
          body: { padding: 0 },
          content: { boxShadow: "none" },
        }}
        className="[&_.ant-drawer-content]:bg-white dark:[&_.ant-drawer-content]:bg-[#0b1220]"
      >
        <div className="flex h-full flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
            <Brand onClick={closeDrawer} />
            <button
              onClick={closeDrawer}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className={`rounded-full border-l-6 px-4 py-3 text-[15px] font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                    : "border-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Footer — auth actions */}
          <div className="border-t border-slate-200/70 p-4 dark:border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                  <Avatar
                    size={44}
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                      fontWeight: 600,
                    }}
                  >
                    {initials || <FiUser />}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/user-dashboard"
                  onClick={closeDrawer}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25"
                >
                  <FiGrid /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-500/10"
                >
                  <FiLogOut /> Sign out
                </button>
              </div>
            ) : (
              <CustomPrimaryButton href="/signup" onClick={closeDrawer} block>
                Get Started
              </CustomPrimaryButton>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
}
