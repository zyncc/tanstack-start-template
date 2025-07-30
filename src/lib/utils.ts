import { type ClassValue, clsx } from "clsx";
import ShortUniqueId from "short-unique-id";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid(length: number = 12) {
  const { randomUUID } = new ShortUniqueId({ length });
  return randomUUID();
}
