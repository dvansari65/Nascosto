import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, resolving Tailwind conflicts sensibly
 * (e.g. cn("px-2", "px-4") -> "px-4").
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}