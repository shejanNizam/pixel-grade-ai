import type { ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  /** Short headline, e.g. "No notifications yet". */
  title: string;
  /** Optional supporting line under the title. */
  description?: string;
  /** Optional icon; defaults to an inbox glyph. */
  icon?: ReactNode;
  /** Optional call-to-action (button/link) rendered below the text. */
  action?: ReactNode;
  className?: string;
}

// Reusable placeholder for empty lists, search results, etc.
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-6 py-14 text-center ${className}`}
    >
      <div className="text-4xl text-gray-400 dark:text-gray-500">
        {icon ?? <FiInbox />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
