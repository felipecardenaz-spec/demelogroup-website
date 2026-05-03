"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────────── */
const BLOCKS = [
  {
    id: "launch",
    position: "left" as const,
    title: "Launch System",
    description: "Focused systems to validate ideas or automate one workflow.",
    investment: "$5k – $15k",
    bullets: ["MVP builds", "Core automation", "Essential integrations"],
  },
  {
    id: "growth",
    position: "center" as const,
    title: "Growth System",
    description: "Connected systems to scale operations across your business.",
    investment: "$15k – $40k",
    bullets: ["Multi workflows", "Dashboards", "AI-assisted flows", "Integrations"],
  },
  {
    id: "advanced",
    position: "right" as const,
    title: "Advanced Systems",
    description: "Full ecosystems with advanced automation and scalability.",
    investment: "$40k+",
    bullets: ["Custom architecture", "AI systems", "Complex platforms"],
  },
] as const;

type BlockId = typeof BLOCKS[number]["id"];

const FACTORS = ["Scope", "Complexity", "Integrations", "Timeline"] as const;

/* ─── Faint connection lines SVG ────────────────────────────────── */
function ConnectionLines() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "visible",
      }}
      preserveAspectRatio="none"
    >
      {/* Horizontal faint line across center */}
      <line
        x1="0%" y1="50%"
        x2="100%" y2="50%"
        stroke="rgba(129,140,248,0.06)"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
      {/* Left block to center connector */}
      <line
        x1="28%" y1="50%"
        x2="38%" y2="50%"
        stroke="rgba(129,140,248,0.10)"
        strokeWidth="0.8"
      />
      {/* Center to right connector */}
      <line
        x1="62%" y1="50%"
        x2="72%" y2="50%"
        stroke="rgba(129,140,248,0.10)"
        strokeWidth="0.8"
      />
      {/* Left connector dot */}
      <circle cx="38%" cy="50%" r="2.5" fill="rgba(129,140,248,0.20)" />
      {/* Right connector dot */}
      <circle cx="62%" cy="50%" r="2.5" fill="rgba(129,140,248,0.20)" />
    </svg>
  );
}

