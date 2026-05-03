"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Engagement model data ─────────────────────────────────────── */
const MODELS = [
  {
    id: "launch",
    label: "Focused launch",
    title: "Launch System",
    bestFor: "MVPs, first automations, and focused digital products",
    investment: "Starting from $5k–$15k",
    description:
      "A focused engagement for companies that need to validate an idea, automate one important workflow, or launch a lean digital product.",
    includes: [
      "Workflow or product discovery",
      "Core design and development",
      "Essential integrations",
      "Launch-ready implementation",
    ],
    highlighted: false,
  },
  {
    id: "growth",
    label: "Most common",
    title: "Growth System",
    bestFor: "Growing businesses ready to connect workflows and scale operations",
    investment: "Typical range $15k–$40k",
    description:
      "A more complete engagement for teams that need connected systems across sales, marketing, operations, dashboards, or customer experiences.",
    includes: [
      "Multi-workflow automation",
      "Custom dashboards or portals",
      "AI-assisted workflows",
      "Third-party integrations",
      "Launch and optimization support",
    ],
    highlighted: true,
  },
  {
    id: "advanced",
    label: "Custom ecosystem",
    title: "Advanced Ecosystem",
    bestFor: "Complex platforms, AI-enabled operations, and scalable product ecosystems",
    investment: "Custom scope / $40k+",
    description:
      "A strategic engagement for companies building complex software platforms, AI-powered systems, mobile ecosystems, or deeper operational infrastructure.",
    includes: [
      "Custom software architecture",
      "Advanced AI automation",
      "Mobile and web platforms",
      "Complex integrations",
      "Scalable infrastructure planning",
    ],
    highlighted: false,
  },
] as const;

const FACTORS = [
  {
    title: "Scope",
    description: "Number of workflows, screens, features, and user roles.",
  },
  {
    title: "Complexity",
    description: "Business logic, automation depth, data structure, and approval flows.",
  },
  {
    title: "Integrations",
    description: "CRMs, payment systems, APIs, communication tools, and internal platforms.",
  },
  {
    title: "Timeline",
    description: "Delivery speed, launch priorities, and phased rollout requirements.",
  },
] as const;

