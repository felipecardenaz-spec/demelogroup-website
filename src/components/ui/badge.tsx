import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   Badge Component — DeMeloApps Design System
   
   Variants: default, accent, success, warning, error, outline
   Small label component for tags, statuses, and categories.
   ═══════════════════════════════════════════════ */

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/[0.06] text-[#a1a1aa] border-white/[0.06]",
  accent: "bg-[rgba(99,102,241,0.15)] text-[#818cf8] border-[rgba(99,102,241,0.20)]",
  success: "bg-[rgba(34,197,94,0.15)] text-[#22c55e] border-[rgba(34,197,94,0.20)]",
  warning: "bg-[rgba(234,179,8,0.15)] text-[#eab308] border-[rgba(234,179,8,0.20)]",
  error: "bg-[rgba(239,68,68,0.15)] text-[#ef4444] border-[rgba(239,68,68,0.20)]",
  outline: "bg-transparent text-[#a1a1aa] border-white/[0.10]",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, type BadgeProps, type BadgeVariant };
