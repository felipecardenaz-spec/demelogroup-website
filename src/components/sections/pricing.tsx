"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────────── */
const MODELS = [
  {
    id: "launch",
    label: "Launch System",
    title: "Launch System",
    bestFor: "MVPs and focused automation",
    description: "Build a lean system to validate ideas or automate one critical workflow.",
    investment: "$5k – $15k",
    includes: [
      "Core workflow or product",
      "Essential integrations",
      "Clean UI and structure",
      "Launch-ready delivery",
    ],
    metrics: [
      { label: "Faster execution" },
      { label: "Reduced manual effort" },
    ],
  },
  {
    id: "growth",
    label: "Growth System",
    title: "Growth System",
    bestFor: "Scaling workflows and connected systems",
    description: "Build connected systems across sales, marketing, and operations.",
    investment: "$15k – $40k",
    includes: [
      "Multi-workflow automation",
      "Dashboards and portals",
      "AI-assisted processes",
      "System integrations",
    ],
    metrics: [
      { label: "+41% response speed" },
      { label: "More qualified leads" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced Ecosystem",
    title: "Advanced Ecosystem",
    bestFor: "Complex platforms and AI-driven operations",
    description: "Design and build scalable systems with advanced automation and infrastructure.",
    investment: "$40k+",
    includes: [
      "Custom architecture",
      "AI agents and automation",
      "Mobile + web platforms",
      "Advanced integrations",
    ],
    metrics: [
      { label: "Scalable systems" },
      { label: "Full operational visibility" },
    ],
  },
] as const;

type ModelId = typeof MODELS[number]["id"];

const FACTORS = ["Scope", "Complexity", "Integrations", "Timeline"] as const;

/* ─── Segmented selector ────────────────────────────────────────── */
function Selector({
  active,
  onChange,
}: {
  active: ModelId;
  onChange: (id: ModelId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Engagement model selector"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "5px",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {MODELS.map((m) => {
        const isActive = m.id === active;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(m.id)}
            style={{
              position: "relative",
              padding: "9px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "12.5px",
              fontWeight: isActive ? 500 : 400,
              letterSpacing: isActive ? "-0.01em" : "0",
              color: isActive ? "#f5f5f7" : "rgba(255,255,255,0.45)",
              background: isActive
                ? "linear-gradient(145deg, rgba(99,102,241,0.22) 0%, rgba(79,70,229,0.16) 100%)"
                : "transparent",
              boxShadow: isActive
                ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.20), 0 0 0 1px rgba(129,140,248,0.18)"
                : "none",
              transition: "all 220ms cubic-bezier(0.22,1,0.36,1)",
              whiteSpace: "nowrap",
              outline: "none",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="selector-bg"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "10px",
                  background: "linear-gradient(145deg, rgba(99,102,241,0.22) 0%, rgba(79,70,229,0.16) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.20), 0 0 0 1px rgba(129,140,248,0.18)",
                  zIndex: 0,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── System lines visual ───────────────────────────────────────── */
function SystemLines({ modelId }: { modelId: ModelId }) {
  const colors: Record<ModelId, string> = {
    launch: "rgba(99,102,241,",
    growth: "rgba(129,140,248,",
    advanced: "rgba(139,92,246,",
  };
  const c = colors[modelId];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, opacity: 0.35 }}
    >
      {/* Horizontal lines */}
      {[30, 70, 110, 150, 190].map((y, i) => (
        <line
          key={`h${i}`}
          x1="0" y1={y} x2="400" y2={y}
          stroke={`${c}0.08)`}
          strokeWidth="0.6"
        />
      ))}
      {/* Vertical lines */}
      {[60, 140, 220, 300, 380].map((x, i) => (
        <line
          key={`v${i}`}
          x1={x} y1="0" x2={x} y2="200"
          stroke={`${c}0.06)`}
          strokeWidth="0.6"
        />
      ))}
      {/* Accent nodes */}
      <circle cx="60" cy="70" r="2.5" fill={`${c}0.25)`} />
      <circle cx="220" cy="110" r="3" fill={`${c}0.30)`} />
      <circle cx="380" cy="150" r="2" fill={`${c}0.20)`} />
      <circle cx="140" cy="30" r="2" fill={`${c}0.18)`} />
      {/* Connecting lines */}
      <line x1="60" y1="70" x2="220" y2="110" stroke={`${c}0.12)`} strokeWidth="0.7" />
      <line x1="220" y1="110" x2="380" y2="150" stroke={`${c}0.10)`} strokeWidth="0.7" />
      <line x1="140" y1="30" x2="220" y2="110" stroke={`${c}0.08)`} strokeWidth="0.7" />
    </svg>
  );
}

/* ─── Content panel ─────────────────────────────────────────────── */
function ContentPanel({ model }: { model: typeof MODELS[number] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={model.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          borderRadius: "22px",
          overflow: "hidden",
          background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 40px rgba(0,0,0,0.28)",
        }}
      >
        {/* System lines background */}
        <SystemLines modelId={model.id} />

        {/* Top shimmer */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent, rgba(165,180,252,0.22), transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }} />

        {/* Radial glow behind content */}
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "-30%", left: "30%",
          width: "500px", height: "300px",
          borderRadius: "9999px",
          background: model.id === "advanced"
            ? "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 65%)"
            : "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Panel content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
        }}
          className="pricing-panel-grid"
        >
          {/* LEFT */}
          <div style={{
            padding: "40px 36px 40px 40px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}>
            {/* Title */}
            <h3 style={{
              fontSize: "clamp(22px, 2.5vw, 28px)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: "#f5f5f7",
              margin: "0 0 10px",
            }}>
              {model.title}
            </h3>

            {/* Best for */}
            <p style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 20px",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}>
              Best for: {model.bestFor}
            </p>

            {/* Description */}
            <p style={{
              fontSize: "14px",
              fontWeight: 300,
              lineHeight: 1.72,
              color: "rgba(255,255,255,0.75)",
              margin: "0 0 32px",
              maxWidth: "340px",
            }}>
              {model.description}
            </p>

            {/* Investment */}
            <div style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "4px",
              padding: "16px 20px",
              borderRadius: "14px",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(129,140,248,0.16)",
              alignSelf: "flex-start",
            }}>
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "rgba(165,180,252,0.60)",
              }}>
                Investment
              </span>
              <span style={{
                fontSize: "clamp(22px, 2.5vw, 28px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "rgba(200,206,255,0.95)",
                lineHeight: 1.1,
              }}>
                {model.investment}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{
            padding: "40px 40px 40px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}>
            {/* Includes */}
            <div style={{ marginBottom: "32px" }}>
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "rgba(129,140,248,0.55)",
                display: "block",
                marginBottom: "14px",
              }}>
                Includes
              </span>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {model.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                      background: "rgba(129,140,248,0.65)",
                    }} />
                    <span style={{
                      fontSize: "13.5px",
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: "rgba(255,255,255,0.80)",
                    }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div style={{
              height: "1px",
              background: "rgba(255,255,255,0.06)",
              marginBottom: "24px",
            }} />

            {/* Outcome metrics */}
            <div>
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "rgba(129,140,248,0.55)",
                display: "block",
                marginBottom: "14px",
              }}>
                Outcomes
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {model.metrics.map((m) => (
                  <div key={m.label} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="rgba(129,140,248,0.70)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{
                      fontSize: "12.5px",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.75)",
                    }}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Factors row ───────────────────────────────────────────────── */
