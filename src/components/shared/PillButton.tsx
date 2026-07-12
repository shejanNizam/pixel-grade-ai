import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "gradient" | "outline";
type Size = "sm" | "md";

interface PillButtonProps {
  children: ReactNode;
  /** Renders as a Next.js Link when set, otherwise a <button>. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  /** Sits after the label, as in the designs. */
  icon?: ReactNode;
  block?: boolean;
  className?: string;
  "aria-label"?: string;
}

/* `text-white!` is deliberate: antd's `.ant-app a { color: colorLink }` outranks
   Tailwind's utilities, so a plain `text-white` on a Link renders violet. */
const variants: Record<Variant, string> = {
  // Violet fill, a lighter violet ring, and a soft outer glow.
  solid:
    "bg-violet-600 text-white! ring-1 ring-violet-400/70 shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]",
  gradient:
    "bg-linear-to-r from-violet-500 to-cyan-400 text-white! hover:opacity-90",
  outline: "border border-white/25 text-white! hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "px-6 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
};

/** The violet pill CTA used across the marketing site and the dashboard. */
export default function PillButton({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  variant = "solid",
  size = "sm",
  icon,
  block = false,
  className = "",
  "aria-label": ariaLabel,
}: PillButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-all",
    "disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none disabled:ring-0",
    variants[variant],
    sizes[size],
    block ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </button>
  );
}
