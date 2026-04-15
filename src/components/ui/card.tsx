import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   Card Component — DeMeloApps Design System
   
   Variants: default, glass, elevated, accent
   Reusable surface component with glassmorphism support.
   ═══════════════════════════════════════════════ */

type CardVariant = "default" | "glass" | "elevated" | "accent";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Add gradient border effect */
  gradientBorder?: boolean;
  /** Add inner light highlight */
  innerLight?: boolean;
  /** Add hover glow effect */
  hoverGlow?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: [
    "bg-[#111111]",
    "border border-[rgba(255,255,255,0.06)]",
  ].join(" "),

  glass: [
    "bg-white/[0.05]",
    "backdrop-blur-xl",
    "border border-white/[0.08]",
  ].join(" "),

  elevated: [
    "bg-[#161616]",
    "border border-[rgba(255,255,255,0.06)]",
    "shadow-lg",
  ].join(" "),

  accent: [
    "bg-[rgba(99,102,241,0.06)]",
    "backdrop-blur-lg",
    "border border-[rgba(99,102,241,0.12)]",
  ].join(" "),
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      gradientBorder = false,
      innerLight = false,
      hoverGlow = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl p-6 transition-all duration-300",
          variantStyles[variant],
          gradientBorder && "border-gradient",
          innerLight && "inner-light",
          hoverGlow && "hover:shadow-[0_0_60px_-12px_rgba(99,102,241,0.25)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ─── Card Sub-components ─── */

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold tracking-tight text-[#f5f5f7]",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-[#a1a1aa]", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  type CardProps,
  type CardVariant,
};
