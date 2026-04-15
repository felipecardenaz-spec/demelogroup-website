import { Montserrat, JetBrains_Mono } from "next/font/google";

/**
 * Primary font — Montserrat
 * Modern, geometric sans-serif. Premium feel for headings and UI.
 * Variable font — no weight specification needed.
 */
export const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Monospace font — JetBrains Mono
 * Used for code snippets, technical labels, and accents.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