/* ─── Entrance helper ───────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
});

/* ─── Model card ────────────────────────────────────────────────── */
function ModelCard({
  model,
  active,
  delay,
}: {
  model: typeof MODELS[number];
  active: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const hl = model.highlighted;

  return (
    <motion.div
      {...fadeUp(delay)}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: hl ? "1.12" : "1",
        minWidth: 0,
        position: "relative",
        borderRadius: "20px",
        padding: hl ? "28px 24px 26px" : "24px 22px 22px",
        background: hl
          ? hovered
            ? "linear-gradient(145deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)"
            : "linear-gradient(145deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)"
          : hovered
            ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hl
          ? hovered
            ? "1px solid rgba(129,140,248,0.35)"
            : "1px solid rgba(129,140,248,0.22)"
          : hovered
            ? "1px solid rgba(255,255,255,0.16)"
            : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hl
          ? hovered
            ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.10)"
            : "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(99,102,241,0.06)"
          : hovered
            ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 32px rgba(0,0,0,0.28)"
            : "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.20)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        overflow: "hidden",
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: hl
          ? "linear-gradient(to right, transparent, rgba(165,180,252,0.40), transparent)"
          : "linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)",
        pointerEvents: "none",
      }} />

      {/* Ambient glow for highlighted */}
      {hl && (
        <div aria-hidden="true" style={{
          position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
          width: "80%", height: "200px", borderRadius: "9999px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Label badge */}
      <div style={{ marginBottom: "16px" }}>
        <span style={{
          display: "inline-block",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: "9999px",
          color: hl ? "rgba(165,180,252,0.90)" : "rgba(129,140,248,0.60)",
          background: hl ? "rgba(99,102,241,0.14)" : "rgba(99,102,241,0.07)",
          border: hl ? "1px solid rgba(129,140,248,0.22)" : "1px solid rgba(129,140,248,0.10)",
        }}>
          {model.label}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: hl ? "20px" : "17px",
        fontWeight: 600,
        letterSpacing: "-0.018em",
        lineHeight: 1.20,
        color: "#f5f5f7",
        margin: "0 0 6px",
      }}>
        {model.title}
      </h3>

      {/* Best for */}
      <p style={{
        fontSize: "11px",
        fontWeight: 400,
        lineHeight: 1.55,
        color: "rgba(255,255,255,0.50)",
        margin: "0 0 18px",
        fontStyle: "italic",
      }}>
        {model.bestFor}
      </p>

      {/* Investment */}
      <div style={{
        padding: "10px 14px",
        borderRadius: "10px",
        background: hl ? "rgba(99,102,241,0.10)" : "rgba(255,255,255,0.04)",
        border: hl ? "1px solid rgba(129,140,248,0.16)" : "1px solid rgba(255,255,255,0.06)",
        marginBottom: "18px",
      }}>
        <span style={{
          fontSize: hl ? "15px" : "13px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: hl ? "rgba(200,206,255,0.95)" : "rgba(245,245,247,0.80)",
        }}>
          {model.investment}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: "12.5px",
        fontWeight: 400,
        lineHeight: 1.68,
        color: "rgba(255,255,255,0.72)",
        margin: "0 0 20px",
      }}>
        {model.description}
      </p>

      {/* Divider */}
      <div style={{
        height: "1px",
        background: hl ? "rgba(129,140,248,0.12)" : "rgba(255,255,255,0.06)",
        marginBottom: "16px",
      }} />

      {/* Includes */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {model.includes.map((item) => (
          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}>
              <path
                d="M2 6L4.5 8.5L10 3.5"
                stroke={hl ? "rgba(165,180,252,0.80)" : "rgba(129,140,248,0.55)"}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: 1.55,
              color: hl ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.65)",
            }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Factor item ───────────────────────────────────────────────── */
function FactorItem({
  factor,
  active,
  delay,
}: {
  factor: typeof FACTORS[number];
  active: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...fadeUp(delay)}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0",
        minWidth: 0,
        padding: "18px 18px 16px",
        borderRadius: "14px",
        background: hovered
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.025)",
        border: hovered
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? "inset 0 1px 0 rgba(255,255,255,0.08)"
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 240ms cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)",
        pointerEvents: "none",
      }} />
      <h4 style={{
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: "#f5f5f7",
        margin: "0 0 6px",
      }}>
        {factor.title}
      </h4>
      <p style={{
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: 1.60,
        color: "rgba(255,255,255,0.65)",
        margin: 0,
      }}>
        {factor.description}
      </p>
    </motion.div>
  );
}

