import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn, cva, type VariantProps } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg shadow-card hover:bg-primary-hover active:scale-[0.98]",
        secondary:
          "bg-surface text-ink shadow-card hover:bg-surface-2 active:scale-[0.98]",
        outline:
          "border border-border bg-transparent text-ink hover:bg-surface-2 active:scale-[0.98]",
        ghost: "text-ink hover:bg-surface-2",
        danger: "bg-alpha text-primary-fg hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 rounded-[8px] px-3 text-sm",
        md: "h-11 rounded-[12px] px-4 text-sm",
        lg: "h-12 rounded-[14px] px-5 text-base",
        icon: "size-11 rounded-[12px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
