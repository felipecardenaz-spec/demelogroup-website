import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   Container — Consistent max-width + horizontal padding
   
   Usage:
     <Container>content</Container>
     <Container size="sm">narrow content</Container>
   ═══════════════════════════════════════════════════════════════════ */

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max-width preset */
  size?: ContainerSize;
  /** HTML element to render */
  as?: "div" | "section" | "article" | "header" | "footer" | "nav";
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-2xl",       // 672px
  md: "max-w-4xl",       // 896px
  lg: "max-w-6xl",       // 1152px
  xl: "max-w-7xl",       // 1280px
  full: "max-w-full",
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", as: Tag = "div", children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Container.displayName = "Container";

export { Container, type ContainerProps, type ContainerSize };
