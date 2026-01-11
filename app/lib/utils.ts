import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]): ReturnType<typeof twMerge> {
  return twMerge(clsx(inputs));
}
export const BACKEND_URL_API = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`;