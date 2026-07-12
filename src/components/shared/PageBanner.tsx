interface PageBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
}

/**
 * Gradient title band for public pages (About, Privacy, Terms).
 *
 * The marketing navbar is absolutely positioned over the top of the page, so
 * this reserves height for it (`min-h-76` + `pt-28`) instead of sitting under it.
 */
export default function PageBanner({
  title,
  subtitle,
  description,
}: PageBannerProps) {
  return (
    <header className="relative flex min-h-76 flex-col items-center justify-center overflow-hidden bg-black px-4 pt-28 pb-14 text-center">
      {/* Violet pooling in the top-left, falling away to black. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #9d5cf5 0%, #7c3aed 18%, #4c1d95 42%, #240a4d 64%, #000000 88%)",
        }}
      />
      {/* Softens the hand-off into the black page body. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.7) 80%, #000000 100%)",
        }}
      />

      <div className="relative">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-white">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-white/70">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