/* ─── Block component ───────────────────────────────────────────── */
function Block({
  block,
  active,
  hoveredId,
  onHover,
  delay,
}: {
  block: typeof BLOCKS[number];
  active: boolean;
  hoveredId: BlockId | null;
  onHover: (id: BlockId | null) => void;
  delay: number;
}) {
  const isCenter = block.position === "center";
  const isDimmed = hoveredId !== null && hoveredId !== block.id;
  const isHovered = hoveredId === block.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: isCenter ? 24 : 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: isCenter ? 24 : 18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => onHover(block.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        flex: isCenter ? "1.18" : "1",
        minWidth: 0,
        position: "relative",
        borderRadius: isCenter ? "22px" : "18px",
        padding: isCenter ? "36px 32px 32px" : "28px 26px 26px",
        marginTop: isCenter ? "0" : "24px",
        background: isCenter
          ? isHovered
            ? "linear-gradient(145deg, rgba(99,102,241,0.10) 0%, rgba(255,255,255,0.04) 100%)"
            : "linear-gradient(145deg, rgba(99,102,241,0.07) 0%, rgba(255,255,255,0.03) 100%)"
          : isHovered
            ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isCenter
          ? isHovered
            ? "1px solid rgba(129,140,248,0.28)"
            : "1px solid rgba(129,140,248,0.16)"
          : isHovered
            ? "1px solid rgba(255,255,255,0.14)"
            : "1px solid rgba(255,255,255,0.07)",
        boxShadow: isCenter
          ? isHovered
            ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 16px 48px rgba(0,0,0,0.32), 0 0 0 1px rgba(99,102,241,0.08)"
            : "inset 0 1px 0 rgba(255,255,255,0.07), 0 10px 32px rgba(0,0,0,0.24), 0 0 0 1px rgba(99,102,241,0.05)"
          : isHovered
            ? "inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 24px rgba(0,0,0,0.24)"
            : "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 14px rgba(0,0,0,0.18)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        opacity: isDimmed ? 0.50 : 1,
        transition: "all 260ms cubic-bezier(0.22,1,0.36,1)",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        overflow: "hidden",
        zIndex: isHovered ? 2 : 1,
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: isCenter
          ? "linear-gradient(to right, transparent, rgba(165,180,252,0.30), transparent)"
          : "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
        pointerEvents: "none",
      }} />

      {/* Center ambient glow */}
      {isCenter && (
        <div aria-hidden="true" style={{
          position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
          width: "90%", height: "200px", borderRadius: "9999px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Title */}
      <h3 style={{
        fontSize: isCenter ? "clamp(18px, 2vw, 22px)" : "clamp(15px, 1.6vw, 17px)",
        fontWeight: 500,
        letterSpacing: "-0.018em",
        lineHeight: 1.20,
        color: isHovered ? "#ffffff" : "#f0f0f5",
        margin: "0 0 8px",
        transition: "color 220ms ease",
      }}>
        {block.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: isCenter ? "13.5px" : "12.5px",
        fontWeight: 300,
        lineHeight: 1.65,
        color: isHovered ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.55)",
        margin: "0 0 24px",
        transition: "color 220ms ease",
      }}>
        {block.description}
      </p>

      {/* Investment */}
      <div style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "2px",
        marginBottom: "24px",
        alignSelf: "flex-start",
      }}>
        <span style={{
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(165,180,252,0.50)",
        }}>
          Investment
        </span>
        <span style={{
          fontSize: isCenter ? "clamp(24px, 2.8vw, 32px)" : "clamp(20px, 2.2vw, 26px)",
          fontWeight: 600,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          color: isCenter
            ? isHovered ? "rgba(210,215,255,1)" : "rgba(200,206,255,0.92)"
            : isHovered ? "rgba(245,245,247,0.95)" : "rgba(245,245,247,0.75)",
          transition: "color 220ms ease",
        }}>
          {block.investment}
        </span>
      </div>

      {/* Divider */}
      <div style={{
        height: "1px",
        background: isCenter ? "rgba(129,140,248,0.10)" : "rgba(255,255,255,0.05)",
        marginBottom: "18px",
      }} />

      {/* Bullets */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
        {block.bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              width: "4px", height: "4px", borderRadius: "50%", flexShrink: 0,
              background: isCenter ? "rgba(129,140,248,0.60)" : "rgba(255,255,255,0.25)",
              transition: "background 220ms ease",
            }} />
            <span style={{
              fontSize: "12px",
              fontWeight: 400,
              color: isHovered ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)",
              letterSpacing: "0.01em",
              transition: "color 220ms ease",
            }}>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export function Pricing() {
  const [hoveredId, setHoveredId] = useState<BlockId | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const blocksInView = useInView(blocksRef, { once: true, margin: "-60px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      id="investment"
      aria-label="Investment and Scope"
      style={{ padding: "80px 20px 100px", position: "relative", overflow: "hidden" }}
    >
      {/* Background */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(6,6,18,0.50) 50%, rgba(5,5,5,0) 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Faint horizontal light line */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "50%", left: "10%", right: "10%",
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(129,140,248,0.06), transparent)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Center radial behind blocks */}
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%", top: "55%",
        transform: "translate(-50%, -50%)",
        width: "700px", height: "400px",
        borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "1050px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 22 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto 56px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "20px", height: "1px", background: "rgba(129,140,248,0.45)" }} />
            <span style={{
              fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(129,140,248,0.70)",
            }}>
              Investment &amp; Scope
            </span>
            <span style={{ display: "inline-block", width: "20px", height: "1px", background: "rgba(129,140,248,0.45)" }} />
          </div>

          <h2 style={{
            fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 500,
            letterSpacing: "-0.028em",
            lineHeight: 1.18,
            color: "#f0f0f5",
            margin: 0,
          }}>
            Different systems.<br />Different levels of investment.
          </h2>

          <p style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.72,
            color: "rgba(255,255,255,0.65)",
            margin: "0 auto",
            maxWidth: "460px",
          }}>
            Every project is tailored, but most engagements fall into one of these system levels based on scope, complexity, and business goals.
          </p>
        </motion.div>

        {/* ── Blocks ── */}
        <div
          ref={blocksRef}
          style={{ position: "relative" }}
        >
          {/* Connection lines (desktop only) */}
          <div
            aria-hidden="true"
            className="pricing-lines"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <ConnectionLines />
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              position: "relative",
              zIndex: 1,
            }}
            className="pricing-blocks"
          >
            {BLOCKS.map((block, i) => (
              <Block
                key={block.id}
                block={block}
                active={blocksInView}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                delay={0.06 + i * 0.10}
              />
            ))}
          </div>
        </div>

        {/* ── Footer row ── */}
        <motion.div
          ref={footerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Factors */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.30)",
              whiteSpace: "nowrap",
            }}>
              What defines the scope
            </span>
            <span style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.10)", flexShrink: 0 }} />
            {FACTORS.map((f, i) => (
              <span key={f} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.40)",
                  letterSpacing: "0.01em",
                }}>
                  {f}
                </span>
                {i < FACTORS.length - 1 && (
                  <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                )}
              </span>
            ))}
          </div>

          {/* CTA link */}
          <CTALink />
        </motion.div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-blocks {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .pricing-blocks > * {
            flex: 1 1 auto !important;
            margin-top: 0 !important;
          }
          .pricing-lines {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── CTA link ──────────────────────────────────────────────────── */
function CTALink() {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#contact"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12.5px",
        fontWeight: 400,
        textDecoration: "none",
        color: hov ? "rgba(165,180,252,0.90)" : "rgba(255,255,255,0.45)",
        transition: "color 220ms ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      Get a tailored estimate
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
        style={{ transform: hov ? "translateX(2px)" : "translateX(0)", transition: "transform 200ms" }}>
        <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
