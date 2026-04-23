"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────── */
type CardId = "marketing" | "sales" | "operations";

/* ─── Mini visualizations ────────────────────────────────────────── */

/** Card 1 — Marketing: content pipeline + upward trend */
function MarketingViz({ t, hovered }: { t: number; hovered: boolean }) {
  const intensity = hovered ? 1.4 : 1.0;
  // Trend line points
  const base = [12, 10, 13, 8, 11, 6, 9, 4, 7, 2];
  const pts = base.map((y, i) => [
    i * 11,
    Math.max(0, y + 1.5 * Math.sin(t * 0.45 + i * 0.9) * intensity),
  ]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

  // Pipeline nodes
  const nodes = [0, 1, 2, 3, 4];
  const nodeOp = (i: number) => {
    const phase = (t * 0.6 + i * 0.22) % 1;
    return (0.30 + 0.45 * Math.abs(Math.sin(phase * Math.PI * 2))) * intensity;
  };

  return (
    <div style={{ width: "100%", height: "72px", position: "relative", overflow: "hidden" }}>
      {/* Pipeline row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0", position: "absolute", top: "8px", left: "0", right: "0", padding: "0 4px" }}>
        {nodes.map((i) => {
          const op = nodeOp(i);
          const isActive = Math.sin(t * 0.7 + i * 0.5) > 0.3;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                background: `rgba(129,140,248,${(op * 0.9).toFixed(2)})`,
                boxShadow: isActive ? `0 0 6px rgba(99,102,241,${(op * 0.5).toFixed(2)})` : "none",
                transition: "box-shadow 400ms ease",
              }} />
              {i < nodes.length - 1 && (
                <div style={{ flex: 1, height: "1px", background: `rgba(129,140,248,${(op * 0.35).toFixed(2)})` }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Trend chart */}
      <svg width="100%" height="44" viewBox="0 0 99 14" fill="none" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "4px", left: "4px", right: "4px", width: "calc(100% - 8px)" }}>
        <defs>
          <linearGradient id="mktFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(129,140,248,0.18)" />
            <stop offset="100%" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <path d={`${d} L 99 14 L 0 14 Z`} fill="url(#mktFill)" />
        <path d={d} stroke={`rgba(129,140,248,${(0.55 * intensity).toFixed(2)})`} strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.8" fill={`rgba(165,180,252,${(0.85 * intensity).toFixed(2)})`} />
      </svg>
    </div>
  );
}

