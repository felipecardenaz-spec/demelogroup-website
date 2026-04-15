"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Types ─────────────────────────────────────────────────────── */
interface ServiceBlock {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  featured: {
    title: string;
    description: string;
    bullets: string[];
    visual: "software" | "mobile";
  };
  supportCards: [
    { title: string; description: string; visual: "top" | "bottom"; variant: "software" | "mobile" },
    { title: string; description: string; visual: "top" | "bottom"; variant: "software" | "mobile" },
  ];
}

/* ─── Data ─────────────────────────────────────────────────────── */
const BLOCKS: ServiceBlock[] = [
  {
    eyebrow: "For startups and businesses",
    heading: "Software Development",
    description:
      "Custom software development for startups and SMBs ready to streamline operations, launch faster, and scale with confidence. We deliver secure, scalable solutions that reduce complexity and modernize outdated systems.",
    primaryCta: "Start Your Project",
    secondaryCta: "View Our Work",
    featured: {
      title: "Business Software Solutions",
      description: "Tailored software built to streamline processes and improve efficiency.",
      bullets: [
        "CRM Systems",
        "HR Management Systems",
        "Inventory Management Systems",
        "Client Portals",
        "ERP Systems",
      ],
      visual: "software",
    },
    supportCards: [
      { title: "Streamline Operations", description: "Simplify your workflows and make your business run smoother.", visual: "top", variant: "software" },
      { title: "Transparent Processes", description: "Clear workflows that foster trust and partnership.", visual: "bottom", variant: "software" },
    ],
  },
  {
    eyebrow: "For startups and businesses",
    heading: "Mobile App Development",
    description:
      "Mobile app development services for startups and SMBs ready to increase customer engagement and improve operational efficiency. We deliver scalable, high-performance apps that simplify workflows and drive sustainable growth.",
    primaryCta: "Start Your Project",
    secondaryCta: "View Our Work",
    featured: {
      title: "Mobile App Solutions",
      description: "Scalable mobile applications designed to validate ideas, attract early users, and accelerate product-market fit.",
      bullets: [
        "Social Networking Apps",
        "Fitness & Wellness Apps",
        "On-Demand Service Platforms",
        "Subscription-Based Apps",
      ],
      visual: "mobile",
    },
    supportCards: [
      { title: "Market Differentiation", description: "Stand out with a dedicated mobile presence.", visual: "top", variant: "mobile" },
      { title: "Cross-Platform Efficiency", description: "Optimized development strategies to deliver consistent performance across iOS and Android.", visual: "bottom", variant: "mobile" },
    ],
  },
];

/* ─── Entrance variants ─────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
});

/* ─── Software Visual ───────────────────────────────────────────── */
function SoftwareVisual({ hovered }: { hovered: boolean }) {
  return (
    <div style={{
      position: "relative",
      height: "160px",
      overflow: "hidden",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Image with zoom + brightness on hover, mask-image fades top to transparent */}
      <img
        src="/images/business_solutions.png"
        alt="Business Software Solutions"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          filter: hovered ? "brightness(1.15)" : "brightness(1)",
          transition: "transform 600ms cubic-bezier(0.22,1,0.36,1), filter 400ms ease",
          willChange: "transform",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
        }}
      />
    </div>
  );
}

/* ─── Mobile Visual ─────────────────────────────────────────────── */
function MobileVisual({ hovered }: { hovered: boolean }) {
  return (
    <div style={{
      position: "relative",
      height: "165px",
      overflow: "hidden",
      /* Respect card's bottom padding only, full width on sides */
      margin: "0 0 24px",
      borderRadius: "0",
    }}>
      <img
        src="/images/mobile-mockup.png"
        alt="Mobile App Solutions"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          filter: hovered ? "brightness(1.12)" : "brightness(1)",
          transition: "transform 600ms cubic-bezier(0.22,1,0.36,1), filter 400ms ease",
          willChange: "transform",
          /* Fade from bottom — transparent at bottom, fully visible at top */
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
          maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
        }}
      />
    </div>
  );
}

