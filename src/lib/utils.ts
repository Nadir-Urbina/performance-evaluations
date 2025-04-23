import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind's JIT engine
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format currency amounts
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Shorten a string with ellipsis
 */
export function truncateString(str: string, length: number) {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Calculate the time remaining until a date
 */
export function getTimeRemaining(endDate: Date | string | number) {
  const total = new Date(endDate).getTime() - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

/**
 * Parse CSV or Excel data
 */
export function parseCSVData(csvData: string): string[][] {
  const rows = csvData.split("\n");
  return rows.map(row => row.split(",").map(cell => cell.trim()));
}

/**
 * Convert number to percentage string
 */
export function toPercentage(num: number) {
  return `${Math.round(num * 100)}%`;
} 