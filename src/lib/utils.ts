import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cva, type VariantProps };

export function nid(prefix: string) {
  const raw = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return `${prefix}_${raw}`;
}

export function todayWib(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export function formatDateId(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 4, 0, 0)));
}

export function formatTimeWib(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const DAY_NAMES = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

export function wibDayOfWeek(date = new Date()): number {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  return map[day] ?? 1;
}

export function weekdayDatesWib(count: number, beforeToday = 0): string[] {
  const dates: string[] = [];
  let cursor = new Date();
  cursor = new Date(cursor.getTime() - beforeToday * 24 * 60 * 60 * 1000);
  let guard = 0;
  while (dates.length < count && guard < 40) {
    const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(cursor);
    const dow = wibDayOfWeek(cursor);
    if (dow >= 1 && dow <= 5) dates.push(iso);
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    guard += 1;
  }
  return dates.reverse();
}

export function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadCsv(filename: string, header: string[], rows: (string | number | null | undefined)[][]) {
  const lines = [header.map(csvEscape).join(","), ...rows.map((r) => r.map(csvEscape).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printPage() {
  window.print();
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "AM";
}

export function daysAgoWib(n: number): string {
  const d = new Date();
  d.setTime(d.getTime() - n * 86400000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
}
