import React from "react";

interface CustomSecondaryButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function CustomSecondaryButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: CustomSecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-11 sm:h-12 md:h-14 rounded-full px-6 sm:px-8 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-medium text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-secondary dark:hover:bg-secondary hover:text-white hover:border-secondary hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:dark:hover:bg-slate-800 disabled:hover:text-gray-700 touch-manipulation ${className}`}
    >
      {children}
    </button>
  );
}
