"use client";

import PillButton from "@/components/shared/PillButton";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiGrid, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#working-process", label: "Working process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact us" },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="PixelGrade AI home">
      <Image
        src="/assets/main_logo_all.png"
        alt="PixelGrade AI"
        width={180}
        height={40}
        priority
        className="h-7 w-auto"
      />
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // Signed-in visitors get a route into the app instead of a sign-in prompt.
  // Auth comes from getMe (the Redux auth slice is empty after a fresh load).
  const { data: me } = useGetMeQuery();
  const isStaff = me?.role === "admin" || me?.role === "super_admin";
  const cta = me
    ? { href: isStaff ? "/admin" : "/user-dashboard", label: "Dashboard", icon: <FiGrid /> }
    : { href: "/login", label: "Sign in", icon: <FiArrowRight /> };

  // The bar is transparent over the hero, but needs a solid backing once content
  // scrolls beneath it — otherwise the links sit on top of the page copy.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll(); // A reload mid-page starts already scrolled.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The open mobile menu needs the backing too, even at the top of the page.
  const solid = scrolled || isOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-white/10 bg-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Brand />

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white! transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <PillButton
          href={cta.href}
          icon={cta.icon}
          className="hidden md:inline-flex"
        >
          {cta.label}
        </PillButton>

        <button
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {isOpen && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-black/95 p-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-white! transition-colors hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <PillButton
              href={cta.href}
              onClick={closeMenu}
              icon={cta.icon}
              block
              className="mt-3"
            >
              {cta.label}
            </PillButton>
          </div>
        </div>
      )}
    </header>
  );
}
