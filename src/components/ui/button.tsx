import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   Button Component — DeMeloApps Design System
   
   Variants: primary, secondary, ghost
   Sizes: sm, md, lg
   
   Inspired by Linear + Stripe button aesthetics.
   ═══════════════════════════════════════════════ */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a glow effect (primarily for primary variant) */
  glow?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

const baseStyles = [
  // Layout
  "relative inline-flex items-center justify-center gap-2",
  // Typography
  "font-medium whitespace-nowrap",
  // Transitions
  "transition-all duration-200 ease-out",
  // Focus
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(99,102,241,0.50)]",
  // Disabled
  "disabled:pointer-events-none disabled:opacity-40",
  // Cursor
  "cursor-pointer",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    // Background — gradient
    "bg-gradient-to-b from-[#6366f1] to-[#5558e6]",
    // Text
    "text-white",
    // Border — subtle inner light
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]",
    // Hover
    "hover:from-[#818cf8] hover:to-[#6366f1]",
    "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_0_20px_-5px_rgba(99,102,241,0.50)]",
    // Active
    "active:from-[#5558e6] active:to-[#4f46e5] active:scale-[0.98]",
  ].join(" "),

  secondary: [
    // Background
    "bg-white/[0.05]",
    // Text
    "text-[#f5f5f7]",
    // Border
    "border border-white/[0.08]",
    // Backdrop
    "backdrop-blur-sm",
    // Hover
    "hover:bg-white/[0.08] hover:border-white/[0.12]",
    // Active
    "active:bg-white/[0.04] active:scale-[0.98]",
  ].join(" "),

  ghost: [
    // Background
    "bg-transparent",
    // Text
    "text-[#a1a1aa]",
    // Hover
    "hover:text-[#f5f5f7] hover:bg-white/[0.05]",
    // Active
    "active:bg-white/[0.03] active:scale-[0.98]",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-5 text-sm rounded-xl",
  lg: "h-12 px-7 text-base rounded-xl",
};

const glowStyles =
  "after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:shadow-[0_0_30px_-5px_rgba(99,102,241,0.60)] after:pointer-events-none";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      glow = false,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glow && variant === "primary" && glowStyles,
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