/* ─── Support Card Visuals ──────────────────────────────────────── */
function SupportVisualTop({ variant }: { variant: "software" | "mobile" }) {
  const color = variant === "software" ? "rgba(99,102,241," : "rgba(139,92,246,";
  return (
    <div style={{
      height: "64px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${color}0.10) 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${color}0.12)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${color}0.15) 0%, transparent 70%)`,
      }} />
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" aria-hidden="true" style={{ position: "relative" }}>
        {variant === "software" ? (
          <>
            <rect x="10" y="12" width="28" height="16" rx="4" fill={`${color}0.20)`} stroke={`${color}0.30)`} strokeWidth="0.8" />
            <rect x="46" y="8" width="28" height="24" rx="4" fill={`${color}0.30)`} stroke={`${color}0.40)`} strokeWidth="0.8" />
            <rect x="82" y="14" width="28" height="12" rx="4" fill={`${color}0.20)`} stroke={`${color}0.30)`} strokeWidth="0.8" />
            <line x1="38" y1="20" x2="46" y2="20" stroke={`${color}0.35)`} strokeWidth="0.8" />
            <line x1="74" y1="20" x2="82" y2="20" stroke={`${color}0.35)`} strokeWidth="0.8" />
          </>
        ) : (
          <>
            <circle cx="30" cy="20" r="10" fill={`${color}0.15)`} stroke={`${color}0.30)`} strokeWidth="0.8" />
            <circle cx="60" cy="20" r="14" fill={`${color}0.25)`} stroke={`${color}0.40)`} strokeWidth="0.8" />
            <circle cx="90" cy="20" r="10" fill={`${color}0.15)`} stroke={`${color}0.30)`} strokeWidth="0.8" />
            <line x1="40" y1="20" x2="46" y2="20" stroke={`${color}0.35)`} strokeWidth="0.8" />
            <line x1="74" y1="20" x2="80" y2="20" stroke={`${color}0.35)`} strokeWidth="0.8" />
          </>
        )}
      </svg>
    </div>
  );
}