/* ─── CTA strip ─────────────────────────────────────────────────── */
function CTAStrip({ active }: { active: boolean }) {
  const [primaryHov, setPrimaryHov] = useState(false);
  const [secHov, setSecHov] = useState(false);

  return (
    <motion.div
      {...fadeUp(0.40)}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      style={{
        marginTop: "60px",
        borderRadius: "20px",
        padding: "36px 40px",
        background: "linear-gradient(145deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(129,140,248,0.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "32px",
        flexWrap: "wrap",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(165,180,252,0.25), transparent)",
        pointerEvents: "none",
      }} />
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-60%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "200px", borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Text */}
      <div style={{ flex: 1, minWidth: "240px", position: "relative", zIndex: 1 }}>
        <h3 style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          fontWeight: 600,
          letterSpacing: "-0.018em",
          lineHeight: 1.25,
          color: "#f5f5f7",
          margin: "0 0 8px",
        }}>
          Not sure which model fits your project?
        </h3>
        <p style={{
          fontSize: "13.5px",
          fontWeight: 400,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.72)",
          margin: 0,
          maxWidth: "480px",
        }}>
          Book a free call and we&apos;ll help define the right scope, timeline, and investment range for your goals.
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexShrink: 0,
        flexWrap: "wrap",
        position: "relative",
        zIndex: 1,
      }}>
        <a
          href="#contact"
          onMouseEnter={() => setPrimaryHov(true)}
          onMouseLeave={() => setPrimaryHov(false)}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "13px 24px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: "0.02em",
            textDecoration: "none",
            color: "rgba(255,255,255,0.94)",
            background: primaryHov
              ? "linear-gradient(170deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)"
              : "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
            boxShadow: primaryHov
              ? "inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 20px -4px rgba(79,70,229,0.55)"
              : "inset 0 1px 0 rgba(255,255,255,0.14)",
            border: primaryHov ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",
            transform: primaryHov ? "scale(1.02)" : "scale(1)",
            transition: "all 260ms cubic-bezier(0.22,1,0.36,1)",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden="true" style={{
            position: "absolute", top: 0, bottom: 0, width: "60%",
            left: primaryHov ? "120%" : "-60%",
            transform: "skewX(-12deg)",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
            transition: "left 500ms cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: "none",
          }} />
          Get a tailored estimate
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"
            style={{ transform: primaryHov ? "translateX(2px)" : "translateX(0)", transition: "transform 200ms", flexShrink: 0 }}>
            <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <a
          href="#work"
          onMouseEnter={() => setSecHov(true)}
          onMouseLeave={() => setSecHov(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: 400,
            textDecoration: "none",
            color: secHov ? "rgba(165,180,252,0.90)" : "rgba(255,255,255,0.55)",
            transition: "color 220ms ease",
            whiteSpace: "nowrap",
          }}
        >
          View our work
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            style={{ transform: secHov ? "translateX(2px)" : "translateX(0)", transition: "transform 200ms" }}>
            <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const modelsRef = useRef<HTMLDivElement>(null);
  const factorsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const modelsInView = useInView(modelsRef, { once: true, margin: "-60px" });
  const factorsInView = useInView(factorsRef, { once: true, margin: "-60px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      id="investment"
      aria-label="Investment and Engagement Models"
      style={{ padding: "80px 20px 100px", position: "relative", overflow: "hidden" }}
    >
      {/* Background atmosphere */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(6,6,16,0.50) 50%, rgba(5,5,5,0) 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%", top: "40%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "400px",
        borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "1050px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 22 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 auto 60px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Eyebrow */}
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

          {/* Headline */}
          <h2 style={{
            fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 500,
            letterSpacing: "-0.028em",
            lineHeight: 1.18,
            color: "#f0f0f5",
            margin: 0,
          }}>
            Flexible engagement models for AI systems,<br />software, and mobile apps
          </h2>

          {/* Subheadline */}
          <p style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.72,
            color: "rgba(255,255,255,0.72)",
            margin: "0 auto",
            maxWidth: "580px",
          }}>
            Every project is tailored to your goals, but our engagement models help you understand the level of investment, scope, and support typically required to build high-quality digital systems.
          </p>
        </motion.div>

        {/* ── Engagement models ── */}
        <div
          ref={modelsRef}
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
          className="pricing-models"
        >
          {MODELS.map((model, i) => (
            <ModelCard
              key={model.id}
              model={model}
              active={modelsInView}
              delay={0.08 + i * 0.10}
            />
          ))}
        </div>

        {/* ── What affects investment ── */}
        <div ref={factorsRef} style={{ marginTop: "56px" }}>
          <motion.div
            {...fadeUp(0.06)}
            animate={factorsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            style={{ marginBottom: "24px" }}
          >
            <h3 style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 500,
              letterSpacing: "-0.018em",
              color: "#f0f0f5",
              margin: "0 0 6px",
            }}>
              What affects the investment?
            </h3>
            <p style={{
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: 1.60,
              color: "rgba(255,255,255,0.55)",
              margin: 0,
            }}>
              These are the primary variables that shape the scope and cost of any engagement.
            </p>
          </motion.div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
            className="pricing-factors"
          >
            {FACTORS.map((factor, i) => (
              <FactorItem
                key={factor.title}
                factor={factor}
                active={factorsInView}
                delay={0.10 + i * 0.08}
              />
            ))}
          </div>
        </div>

        {/* ── CTA strip ── */}
        <div ref={ctaRef}>
          <CTAStrip active={ctaInView} />
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-models {
            flex-direction: column !important;
          }
          .pricing-models > * {
            flex: 1 1 auto !important;
          }
          .pricing-factors {
            flex-direction: column !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .pricing-models {
            flex-wrap: wrap !important;
          }
          .pricing-models > * {
            flex: 1 1 calc(50% - 8px) !important;
          }
        }
      `}</style>
    </section>
  );
}
