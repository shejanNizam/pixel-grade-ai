interface AuthHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
}

/** Centered title (+ optional supporting line) above each auth form. */
export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-[26px] font-semibold tracking-tight text-zinc-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Full-width violet pill — the primary CTA on every auth screen. */
export const authPrimaryBtn =
  "h-13! rounded-full! border-none! text-[15px]! font-medium! shadow-none!";

/** Red accent used for the inline links ("Sign up", "Forgot password?"). */
export const authAccentLink =
  "font-medium text-accent hover:opacity-80 transition-opacity";

/** Muted line beneath the form that hosts an accent link. */
export const authFootnote =
  "mt-4 text-center text-sm text-zinc-700 dark:text-zinc-200";
