import Image from "next/image";
import Link from "next/link";

/**
 * Auth shell — the logo mark and the form sit side by side on a full-bleed
 * canvas (black in dark mode, white in light). The `auth-shell` class scopes
 * the pill-field styling in globals.css to these screens.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell min-h-screen bg-white dark:bg-black">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 px-5 py-12 lg:flex-row lg:gap-20">
        <Link
          href="/"
          aria-label="PixelGrade AI home"
          className="shrink-0 transition-opacity hover:opacity-90"
        >
          <Image
            src="/assets/main_logo.png"
            alt="PixelGrade AI"
            width={260}
            height={260}
            priority
            className="h-24 w-auto lg:h-56"
          />
        </Link>

        <main className="w-full max-w-100">{children}</main>
      </div>
    </div>
  );
}
