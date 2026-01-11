import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]): ReturnType<typeof twMerge> {
  return twMerge(clsx(inputs));
}