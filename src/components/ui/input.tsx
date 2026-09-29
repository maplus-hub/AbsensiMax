import {
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-[12px] border border-border bg-surface px-3 text-sm text-ink outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus:shadow-[0_0_0_3px_rgba(20,92,76,0.18)]";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(fieldClass, className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldClass, "h-auto min-h-24 py-2.5", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const NativeSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  ),
);
NativeSelect.displayName = "NativeSelect";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-medium tracking-wide text-muted", className)}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