function SupportVisualBottom({ variant }: { variant: "software" | "mobile" }) {
  const color = variant === "software" ? "rgba(99,102,241," : "rgba(139,92,246,";
  const isSoftware = variant === "software";

  if (isSoftware) {
    /* ── Handshake visual for "Transparent Processes" ── */
    return (
      <div style={{
        height: "64px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)",
        border: "1px solid rgba(99,102,241,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Ambient radial glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Subtle horizontal line */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "12px",
          right: "12px",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(99,102,241,0.20), transparent)",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }} />
        {/* Handshake icon — Lucide-style "handshake" path */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{ position: "relative", zIndex: 1 }}
        >
          <path
            d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
            stroke="rgba(129,140,248,0.80)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(99,102,241,0.12)"
          />
          <path
            d="M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3h0a2.13 2.13 0 0 0 3.02 0L12 11.4l.11.1a2.13 2.13 0 0 0 3.02 0h0a2.13 2.13 0 0 0 0-3z"
            stroke="rgba(167,139,250,0.70)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(139,92,246,0.15)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div style={{
      height: "64px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, ${color}0.06) 100%)`,
      border: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 100%, ${color}0.12) 0%, transparent 70%)`,
      }} />
      <svg width="80" height="40" viewBox="0 0 80 40" fill="none" aria-hidden="true" style={{ position: "relative" }}>
        <circle cx="40" cy="20" r="14" fill={`${color}0.10)`} stroke={`${color}0.25)`} strokeWidth="0.8" />
        <circle cx="40" cy="20" r="8" fill={`${color}0.18)`} stroke={`${color}0.35)`} strokeWidth="0.8" />
        <circle cx="40" cy="20" r="3" fill={`${color}0.70)`} />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 40 + 18 * Math.cos(rad);
          const y = 20 + 18 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="1.5" fill={`${color}0.40)`} />;
        })}
      </svg>
    </div>
  );
}

/* ─── Featured Card ─────────────────────────────────────────────── */
function FeaturedCard({ data, active }: { data: ServiceBlock["featured"]; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(0.22)}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "20px",
        padding: "28px 24px 0",
        background: hovered
          ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hovered
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,0.09)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.08)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 6px 24px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.20), transparent)",
        pointerEvents: "none",
      }} />
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: "80%", height: "200px", borderRadius: "9999px",
        background: data.visual === "software"
          ? "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)"
          : "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        opacity: hovered ? 1.5 : 1,
        transition: "opacity 300ms ease",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 style={{
          fontSize: "16px", fontWeight: 600, letterSpacing: "-0.01em",
          color: "#f5f5f7", margin: "0 0 8px",
        }}>
          {data.title}
        </h3>
        <p style={{
          fontSize: "13px", fontWeight: 400, lineHeight: 1.6,
          color: "rgba(255,255,255,0.80)", margin: "0 0 16px",
        }}>
          {data.description}
        </p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {data.bullets.map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                background: data.visual === "software" ? "rgba(99,102,241,0.80)" : "rgba(139,92,246,0.80)",
              }} />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.80)", fontWeight: 400 }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Visual area */}
      <div style={{ marginTop: "auto", position: "relative", zIndex: 1, margin: "auto -0px 0" }}>
        {data.visual === "software" ? <SoftwareVisual hovered={hovered} /> : <MobileVisual hovered={hovered} />}
      </div>
    </motion.div>
  );
}

/* ─── Transparent Processes Card ───────────────────────────────── */
function TransparentProcessesCard({ delay, active }: { delay: number; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "16px",
        padding: "28px 20px",
        background: hovered
          ? "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hovered
          ? "1px solid rgba(255,255,255,0.14)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.30), 0 0 0 1px rgba(99,102,241,0.06)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.20)",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)",
        pointerEvents: "none",
      }} />

      {/* Radar rings + glow — anchored to icon position (upper half of card) */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "28px",
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pointerEvents: "none",
        height: "50px",
      }}>
        {/* Rings centered on the icon circle (50px tall, so center = 25px from top of this div) */}
        {[80, 110, 140].map((r, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${r}px`,
            height: `${r}px`,
            borderRadius: "50%",
            border: `1px solid rgba(99,102,241,${0.10 - i * 0.03})`,
            opacity: hovered ? 1 : 0.7,
            transition: "opacity 300ms ease",
          }} />
        ))}
        {/* Center radial glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(99,102,241,${hovered ? 0.14 : 0.08}) 0%, transparent 70%)`,
          transition: "background 300ms ease",
        }} />
      </div>

      {/* Icon circle */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "rgba(99,102,241,0.08)",
        border: `1px solid rgba(99,102,241,${hovered ? 0.35 : 0.20})`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hovered
          ? "0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.12)"
          : "0 0 10px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
      }}>
        <img
          src="/icons/hands-shaking.png"
          alt=""
          aria-hidden="true"
          style={{
            width: "25px",
            height: "25px",
            objectFit: "contain",
            filter: "none",
          }}
        />
      </div>

      {/* Text */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h4 style={{
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "#f5f5f7",
          margin: "0 0 6px",
          lineHeight: 1.3,
        }}>
          Transparent Processes
        </h4>
        <p style={{
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.70)",
          margin: 0,
        }}>
          Clear workflows that foster trust and partnership.
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Support Card ──────────────────────────────────────────────── */
function SupportCard({
  title, description, visual, variant, delay, active, bgImage,
}: {
  title: string; description: string;
  visual: "top" | "bottom"; variant: "software" | "mobile";
  delay: number; active: boolean;
  bgImage?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "16px",
        padding: "20px",
        background: hovered
          ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: hovered
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 8px 28px rgba(0,0,0,0.28)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 4px 14px rgba(0,0,0,0.20)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)",
        pointerEvents: "none",
      }} />

      {/* Background image with vertical fade-to-black mask */}
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />
          {/* Vertical fade: image visible at top, fades to black toward bottom where text lives */}
          <div aria-hidden="true" style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.70) 60%, rgba(0,0,0,0.97) 100%)",
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* Content sits above the image layers */}
      {!bgImage && (
        visual === "top"
          ? <SupportVisualTop variant={variant} />
          : <SupportVisualBottom variant={variant} />
      )}

      {bgImage ? (
        /* When there's a bg image: push text to the bottom */
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          zIndex: 1,
        }}>
          <h4 style={{
            fontSize: "14px", fontWeight: 600, letterSpacing: "-0.01em",
            color: "#f5f5f7", margin: "0 0 6px",
          }}>
            {title}
          </h4>
          <p style={{
            fontSize: "12px", fontWeight: 400, lineHeight: 1.6,
            color: "rgba(255,255,255,0.80)", margin: 0,
          }}>
            {description}
          </p>
        </div>
      ) : (
        <>
          <h4 style={{
            fontSize: "14px", fontWeight: 600, letterSpacing: "-0.01em",
            color: "#f5f5f7", margin: "0 0 6px",
            position: "relative", zIndex: 1,
          }}>
            {title}
          </h4>
          <p style={{
            fontSize: "12px", fontWeight: 400, lineHeight: 1.6,
            color: "rgba(255,255,255,0.80)", margin: 0,
            position: "relative", zIndex: 1,
          }}>
            {description}
          </p>
        </>
      )}
    </motion.div>
  );
}

