import { ReactNode } from "react";

interface CustomBannerProps {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function CustomBanner({
  badge,
  title,
  subtitle,
  children,
}: CustomBannerProps) {
  return (
    <section className="py-12 md:py-16 px-4 bg-[#F8FAFC] dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl text-center">
        {badge && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#E0E7FF] dark:bg-blue-900/30 text-[#3B82F6] dark:text-[#60A5FA] text-xs font-semibold mb-4">
            {badge}
          </span>
        )}

        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>

        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
