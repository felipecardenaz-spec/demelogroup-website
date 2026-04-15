"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/constants";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "#work" },
  { label: "About us", href: "#about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const pathname = usePathname();

  const isActive = (href: string) => activeHref === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5">
      <nav
        style={{
          width: "100%",
          maxWidth: "750px",
          borderRadius: "9999px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.01), rgba(255,255,255,0.02))",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.40), 0 0 40px -12px rgba(99,102,241,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          position: "relative",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}
          aria-label="DeMeloApps home"
        >
          <div style={{ position: "relative", width: 140, height: 22, flexShrink: 0 }}>
            <Image
              src="/logoDeMeloApps.svg"
              alt="DeMeloApps logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </Link>

        {/* Center nav links — desktop only */}
        <ul
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: "4px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          role="list"
        >
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s",
                  background: isActive(link.href) ? "rgba(255,255,255,0.08)" : "transparent",
                  color: isActive(link.href) ? "#f5f5f7" : "#a1a1aa",
                  boxShadow: isActive(link.href) ? "inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "#f5f5f7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
                  }
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: CTA (desktop) + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {/* CTA Button — desktop only */}
          <div className="hidden md:block">
            <NavCTAButton href={siteConfig.cta.href} label={siteConfig.cta.label} />
          </div>

          {/* Mobile hamburger — hidden on md+ via CSS, not just className */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "9999px",
              background: mobileOpen ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none",
              color: "#a1a1aa",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4.5H14M2 8H14M2 11.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "16px",
            right: "16px",
            borderRadius: "20px",
            background: "rgba(10,10,10,0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.50)",
            padding: "8px",
          }}
        >
          <ul style={{ display: "flex", flexDirection: "column", gap: "2px", listStyle: "none", margin: 0, padding: 0 }} role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => { setActiveHref(link.href); setMobileOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 400,
                    textDecoration: "none",
                    color: isActive(link.href) ? "#f5f5f7" : "#a1a1aa",
                    background: isActive(link.href) ? "rgba(255,255,255,0.06)" : "transparent",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li style={{ paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4px" }}>
              <Link
                href={siteConfig.cta.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 400,
                  textDecoration: "none",
                  color: "white",
                  background: "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
                  boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.14), inset 0 -1px 0 0 rgba(0,0,0,0.30)",
                }}
              >
                {siteConfig.cta.label}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

/* ── Navbar CTA Button — premium glass sweep animation ── */
function NavCTAButton({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const scale = pressed ? 0.97 : hovered ? 1.03 : 1;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "10px 20px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 400,
        letterSpacing: "0.03em",
        textDecoration: "none",
        color: hovered ? "#ffffff" : "rgba(255,255,255,0.90)",
        background: hovered
          ? "linear-gradient(170deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)"
          : "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.28), inset 0 -1px 0 0 rgba(0,0,0,0.30), 0 6px 20px -4px rgba(79,70,229,0.55), 0 1px 4px rgba(0,0,0,0.30)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.14), inset 0 -1px 0 0 rgba(0,0,0,0.30)",
        border: hovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",
        transform: `scale(${scale})`,
        transition: pressed
          ? "transform 120ms ease, box-shadow 120ms ease"
          : "all 280ms cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* Layer 1: Wide angled light sweep */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "60%",
          left: hovered ? "120%" : "-60%",
          transform: "skewX(-12deg)",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.30) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
          transition: "left 550ms cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
        }}
      />
      {/* Layer 2: Secondary trailing glow */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "40%",
          left: hovered ? "130%" : "-40%",
          transform: "skewX(-12deg)",
          background: "linear-gradient(90deg, transparent 0%, rgba(165,180,252,0.12) 50%, transparent 100%)",
          transition: "left 700ms cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
        }}
      />
      {/* Layer 3: Top-edge metallic line */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.40), transparent)",
          pointerEvents: "none",
        }}
      />
      {label}
    </Link>
  );
}
