import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const assertEnv = (name: string, value: unknown): string => {
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`Environment variable ${name} is not set properly.`);

  return value;
};
