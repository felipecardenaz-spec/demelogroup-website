/**
 * Site-wide constants and configuration.
 * Single source of truth for brand info, navigation, and metadata.
 */

export const siteConfig = {
  name: "DeMeloApps",
  description:
    "Premium software development for startups and SMBs. We build high-performance custom solutions that scale.",
  url: "https://demeloapps.com",
  cta: {
    label: "Book a Free Call",
    href: "#contact",
  },
  nav: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
} as const;
