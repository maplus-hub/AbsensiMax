import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="#F3EEE4" strokeWidth="2" />
      <path
        d="M8.5 16.75 13.4 21.8 23.5 10.2"
        fill="none"
        stroke="#F3EEE4"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandWord({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-xl font-medium tracking-tight text-ink", className)}>
      AbsensiMax
    </span>
  );
}
