"use client";

import PillButton from "@/components/shared/PillButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";

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
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
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
          href="/login"
          icon={<FiArrowRight />}
          className="hidden md:inline-flex"
        >
          Sign in
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
              href="/login"
              onClick={closeMenu}
              icon={<FiArrowRight />}
              block
              className="mt-3"
            >
              Sign in
            </PillButton>
          </div>
        </div>
      )}
    </header>
  );
}
