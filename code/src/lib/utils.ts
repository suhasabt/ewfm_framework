import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind classes safely — use everywhere instead of template strings */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