/** Card 2 — Sales: pipeline stages + lead pulses */
function SalesViz({ t, hovered }: { t: number; hovered: boolean }) {
  const intensity = hovered ? 1.4 : 1.0;
  const stages = ["Capture", "Qualify", "Respond", "Convert"];
  const stageW = [0.55, 0.42, 0.32, 0.22];

  return (
    <div style={{ width: "100%", height: "72px", position: "relative", padding: "6px 4px 4px" }}>
      {/* Funnel bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {stages.map((label, i) => {
          const fill = stageW[i] * (0.85 + 0.15 * Math.sin(t * 0.5 + i * 0.8)) * intensity;
          const pulse = 0.28 + 0.22 * Math.abs(Math.sin(t * 1.1 + i * 0.6));
          const isActive = Math.sin(t * 0.8 + i * 0.4) > 0.2;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "7.5px", color: `rgba(160,168,220,${(0.45 * intensity).toFixed(2)})`, width: "38px", flexShrink: 0, letterSpacing: "0.04em" }}>
                {label}
              </span>
              <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(129,140,248,0.08)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(100, fill * 100)}%`,
                  borderRadius: "2px",
                  background: `linear-gradient(90deg,rgba(99,102,241,${(0.55 * intensity).toFixed(2)}),rgba(165,180,252,${(0.80 * intensity).toFixed(2)}))`,
                  transition: "width 600ms ease",
                }} />
              </div>
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                background: `rgba(129,140,248,${pulse.toFixed(2)})`,
                boxShadow: isActive ? `0 0 5px rgba(99,102,241,0.35)` : "none",
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Card 3 — Operations: workflow nodes + sync indicators */
function OpsViz({ t, hovered }: { t: number; hovered: boolean }) {
  const intensity = hovered ? 1.4 : 1.0;
  const tasks = [
    { label: "Workflow", fill: 0.78 },
    { label: "Reporting", fill: 0.62 },
    { label: "Sync", fill: 0.88 },
  ];

  // Animated connection dots
  const connProgress = ((t * 0.4) % 1 + 1) % 1;

  return (
    <div style={{ width: "100%", height: "72px", position: "relative", padding: "4px" }}>
      {/* Task rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "6px" }}>
        {tasks.map((task, i) => {
          const animated = task.fill * (0.80 + 0.20 * Math.sin(t * 0.38 + i * 1.1));
          const op = 0.32 + 0.28 * Math.abs(Math.sin(t * 0.9 + i * 0.7));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "5px", height: "5px", borderRadius: "1px", flexShrink: 0,
                background: `rgba(129,140,248,${(op * intensity).toFixed(2)})`,
              }} />
              <span style={{ fontSize: "7.5px", color: `rgba(160,168,220,${(0.45 * intensity).toFixed(2)})`, width: "44px", flexShrink: 0, letterSpacing: "0.04em" }}>
                {task.label}
              </span>
              <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(129,140,248,0.08)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(100, animated * 100)}%`,
                  borderRadius: "1px",
                  background: `rgba(129,140,248,${(0.55 * intensity).toFixed(2)})`,
                  transition: "width 500ms ease",
                }} />
              </div>
              <span style={{ fontSize: "7px", color: `rgba(129,140,248,${(0.50 * intensity).toFixed(2)})`, letterSpacing: "0.06em", fontWeight: 600 }}>
                AUTO
              </span>
            </div>
          );
        })}
      </div>
      {/* Sync pulse row */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingLeft: "2px" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const active = Math.abs(connProgress - i / 6) < 0.18;
          const op = active ? 0.75 * intensity : (0.18 + 0.12 * Math.sin(t * 0.6 + i * 0.9)) * intensity;
          return (
            <div key={i} style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: `rgba(129,140,248,${op.toFixed(2)})`,
              transition: "background 200ms ease",
            }} />
          );
        })}
        <div style={{ flex: 1, height: "1px", background: `rgba(129,140,248,${(0.12 * intensity).toFixed(2)})` }} />
        <span style={{ fontSize: "7px", color: `rgba(129,140,248,${(0.45 * intensity).toFixed(2)})`, letterSpacing: "0.06em" }}>SYNC</span>
      </div>
    </div>
  );
}

/* ─── Card data ──────────────────────────────────────────────────── */
const CARDS: {
  id: CardId;
  title: string;
  description: string;
  items: string[];
  accentHue: string;
}[] = [
  {
    id: "marketing",
    title: "Marketing & Content Systems",
    description:
      "Automate content creation, campaign workflows, publishing pipelines, and performance visibility across your marketing operation.",
    items: ["Content generation", "Campaign execution", "Publishing workflows"],
    accentHue: "rgba(99,102,241,",
  },
  {
    id: "sales",
    title: "Sales & Lead Systems",
    description:
      "Capture, qualify, respond to, and manage leads with AI-powered systems that improve speed and reduce missed opportunities.",
    items: ["Lead capture", "Qualification flows", "Automated follow-ups"],
    accentHue: "rgba(139,92,246,",
  },
  {
    id: "operations",
    title: "Operations & Workflow Systems",
    description:
      "Streamline repetitive tasks, internal processes, reporting flows, and team coordination with intelligent operational automation.",
    items: ["Workflow automation", "Reporting systems", "Task coordination"],
    accentHue: "rgba(79,70,229,",
  },
];

