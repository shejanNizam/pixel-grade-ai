"use client";

import { App } from "antd";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowUp,
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiSend,
  FiTwitter,
} from "react-icons/fi";
import CustomPrimaryButton from "./CustomPrimaryButton";

const COPYRIGHT_YEAR = new Date().getFullYear();

const linkColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socials = [
  { label: "Twitter", href: "https://twitter.com", Icon: FiTwitter },
  { label: "GitHub", href: "https://github.com", Icon: FiGithub },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FiLinkedin },
  { label: "Instagram", href: "https://instagram.com", Icon: FiInstagram },
  { label: "Facebook", href: "https://facebook.com", Icon: FiFacebook },
];

export default function Footer() {
  const { message } = App.useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      message.error("Please enter a valid email address.");
      return;
    }
    // Frontend-only demo: no API call.
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      message.success("Subscribed! Check your inbox (demo).");
    }, 600);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-[#0a0f1e] text-white">
      {/* Top gradient hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
      />
      {/* Ambient glow + dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* ── Newsletter band ── */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Stay in the loop
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white">
              Product updates, tips, and company news — delivered occasionally.
              No spam, unsubscribe anytime.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md items-center gap-2"
          >
            <div className="relative flex-1">
              <FiSend className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <CustomPrimaryButton type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </CustomPrimaryButton>
          </form>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-3 lg:grid-cols-6 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-lg font-bold text-white shadow-md shadow-primary/30 transition-transform group-hover:scale-105">
                P
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-white">
                  Pixel<span className="text-primary">Grade</span> AI
                </span>
                <span className="mt-0.5 text-[10px] tracking-wide text-white">
                  Your tagline here
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white">
              The modern platform trusted by teams to launch, scale, and grow —
              all from one beautiful workspace.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-white transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-white">
            © {COPYRIGHT_YEAR} PixelGrade AI, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-xs text-white transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-white transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60" />
              All systems operational
            </span>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-white"
          >
            <FiArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