function FactorsRow({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.20 }}
      style={{ marginTop: "48px" }}
    >
      <p style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        margin: "0 0 16px",
      }}>
        What affects the investment?
      </p>
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
        className="pricing-factors"
      >
        {FACTORS.map((f) => (
          <div key={f} style={{
            padding: "8px 16px",
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            fontSize: "12px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.01em",
          }}>
            {f}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── CTA block ─────────────────────────────────────────────────── */
function CTABlock({ active }: { active: boolean }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.30 }}
      style={{
        marginTop: "48px",
        padding: "36px 40px",
        borderRadius: "20px",
        background: "linear-gradient(145deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(129,140,248,0.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.20)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "28px",
        flexWrap: "wrap",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(165,180,252,0.22), transparent)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-60%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "200px", borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ flex: 1, minWidth: "220px", position: "relative", zIndex: 1 }}>
        <h3 style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          fontWeight: 600,
          letterSpacing: "-0.018em",
          lineHeight: 1.25,
          color: "#f5f5f7",
          margin: "0 0 6px",
        }}>
          Get a tailored estimate
        </h3>
        <p style={{
          fontSize: "13.5px",
          fontWeight: 300,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.65)",
          margin: 0,
        }}>
          Let&apos;s define your system, scope, and investment.
        </p>
      </div>

      <a
        href="#contact"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "13px 26px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: 400,
          letterSpacing: "0.02em",
          textDecoration: "none",
          color: "rgba(255,255,255,0.94)",
          background: hov
            ? "linear-gradient(170deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)"
            : "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
          boxShadow: hov
            ? "inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 20px -4px rgba(79,70,229,0.55)"
            : "inset 0 1px 0 rgba(255,255,255,0.14)",
          border: hov ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",
          transform: hov ? "scale(1.02)" : "scale(1)",
          transition: "all 260ms cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, bottom: 0, width: "60%",
          left: hov ? "120%" : "-60%",
          transform: "skewX(-12deg)",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
          transition: "left 500ms cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
        }} />
        Book a free call
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          style={{ transform: hov ? "translateX(2px)" : "translateX(0)", transition: "transform 200ms", flexShrink: 0 }}>
          <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export function Pricing() {
  const [activeId, setActiveId] = useState<ModelId>("growth");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const bodyInView = useInView(bodyRef, { once: true, margin: "-60px" });

  const activeModel = MODELS.find((m) => m.id === activeId)!;

  return (
    <section
      ref={sectionRef}
      id="investment"
      aria-label="Investment and Engagement Models"
      style={{ padding: "80px 20px 100px", position: "relative", overflow: "hidden" }}
    >
      {/* Background */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(6,6,18,0.55) 50%, rgba(5,5,5,0) 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%", top: "45%",
        transform: "translate(-50%, -50%)",
        width: "900px", height: "500px",
        borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.045) 0%, transparent 65%)",
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
            maxWidth: "640px",
            margin: "0 auto 48px",
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
              Investment &amp; Engagement
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
            Structured investment for<br />custom AI systems
          </h2>

          <p style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.72,
            color: "rgba(255,255,255,0.72)",
            margin: "0 auto",
            maxWidth: "480px",
          }}>
            Every project is tailored, but our engagement models help define scope, complexity, and expected investment.
          </p>
        </motion.div>

        {/* ── Selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}
        >
          <Selector active={activeId} onChange={setActiveId} />
        </motion.div>

        {/* ── Content panel ── */}
        <motion.div
          ref={bodyRef}
          initial={{ opacity: 0, y: 20 }}
          animate={bodyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <ContentPanel model={activeModel} />
        </motion.div>

        {/* ── Factors ── */}
        <FactorsRow active={bodyInView} />

        {/* ── CTA ── */}
        <CTABlock active={bodyInView} />
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-panel-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-panel-grid > *:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 28px 24px !important;
          }
          .pricing-panel-grid > *:last-child {
            padding: 24px 24px 28px !important;
          }
        }
        @media (max-width: 540px) {
          [role="tablist"] {
            flex-direction: column !important;
            width: 100% !important;
          }
          [role="tablist"] button {
            width: 100% !important;
            text-align: center !important;
          }
        }
      `}</style>
    </section>
  );
}
