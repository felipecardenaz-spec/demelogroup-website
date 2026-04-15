import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   Section — Consistent vertical spacing wrapper
   
   Wraps page sections with standardized vertical padding.
   Pairs with <Container> for full layout control.
   
   Usage:
     <Section>
       <Container>
         <h2>Title</h2>
         <p>Content</p>
       </Container>
     </Section>
   ═══════════════════════════════════════════════════════════════════ */

type SectionSpacing = "sm" | "md" | "lg" | "xl";

interface SectionProps {
  /** Vertical padding preset */
  spacing?: SectionSpacing;
  /** Additional class names */
  className?: string;
  /** Section id for anchor links */
  id?: string;
  children: ReactNode;
}

const spacingStyles: Record<SectionSpacing, string> = {
  sm: "py-16 md:py-20",       // 64px → 80px
  md: "py-20 md:py-28",       // 80px → 112px
  lg: "py-24 md:py-32",       // 96px → 128px
  xl: "py-32 md:py-40",       // 128px → 160px
};

function Section({ className, spacing = "lg", id, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        spacingStyles[spacing],
        className
      )}
    >
      {children}
    </section>
  );
}

export { Section, type SectionProps, type SectionSpacing };