/* ─── CTA Buttons ───────────────────────────────────────────────── */
function PrimaryBtn({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 22px",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: 400,
        letterSpacing: "0.02em",
        textDecoration: "none",
        color: "rgba(255,255,255,0.92)",
        background: hovered
          ? "linear-gradient(170deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)"
          : "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.28), 0 6px 20px -4px rgba(79,70,229,0.55)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.14)",
        border: hovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 260ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, width: "60%",
        left: hovered ? "120%" : "-60%",
        transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
        transition: "left 500ms cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }} />
      {label}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"
        style={{ transform: hovered ? "translateX(2px)" : "translateX(0)", transition: "transform 200ms", flexShrink: 0 }}>
        <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function SecondaryBtn({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#work"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 22px",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: 400,
        textDecoration: "none",
        color: hovered ? "#f5f5f7" : "#d4d4d8",
        background: hovered ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)",
        border: hovered ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(255,255,255,0.12)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 240ms cubic-bezier(0.22,1,0.36,1)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </a>
  );
}

/* ─── Service Block ─────────────────────────────────────────────── */
function ServiceBlock({ block, index }: { block: ServiceBlock; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} style={{ marginBottom: index === 0 ? "80px" : 0 }}>
      {/* 3-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px 275px",
        gap: "20px",
        alignItems: "stretch",
      }}
        className="services-grid"
      >
        {/* Left: copy */}
        <motion.div
          {...fadeUp(0.08)}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "4px" }}
        >
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            marginBottom: "14px",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "18px", height: "18px", borderRadius: "6px",
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M5 1L9 5L5 9M1 5H9" stroke="rgba(129,140,248,0.90)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{
              fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "rgba(129,140,248,0.80)",
            }}>
              {block.eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: "clamp(24px, 3vw, 24px)", fontWeight: 600,
            letterSpacing: "-0.02em", lineHeight: 1.15,
            color: "#f5f5f7", margin: "0 0 10px",
          }}>
            {block.heading}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: "14px", fontWeight: 400, lineHeight: 1.75,
            color: "rgba(255,255,255,0.80)", margin: "0 0 28px",
          }}>
            {block.description}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <PrimaryBtn label={block.primaryCta} />
            <SecondaryBtn label={block.secondaryCta} />
          </div>
        </motion.div>

        {/* Center: featured card */}
        <FeaturedCard data={block.featured} active={inView} />

        {/* Right: support cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {block.supportCards.map((card, i) => {
            if (card.title === "Transparent Processes") {
              return (
                <TransparentProcessesCard
                  key={card.title}
                  delay={0.34 + i * 0.10}
                  active={inView}
                />
              );
            }
            return (
              <SupportCard
                key={card.title}
                title={card.title}
                description={card.description}
                visual={card.visual}
                variant={card.variant}
                delay={0.34 + i * 0.10}
                active={inView}
              bgImage={
                card.title === "Streamline Operations" ? "/images/streamline-operations.png" :
                card.title === "Market Differentiation" ? "/images/mobileapps.png" :
                undefined
              }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */
export function Services() {
  return (
    <section
      aria-label="Services"
      style={{ padding: "0 20px 100px", position: "relative" }}
    >
      {/* Section ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%", top: "30%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "400px",
        borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {BLOCKS.map((block, i) => (
          <ServiceBlock key={block.heading} block={block} index={i} />
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .services-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .services-grid > *:first-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </section>
  );
}
