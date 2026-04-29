"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Step data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    id: "define",
    index: "01",
    title: "Understand & Define",
    description: "We map your workflows and define the right system.",
    visual: "define" as const,
  },
  {
    id: "design",
    index: "02",
    title: "System Design",
    description: "We structure flows, architecture, and user experience.",
    visual: "design" as const,
  },
  {
    id: "build",
    index: "03",
    title: "Build & Integrate",
    description: "We develop, connect tools, and bring everything together.",
    visual: "build" as const,
  },
  {
    id: "launch",
    index: "04",
    title: "Launch & Optimize",
    description: "We deploy, monitor, and refine based on real usage.",
    visual: "launch" as const,
  },
] as const;

type StepVisual = (typeof STEPS)[number]["visual"];

/* ─── Micro visuals ─────────────────────────────────────────────── */
function DefineVisual({ active, t }: { active: boolean; t: number }) {
  const nodes = [
    { cx: 20, cy: 28 },
    { cx: 50, cy: 14 },
    { cx: 80, cy: 28 },
    { cx: 50, cy: 42 },
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], [0, 2],
  ];
  return (
    <svg width="100" height="56" viewBox="0 0 100 56" fill="none" aria-hidden="true">
      {edges.map(([a, b], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.9 + i * 0.7);
        const op = active ? 0.18 + 0.14 * pulse : 0.10;
        return (
          <line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke={`rgba(129,140,248,${op.toFixed(2)})`}
            strokeWidth="0.8"
          />
        );
      })}
      {nodes.map((n, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.1 + i * 1.2);
        const r = active ? 3 + 0.8 * pulse : 2.5;
        const op = active ? 0.55 + 0.35 * pulse : 0.30;
        return (
          <circle
            key={i}
            cx={n.cx} cy={n.cy} r={r}
            fill={`rgba(129,140,248,${op.toFixed(2)})`}
          />
        );
      })}
    </svg>
  );
}

function DesignVisual({ active, t }: { active: boolean; t: number }) {
  const blocks = [
    { x: 8,  y: 8,  w: 36, h: 14 },
    { x: 8,  y: 26, w: 16, h: 22 },
    { x: 28, y: 26, w: 16, h: 10 },
    { x: 28, y: 40, w: 16, h: 8  },
    { x: 48, y: 8,  w: 44, h: 40 },
  ];
  return (
    <svg width="100" height="56" viewBox="0 0 100 56" fill="none" aria-hidden="true">
      {blocks.map((b, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 0.9);
        const fill = active ? `rgba(99,102,241,${(0.06 + 0.06 * pulse).toFixed(2)})` : "rgba(99,102,241,0.04)";
        const stroke = active ? `rgba(129,140,248,${(0.20 + 0.12 * pulse).toFixed(2)})` : "rgba(129,140,248,0.12)";
        return (
          <rect
            key={i}
            x={b.x} y={b.y} width={b.w} height={b.h}
            rx="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.7"
          />
        );
      })}
    </svg>
  );
}