/* ─── Single card ────────────────────────────────────────────────── */
function ImpactCard({
  card,
  t,
  delay,
}: {
  card: typeof CARDS[0];
  t: number;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 280px",
        minWidth: "260px",
        maxWidth: "400px",
        position: "relative",
        borderRadius: "20px",
        background: hovered
          ? "rgba(10,10,28,0.82)"
          : "rgba(8,8,22,0.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: hovered
          ? `1px solid rgba(129,140,248,0.28)`
          : `1px solid rgba(129,140,248,0.12)`,
        boxShadow: hovered
          ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 20px 60px rgba(0,0,0,0.38), 0 0 28px rgba(99,102,241,0.12)`
          : `inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.24)`,
        transform: hovered ? "translateY(-4px) scale(1.012)" : "translateY(0) scale(1)",
        transition: "all 320ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: hovered
          ? "linear-gradient(to right,transparent,rgba(165,180,252,0.30),transparent)"
          : "linear-gradient(to right,transparent,rgba(165,180,252,0.10),transparent)",
        transition: "background 320ms ease",
        pointerEvents: "none",
      }} />

      {/* Corner accent glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, right: 0, width: "120px", height: "120px",
        background: `radial-gradient(circle at 100% 0%,${card.accentHue}${hovered ? "0.10" : "0.05"}) 0%,transparent 70%)`,
        pointerEvents: "none",
        transition: "background 320ms ease",
      }} />

      <div style={{ padding: "22px 22px 20px" }}>

        {/* ── Top visual zone ── */}
        <div style={{
          borderRadius: "12px",
          background: "rgba(129,140,248,0.04)",
          border: "1px solid rgba(129,140,248,0.08)",
          marginBottom: "18px",
          overflow: "hidden",
          padding: "10px 10px 6px",
        }}>
          {card.id === "marketing" && <MarketingViz t={t} hovered={hovered} />}
          {card.id === "sales"     && <SalesViz     t={t} hovered={hovered} />}
          {card.id === "operations"&& <OpsViz       t={t} hovered={hovered} />}
        </div>

        {/* ── Content zone ── */}
        <h3 style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "rgba(235,238,255,0.96)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          margin: "0 0 10px",
        }}>
          {card.title}
        </h3>

        <p style={{
          fontSize: "13.5px",
          fontWeight: 300,
          color: "rgba(180,186,220,0.72)",
          lineHeight: 1.65,
          margin: "0 0 18px",
        }}>
          {card.description}
        </p>

        {/* ── Bottom micro-details zone ── */}
        <div style={{
          borderTop: "1px solid rgba(129,140,248,0.08)",
          paddingTop: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "7px",
        }}>
          {card.items.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "4px", height: "4px", borderRadius: "50%", flexShrink: 0,
                background: "rgba(129,140,248,0.55)",
              }} />
              <span style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "rgba(160,168,220,0.60)",
                letterSpacing: "0.02em",
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

/* ─── Micro-benefits row ─────────────────────────────────────────── */
const BENEFITS = [
  "Less manual work",
  "Faster execution",
  "Better response times",
  "Clearer operational visibility",
];

function BenefitsRow({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        marginTop: "48px",
      }}
    >
      {BENEFITS.map((b) => (
        <div key={b} style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "7px 14px",
          borderRadius: "9999px",
          background: "rgba(129,140,248,0.06)",
          border: "1px solid rgba(129,140,248,0.12)",
        }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(129,140,248,0.55)", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", fontWeight: 400, color: "rgba(180,186,220,0.70)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
            {b}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Main section ───────────────────────────────────────────────── */
export function ImpactAreas() {
  const [t, setT] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  useEffect(() => {
    let raf: number, start: number | null = null;
    const loop = (ts: number) => {
      if (!start) start = ts;
      setT((ts - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="AI Systems Across Your Business"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 80px",
      }}
    >
      {/* Atmospheric background */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {/* Subtle gradient field */}
        <div style={{
          position: "absolute", left: "50%", top: "0", transform: "translateX(-50%)",
          width: "900px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%,rgba(88,92,241,0.028) 0%,rgba(88,92,241,0.004) 60%,transparent 80%)",
        }} />
        {/* Faint horizontal rule */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: "linear-gradient(to right,transparent,rgba(129,140,248,0.10),transparent)",
        }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "56px" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(129,140,248,0.70)",
              marginBottom: "14px",
            }}
          >
            AI Automation for Modern Businesses
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            style={{
              fontSize: "clamp(28px,4vw,48px)",
              fontWeight: 400,
              letterSpacing: "-0.025em",
              lineHeight: 1.18,
              color: "#f5f5f7",
              margin: "0 0 18px",
            }}
          >
            AI Systems Across Your Business
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.20 }}
            style={{
              fontSize: "clamp(14px,1.8vw,17px)",
              fontWeight: 300,
              lineHeight: 1.72,
              color: "rgba(200,205,230,0.72)",
              maxWidth: "580px",
              margin: "0 auto",
            }}
          >
            From marketing execution to lead management and internal operations, we design AI-powered systems that reduce manual work, improve speed, and create measurable business impact.
          </motion.p>
        </div>

        {/* ── Card grid ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}>
          {CARDS.map((card, i) => (
            <ImpactCard key={card.id} card={card} t={t} delay={0.18 + i * 0.10} />
          ))}
        </div>

        {/* ── Benefits row ── */}
        <BenefitsRow inView={inView} />

      </div>
    </section>
  );
}
