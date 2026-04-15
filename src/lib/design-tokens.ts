/**
 * Design Tokens — DeMeloApps Design System
 *
 * Single source of truth for all design primitives.
 * Inspired by Linear + Apple + Stripe — futuristic but clean.
 *
 * Usage: Import tokens where needed, or reference CSS custom properties
 * defined in globals.css for Tailwind/CSS usage.
 */

// ─────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────

export const colors = {
  // Background layers (darkest to lightest)
  bg: {
    primary: "#050505",
    secondary: "#0a0a0a",
    tertiary: "#111111",
    elevated: "#161616",
    surface: "#1a1a1a",
    overlay: "rgba(0, 0, 0, 0.80)",
  },

  // Foreground / Text
  text: {
    primary: "#f5f5f7",
    secondary: "#a1a1aa",
    tertiary: "#71717a",
    muted: "#52525b",
    inverse: "#050505",
  },

  // Border
  border: {
    default: "rgba(255, 255, 255, 0.06)",
    subtle: "rgba(255, 255, 255, 0.04)",
    medium: "rgba(255, 255, 255, 0.10)",
    strong: "rgba(255, 255, 255, 0.16)",
    focus: "rgba(99, 102, 241, 0.50)",
  },

  // Brand / Accent
  accent: {
    primary: "#6366f1", // Indigo
    primaryHover: "#818cf8",
    primaryMuted: "rgba(99, 102, 241, 0.15)",
    secondary: "#8b5cf6", // Violet
    secondaryHover: "#a78bfa",
    secondaryMuted: "rgba(139, 92, 246, 0.15)",
  },

  // Semantic
  success: {
    default: "#22c55e",
    muted: "rgba(34, 197, 94, 0.15)",
  },
  warning: {
    default: "#eab308",
    muted: "rgba(234, 179, 8, 0.15)",
  },
  error: {
    default: "#ef4444",
    muted: "rgba(239, 68, 68, 0.15)",
  },
  info: {
    default: "#3b82f6",
    muted: "rgba(59, 130, 246, 0.15)",
  },
} as const;

// ─────────────────────────────────────────────
// GRADIENTS
// ─────────────────────────────────────────────

export const gradients = {
  // Primary brand gradient
  brand: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  brandSubtle: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)",

  // Hero / section backgrounds
  heroRadial:
    "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15) 0%, transparent 60%)",
  heroRadialViolet:
    "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.12) 0%, transparent 60%)",

  // Mesh / ambient gradients
  meshPrimary:
    "radial-gradient(at 27% 37%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(at 97% 21%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(at 52% 99%, rgba(168,85,247,0.04) 0%, transparent 50%)",
  meshSecondary:
    "radial-gradient(at 0% 0%, rgba(99,102,241,0.06) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(139,92,246,0.06) 0%, transparent 50%)",

  // Card / surface gradients
  cardShine:
    "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 60%)",
  cardBorder:
    "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",

  // Text gradients
  textBrand: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  textShine:
    "linear-gradient(110deg, #f5f5f7 0%, #a1a1aa 45%, #f5f5f7 55%, #a1a1aa 100%)",
} as const;

// ─────────────────────────────────────────────
// GLOW EFFECTS
// ─────────────────────────────────────────────

export const glows = {
  // Accent glows
  primary: "0 0 60px -12px rgba(99, 102, 241, 0.40)",
  primarySoft: "0 0 80px -20px rgba(99, 102, 241, 0.25)",
  primaryIntense: "0 0 100px -10px rgba(99, 102, 241, 0.50)",

  violet: "0 0 60px -12px rgba(139, 92, 246, 0.40)",
  violetSoft: "0 0 80px -20px rgba(139, 92, 246, 0.25)",

  // Combined / ambient
  ambient:
    "0 0 80px -20px rgba(99,102,241,0.20), 0 0 60px -15px rgba(139,92,246,0.15)",
  ambientStrong:
    "0 0 120px -20px rgba(99,102,241,0.30), 0 0 80px -15px rgba(139,92,246,0.20)",

  // Button glows
  buttonPrimary: "0 0 20px -5px rgba(99, 102, 241, 0.50)",
  buttonPrimaryHover: "0 0 30px -5px rgba(99, 102, 241, 0.60)",
} as const;

// ─────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────

export const shadows = {
  // Elevation system
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.40)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.50), 0 1px 2px -1px rgba(0, 0, 0, 0.50)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.50), 0 2px 4px -2px rgba(0, 0, 0, 0.50)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.50), 0 4px 6px -4px rgba(0, 0, 0, 0.50)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.50), 0 8px 10px -6px rgba(0, 0, 0, 0.50)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.70)",

  // Inset
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.30)",
  innerLight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.03)",
} as const;

// ─────────────────────────────────────────────
// TYPOGRAPHY SCALE
// ─────────────────────────────────────────────

export const typography = {
  // Font families (CSS variable references)
  fontFamily: {
    sans: "var(--font-sans), system-ui, -apple-system, sans-serif",
    mono: "var(--font-mono), 'SF Mono', 'Fira Code', monospace",
  },

  // Font sizes — modular scale (1.250 ratio)
  fontSize: {
    "2xs": ["0.625rem", { lineHeight: "0.875rem", letterSpacing: "0.04em" }], // 10px
    xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.02em" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }], // 36px
    "5xl": ["3rem", { lineHeight: "3.25rem", letterSpacing: "-0.03em" }], // 48px
    "6xl": ["3.75rem", { lineHeight: "4rem", letterSpacing: "-0.04em" }], // 60px
    "7xl": ["4.5rem", { lineHeight: "4.75rem", letterSpacing: "-0.04em" }], // 72px
    "8xl": ["6rem", { lineHeight: "6.25rem", letterSpacing: "-0.05em" }], // 96px
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// ─────────────────────────────────────────────
// SPACING SYSTEM
// ─────────────────────────────────────────────

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px

  // Section spacing
  section: {
    sm: "4rem", // 64px
    md: "6rem", // 96px
    lg: "8rem", // 128px
    xl: "10rem", // 160px
  },

  // Container
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────

export const radius = {
  none: "0",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.25rem", // 20px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// ─────────────────────────────────────────────
// ANIMATION / TRANSITIONS
// ─────────────────────────────────────────────

export const animation = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// ─────────────────────────────────────────────
// GLASSMORPHISM PRESETS
// ─────────────────────────────────────────────

export const glass = {
  // Light glass (subtle)
  subtle: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  // Standard glass
  default: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  // Strong glass
  strong: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  // Dark glass (for overlays)
  dark: {
    background: "rgba(5, 5, 5, 0.80)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  // Accent-tinted glass
  accent: {
    background: "rgba(99, 102, 241, 0.06)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(99, 102, 241, 0.12)",
  },
} as const;

// ─────────────────────────────────────────────
// Z-INDEX SCALE
// ─────────────────────────────────────────────

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  max: 100,
} as const;