function BuildVisual({ active, t }: { active: boolean; t: number }) {
  const modules = [
    { x: 6,  y: 10, w: 26, h: 14, label: "API" },
    { x: 6,  y: 32, w: 26, h: 14, label: "DB"  },
    { x: 68, y: 10, w: 26, h: 14, label: "UI"  },
    { x: 68, y: 32, w: 26, h: 14, label: "AI"  },
  ];
  const center = { x: 50, y: 28 };
  return (
    <svg width="100" height="56" viewBox="0 0 100 56" fill="none" aria-hidden="true">
      {/* Center hub */}
      <circle
        cx={center.x} cy={center.y} r={active ? 5 + 0.8 * Math.sin(t * 1.2) : 4}
        fill={`rgba(99,102,241,${active ? 0.30 : 0.15})`}
        stroke={`rgba(129,140,248,${active ? 0.55 : 0.25})`}
        strokeWidth="0.8"
      />
      {modules.map((m, i) => {
        const mx = m.x + m.w / 2;
        const my = m.y + m.h / 2;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.85 + i * 1.1);
        const lineOp = active ? 0.14 + 0.12 * pulse : 0.07;
        const fillOp = active ? 0.06 + 0.05 * pulse : 0.03;
        const strokeOp = active ? 0.22 + 0.12 * pulse : 0.10;
        return (
          <g key={i}>
            <line
              x1={mx} y1={my} x2={center.x} y2={center.y}
              stroke={`rgba(129,140,248,${lineOp.toFixed(2)})`}
              strokeWidth="0.7"
              strokeDasharray="2 2"
            />
            <rect
              x={m.x} y={m.y} width={m.w} height={m.h}
              rx="3"
              fill={`rgba(99,102,241,${fillOp.toFixed(2)})`}
              stroke={`rgba(129,140,248,${strokeOp.toFixed(2)})`}
              strokeWidth="0.7"
            />
            <text
              x={mx} y={my + 3.5}
              textAnchor="middle"
              fontSize="5.5"
              fill={`rgba(165,180,252,${active ? 0.65 : 0.35})`}
              fontFamily="monospace"
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LaunchVisual({ active, t }: { active: boolean; t: number }) {
  const bars = [0.45, 0.62, 0.55, 0.78, 0.68, 0.90, 0.82];
  return (
    <svg width="100" height="56" viewBox="0 0 100 56" fill="none" aria-hidden="true">
      {/* Panel background */}
      <rect x="4" y="4" width="92" height="48" rx="4"
        fill="rgba(99,102,241,0.04)"
        stroke="rgba(129,140,248,0.12)"
        strokeWidth="0.7"
      />
      {/* Status dot */}
      <circle
        cx="14" cy="14" r={active ? 3 + 0.5 * Math.abs(Math.sin(t * 1.8)) : 2.5}
        fill={`rgba(129,140,248,${active ? 0.80 : 0.35})`}
      />
      <text x="22" y="17.5" fontSize="5" fill="rgba(165,180,252,0.50)" fontFamily="monospace">
        LIVE
      </text>
      {/* Bars */}
      {bars.map((h, i) => {
        const pulse = active ? h * (0.80 + 0.20 * Math.abs(Math.sin(t * 0.9 + i * 0.6))) : h * 0.6;
        const barH = pulse * 24;
        const barY = 44 - barH;
        const op = active ? 0.35 + 0.35 * (h - 0.4) : 0.18;
        return (
          <rect
            key={i}
            x={10 + i * 12} y={barY}
            width="7" height={barH}
            rx="1.5"
            fill={`rgba(129,140,248,${op.toFixed(2)})`}
          />
        );
      })}
    </svg>
  );
}

function StepMicroVisual({ visual, active, t }: { visual: StepVisual; active: boolean; t: number }) {
  if (visual === "define")  return <DefineVisual  active={active} t={t} />;
  if (visual === "design")  return <DesignVisual  active={active} t={t} />;
  if (visual === "build")   return <BuildVisual   active={active} t={t} />;
  if (visual === "launch")  return <LaunchVisual  active={active} t={t} />;
  return null;
}

/* ─── Desktop node ──────────────────────────────────────────────── */
function DesktopNode({
  step, isActive, isDimmed, onHover, t,
}: {
  step: typeof STEPS[number];
  isActive: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  t: number;
}) {
  return (
    <div
      onMouseEnter={() => onHover(step.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
        cursor: "default",
        opacity: isDimmed ? 0.45 : 1,
        transition: "opacity 280ms ease",
      }}
    >
      {/* Node panel — above the line */}
      <div style={{
        width: "100%",
        borderRadius: "14px",
        padding: "18px 16px 14px",
        background: isActive
          ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: isActive
          ? "1px solid rgba(129,140,248,0.22)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: isActive
          ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(99,102,241,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 14px rgba(0,0,0,0.18)",
        transform: isActive ? "translateY(-5px)" : "translateY(0)",
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minHeight: "160px",
      }}>
        {/* Top shimmer */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: isActive
            ? "linear-gradient(to right, transparent, rgba(165,180,252,0.30), transparent)"
            : "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)",
          pointerEvents: "none",
          transition: "background 280ms ease",
        }} />

        {/* Index */}
        <span style={{
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: isActive ? "rgba(165,180,252,0.80)" : "rgba(129,140,248,0.40)",
          fontFamily: "monospace",
          transition: "color 280ms ease",
        }}>
          {step.index}
        </span>

        {/* Micro visual */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "56px",
        }}>
          <StepMicroVisual visual={step.visual} active={isActive} t={t} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
          color: isActive ? "#f5f5f7" : "rgba(245,245,247,0.75)",
          margin: 0,
          transition: "color 280ms ease",
        }}>
          {step.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: "11.5px",
          fontWeight: 400,
          lineHeight: 1.60,
          color: isActive ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.45)",
          margin: 0,
          transition: "color 280ms ease",
        }}>
          {step.description}
        </p>
      </div>

      {/* Connector dot on the line */}
      <div style={{
        width: "1px",
        height: "20px",
        background: isActive
          ? "rgba(129,140,248,0.40)"
          : "rgba(255,255,255,0.10)",
        transition: "background 280ms ease",
        flexShrink: 0,
      }} />
      <div style={{
        width: isActive ? "10px" : "7px",
        height: isActive ? "10px" : "7px",
        borderRadius: "50%",
        background: isActive
          ? "rgba(129,140,248,0.90)"
          : "rgba(255,255,255,0.20)",
        border: isActive
          ? "1px solid rgba(165,180,252,0.60)"
          : "1px solid rgba(255,255,255,0.12)",
        boxShadow: isActive
          ? "0 0 10px rgba(99,102,241,0.50)"
          : "none",
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        flexShrink: 0,
        zIndex: 2,
      }} />
    </div>
  );
}

