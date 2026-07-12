import Link from "next/link";
import React from "react";

type ButtonSize = "sm" | "md" | "lg";

interface CustomPrimaryButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** When provided, the button renders as a Next.js Link for navigation. */
  href?: string;
  /** Visual size preset. Defaults to "md". */
  size?: ButtonSize;
  /** Stretch to the full width of the parent. */
  block?: boolean;
  /** Optional leading icon. */
  icon?: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-sm sm:text-base",
  lg: "h-12 sm:h-13 md:h-14 px-8 text-base md:text-lg",
};

export default function CustomPrimaryButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  href,
  size = "md",
  block = false,
  icon,
}: CustomPrimaryButtonProps) {
  const classes = [
    // layout
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap select-none",
    // brand gradient — weighted toward primary so white text stays high-contrast
    "bg-linear-to-r from-primary via-primary to-secondary text-white!",
    // depth
    "shadow-lg shadow-primary/30 ring-1 ring-inset ring-white/15",
    // motion
    "transition-all duration-300 hover:shadow-primary/50 hover:brightness-110 active:scale-95",
    // disabled
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:brightness-100 disabled:active:scale-100",
    "cursor-pointer touch-manipulation",
    sizeClasses[size],
    block ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Sliding sheen that sweeps across on hover for a premium feel.
  const content = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      {icon && <span className="relative text-[1.1em]">{icon}</span>}
      <span className="relative">{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
}
