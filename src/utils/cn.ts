import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 *
 * clsx handles conditional/array/object class values; twMerge ensures the last
 * conflicting Tailwind utility wins (e.g. `cn("p-2", "p-4")` -> "p-4").
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", { "opacity-50": disabled })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
