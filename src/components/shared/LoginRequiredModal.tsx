"use client";

import Link from "next/link";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  planName,
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-8 flex flex-col items-center gap-5 transition-colors"
      >
        {/* Close button */}
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl leading-none"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl">
          🔒
        </div>

        {/* Heading */}
        <h2
          id="login-modal-title"
          className="text-xl font-bold text-gray-900 dark:text-white text-center"
        >
          Login required
        </h2>

        {/* Body */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          {planName ? (
            <>
              You need to be logged in to subscribe to{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {planName}
              </span>
              .
            </>
          ) : (
            "You need to be logged in to complete your purchase."
          )}
          <br />
          Please log in or create a free account to continue.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
          <Link
            href="/login?redirect=/user-dashboard/subscription"
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold text-center transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup?redirect=/user-dashboard/subscription"
            className="flex-1 py-3 rounded-xl border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-semibold text-center transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