/* ─── Mobile node ───────────────────────────────────────────────── */
function MobileNode({ step, t, index: nodeIndex, total }: {
  step: typeof STEPS[number];
  t: number;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: nodeIndex * 0.10 }}
      style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
    >
      {/* Left: vertical line + dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "4px" }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: "rgba(129,140,248,0.70)",
          border: "1px solid rgba(165,180,252,0.50)",
          boxShadow: "0 0 8px rgba(99,102,241,0.35)",
          flexShrink: 0,
        }} />
        {nodeIndex < total - 1 && (
          <div style={{
            width: "1px",
            flex: 1,
            minHeight: "40px",
            background: "linear-gradient(to bottom, rgba(129,140,248,0.25), rgba(129,140,248,0.06))",
            marginTop: "6px",
          }} />
        )}
      </div>

      {/* Right: content */}
      <div style={{
        flex: 1,
        borderRadius: "14px",
        padding: "18px 16px",
        background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 14px rgba(0,0,0,0.18)",
        position: "relative",
        overflow: "hidden",
        marginBottom: nodeIndex < total - 1 ? "0" : "0",
      }}>
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
          <div>
            <span style={{
              fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em",
              color: "rgba(165,180,252,0.60)", fontFamily: "monospace",
              display: "block", marginBottom: "6px",
            }}>
              {step.index}
            </span>
            <h3 style={{
              fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em",
              lineHeight: 1.25, color: "#f5f5f7", margin: 0,
            }}>
              {step.title}
            </h3>
          </div>
          <div style={{ flexShrink: 0, opacity: 0.80 }}>
            <StepMicroVisual visual={step.visual} active={true} t={t} />
          </div>
        </div>

        <p style={{
          fontSize: "13px", fontWeight: 400, lineHeight: 1.65,
          color: "rgba(255,255,255,0.75)", margin: 0,
        }}>
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export function HowItWorks() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [t, setT] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const lineInView = useInView(lineRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const loop = (ts: number) => {
      if (!start) start = ts;
      setT((ts - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isDimmed = (id: string) => activeId !== null && activeId !== id;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-label="How It Works"
      style={{ padding: "80px 20px 100px", position: "relative", overflow: "hidden" }}
    >
      {/* Background: subtle horizontal gradient shift */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(8,8,20,0.60) 50%, rgba(5,5,5,0) 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Faint technical grid */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "80px 80px",
        pointerEvents: "none", zIndex: 0,
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
      }} />

      {/* Subtle center radial light */}
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "700px", height: "350px",
        borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.045) 0%, transparent 65%)",
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
            maxWidth: "640px",
            margin: "0 auto 64px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
              Clear Process, Structured Execution
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
            From idea to a fully<br />operational system
          </h2>

          {/* Subtext */}
          <p style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.72,
            color: "rgba(255,255,255,0.75)",
            margin: "0 auto",
            maxWidth: "480px",
          }}>
            A structured approach that keeps your project organized, efficient, and aligned from start to launch.
          </p>
        </motion.div>

        {/* ── Desktop flow ── */}
        {!isMobile && (
          <div ref={lineRef} style={{ position: "relative" }}>
            {/* Nodes row */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
              {STEPS.map((step) => (
                <DesktopNode
                  key={step.id}
                  step={step}
                  isActive={activeId === step.id}
                  isDimmed={isDimmed(step.id)}
                  onHover={setActiveId}
                  t={t}
                />
              ))}
            </div>

            {/* Process line — sits below the dots */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={lineInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1.10, ease: [0.22, 1, 0.36, 1], delay: 0.30 }}
              style={{
                position: "absolute",
                bottom: "3px",
                left: "0",
                right: "0",
                height: "1px",
                background: "linear-gradient(to right, transparent 0%, rgba(129,140,248,0.25) 10%, rgba(129,140,248,0.25) 90%, transparent 100%)",
                transformOrigin: "left center",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
          </div>
        )}

        {/* ── Mobile flow ── */}
        {isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {STEPS.map((step, i) => (
              <MobileNode
                key={step.id}
                step={step}
                t={t}
                index={i}
                total={STEPS.length}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
