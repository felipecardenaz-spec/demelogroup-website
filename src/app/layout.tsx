import type { Metadata, Viewport } from "next";
import { fontSans, fontMono } from "@/lib/fonts";
import { siteConfig } from "@/lib/constants";
import { Navbar } from "@/components/sections/navbar";
import "./globals.css";

/* ═══════════════════════════════════════════════════════════════════
   Root Layout — DeMeloApps
   
   Responsibilities:
   - Font loading (Inter + JetBrains Mono via CSS variables)
   - Global metadata & viewport
   - Base HTML structure
   
   Sections (Navbar, Footer, etc.) will be added here as they're built.
   ═══════════════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Premium Software Development`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Premium Software Development`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Premium Software Development`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans overflow-x-clip">
        <Navbar />
        <main className="flex-1">{children}</main>
        {/* Future: <Footer /> */}
      </body>
    </html>
  );
}
