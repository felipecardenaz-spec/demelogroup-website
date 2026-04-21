"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Config ─────────────────────────────────────────────────────── */
const PHRASES = ["marketing teams", "sales pipelines", "business operations"];
const PHRASE_DURATION = 2600;
const TRANSITION_MS = 480;

/* ─── Micro-panel definitions ────────────────────────────────────── */
// Small glass fragments positioned in the mid-lower hero area
// y% is relative to the hero section height (860px SVG viewBox)
// Panels sit in the lower half of the hero, flanking the CTAs
const MICRO_PANELS = [
  {
    id: "mp1",
    // Left side, mid-lower — ~530px / 860px ≈ 38% from top of hero
    x: "4%", y: "38%",
    floatY: 5, floatDur: 11.0, delay: 0,
    parallaxFactor: 0.6,
    content: "trend",
    label: "+24%",
    sublabel: "lead quality",
  },
  {
    id: "mp2",
    // Right side, slightly higher — ~420px / 860px ≈ 30%
    x: "78%", y: "30%",
    floatY: -6, floatDur: 13.5, delay: 2.2,
    parallaxFactor: 0.8,
    content: "pulse",
    label: "Active",
    sublabel: "12 workflows",
  },
  {
    id: "mp3",
    // Right side, lower — ~560px / 860px ≈ 50%
    x: "80%", y: "50%",
    floatY: 4, floatDur: 9.8, delay: 4.5,
    parallaxFactor: 0.5,
    content: "bar",
    label: "Synced",
    sublabel: null,
  },
  {
    id: "mp4",
    // Left side, lower — ~580px / 860px ≈ 55%
    x: "3%", y: "60%",
    floatY: -5, floatDur: 12.2, delay: 1.8,
    parallaxFactor: 0.7,
    content: "status",
    label: "Live",
    sublabel: "3 tasks",
  },
];

/* ─── Panel anchor points (SVG coords, 900×860 viewBox) ─────────── */
// These correspond to the center of each micro-panel's position.
// Panel x/y are percentages of the container; we convert to SVG coords:
// mp1: x=4%  → 4%*900=36,   y=38% → 38%*860=327
// mp2: x=78% → 78%*900=702, y=30% → 30%*860=258
// mp3: x=80% → 80%*900=720, y=50% → 50%*860=430
// mp4: x=3%  → 3%*900=27,   y=55% → 55%*860=473
// (offset by ~45px to hit panel center, not top-left corner)
const PANEL_ANCHORS = {
  mp1: { x: 81,  y: 352 },  // left-mid
  mp2: { x: 747, y: 283 },  // right-upper
  mp3: { x: 765, y: 455 },  // right-lower
  mp4: { x: 72,  y: 498 },  // left-lower
};

// 3 intentional flow connections between panels (not all-to-all)
// mp1 → mp2 (left-mid to right-upper): diagonal sweep
// mp2 → mp3 (right-upper to right-lower): short right-side drop
// mp4 → mp1 (left-lower to left-mid): short left-side rise
// Each has a breathing cycle offset so they don't all pulse together
const PANEL_CONNECTIONS = [
  {
    id: "pc1",
    x0: 81, y0: 352, x1: 747, y1: 283,
    cpx: 380, cpy: 200,   // control point arcs upward through center
    dur: 9.0, phase: 0.0, breatheDur: 6.0, breathePhase: 0.0,
  },
  {
    id: "pc2",
    x0: 747, y0: 283, x1: 765, y1: 455,
    cpx: 820, cpy: 370,   // control point bows right
    dur: 7.5, phase: 0.35, breatheDur: 8.0, breathePhase: 0.4,
  },
  {
    id: "pc3",
    x0: 72, y0: 498, x1: 81, y1: 352,
    cpx: 20, cpy: 420,    // control point bows left
    dur: 8.5, phase: 0.65, breatheDur: 7.0, breathePhase: 0.7,
  },
];

/* ─── Flow path definitions ──────────────────────────────────────── */
// Atmospheric background paths — shifted upward to sit within hero
const FLOW_PATHS = [
  { id: "fp1", d: "M 60 560 C 200 420, 500 280, 820 160", dur: 8.0, phase: 0.0,   opacity: 0.08 },
  { id: "fp2", d: "M 100 380 C 280 260, 550 420, 800 300", dur: 11.0, phase: 0.3,  opacity: 0.06 },
  { id: "fp3", d: "M 0 620 C 250 540, 600 520, 900 460",  dur: 14.0, phase: 0.6,  opacity: 0.05 },
  { id: "fp4", d: "M 80 200 C 300 160, 580 240, 860 360", dur: 10.0, phase: 0.15, opacity: 0.05 },
  { id: "fp5", d: "M 550 500 C 650 440, 760 460, 880 520", dur: 7.0,  phase: 0.5,  opacity: 0.07 },
];

/* ─── Contour arc definitions (atmospheric base) ─────────────────── */
const CONTOUR_ARCS = [
  { cx: 450, cy: 700, rx: 500, ry: 280, opacity: 0.022 },
  { cx: 450, cy: 720, rx: 680, ry: 380, opacity: 0.014 },
  { cx: 450, cy: 740, rx: 860, ry: 480, opacity: 0.009 },
];

/* ─── Bezier point at t ──────────────────────────────────────────── */
// Evaluate a cubic bezier path at parameter t (0–1)
// We use a simple linear interpolation along the path length approximation
// For signal dots we just use the SVG animateMotion approach via JS
function cubicBezierPoint(
  t: number,
  x0: number, y0: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x1: number, y1: number
) {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * x0 + 3 * mt * mt * t * cx1 + 3 * mt * t * t * cx2 + t * t * t * x1,
    y: mt * mt * mt * y0 + 3 * mt * mt * t * cy1 + 3 * mt * t * t * cy2 + t * t * t * y1,
  };
}

// Parse a simple "M x0 y0 C cx1 cy1, cx2 cy2, x1 y1" path
function parseCubicPath(d: string) {
  const parts = d.replace(/[MC,]/g, " ").trim().split(/\s+/).map(Number);
  return { x0: parts[0], y0: parts[1], cx1: parts[2], cy1: parts[3], cx2: parts[4], cy2: parts[5], x1: parts[6], y1: parts[7] };
}

/* ─── Micro Panel Renderers ──────────────────────────────────────── */
function TrendSparkline({ progress }: { progress: number }) {
  // Simple upward trend line
  const pts = [
    [0, 18], [8, 14], [16, 16], [24, 10], [32, 12], [40, 6], [48, 8], [56, 2],
  ];
  const pathD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <svg width="58" height="22" viewBox="0 0 58 22" fill="none">
      <path d={pathD} stroke="rgba(129,140,248,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={56} cy={2} r="2" fill="rgba(165,180,252,0.80)" />
    </svg>
  );
}

function PulseWaveform({ time }: { time: number }) {
  const bars = [3, 7, 5, 10, 8, 12, 6, 9, 4, 11, 7, 5];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "18px" }}>
      {bars.map((h, i) => {
        const animated = h * (0.6 + 0.4 * Math.abs(Math.sin(time * 1.8 + i * 0.5)));
        return (
          <div
            key={i}
            style={{
              width: "2px",
              height: `${animated}px`,
              borderRadius: "1px",
              background: `rgba(129,140,248,${0.30 + 0.25 * Math.abs(Math.sin(time * 1.2 + i * 0.4))})`,
              transition: "height 80ms ease",
            }}
          />
        );
      })}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const fill = 0.72 + 0.12 * Math.sin(progress * Math.PI * 2);
  return (
    <div style={{ width: "64px", height: "3px", borderRadius: "2px", background: "rgba(129,140,248,0.12)", overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${fill * 100}%`,
        borderRadius: "2px",
        background: "linear-gradient(90deg, rgba(99,102,241,0.60), rgba(165,180,252,0.80))",
        transition: "width 200ms ease",
      }} />
    </div>
  );
}

function StatusDot({ time }: { time: number }) {
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(time * 1.5));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div style={{
        width: "5px", height: "5px", borderRadius: "50%",
        background: `rgba(129,140,248,${pulse})`,
        boxShadow: `0 0 ${4 + 3 * pulse}px rgba(99,102,241,0.40)`,
      }} />
    </div>
  );
}

/* ─── Operational Intelligence Canvas ───────────────────────────── */
function OperationalCanvas({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const loop = (ts: number) => {
      if (!start) start = ts;
      setTime((ts - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Parallax offsets — very subtle
  const ox = mouseX * 10;
  const oy = mouseY * 6;

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      {/* ── SVG Layer: atmospheric base + flow paths + signal dots ── */}
      <svg
        viewBox="0 0 900 860"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          {/* Soft glow for signal dots */}
          <filter id="oc-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Ambient depth gradient — lower half emphasis */}
          <radialGradient id="oc-depth" cx="50%" cy="80%" r="55%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0.055)" />
            <stop offset="60%"  stopColor="rgba(99,102,241,0.012)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </radialGradient>

          {/* Top-center very faint glow to frame headline */}
          <radialGradient id="oc-top" cx="50%" cy="0%" r="50%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0.04)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </radialGradient>

          {/* Flow path gradient — for stroke coloring */}
          <linearGradient id="oc-flow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0)" />
            <stop offset="30%"  stopColor="rgba(129,140,248,0.18)" />
            <stop offset="70%"  stopColor="rgba(129,140,248,0.14)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
          <linearGradient id="oc-flow2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0)" />
            <stop offset="40%"  stopColor="rgba(129,140,248,0.12)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
        </defs>

        {/* ── Layer 1: Atmospheric base ── */}

        {/* Depth gradient — lower hero */}
        <rect x="0" y="0" width="900" height="860" fill="url(#oc-depth)" />
        {/* Top frame glow */}
        <rect x="0" y="0" width="900" height="860" fill="url(#oc-top)" />

        {/* Architectural contour arcs — barely visible */}
        {CONTOUR_ARCS.map((arc, i) => (
          <ellipse
            key={`arc${i}`}
            cx={arc.cx} cy={arc.cy}
            rx={arc.rx} ry={arc.ry}
            fill="none"
            stroke={`rgba(129,140,248,${arc.opacity})`}
            strokeWidth="0.6"
          />
        ))}

        {/* Very faint grid — structural texture */}
        {[180, 360, 540, 720].map((x) => (
          <line key={`gv${x}`} x1={x} y1="0" x2={x} y2="860"
            stroke="rgba(255,255,255,0.012)" strokeWidth="0.5" />
        ))}
        {[260, 430, 600, 760].map((y) => (
          <line key={`gh${y}`} x1="0" y1={y} x2="900" y2={y}
            stroke="rgba(255,255,255,0.012)" strokeWidth="0.5" />
        ))}

        {/* ── Layer 2a: Panel connection paths (behind panels) ── */}
        {PANEL_CONNECTIONS.map((pc) => {
          // Breathing: each connection fades in/out independently
          const breathe = 0.5 + 0.5 * Math.sin(time * (Math.PI * 2 / pc.breatheDur) + pc.breathePhase * Math.PI * 2);
          const lineOp = (0.08 + 0.10 * breathe).toFixed(3);
          return (
            <path
              key={`pc-line-${pc.id}`}
              d={`M ${pc.x0} ${pc.y0} Q ${pc.cpx} ${pc.cpy} ${pc.x1} ${pc.y1}`}
              fill="none"
              stroke={`rgba(129,140,248,${lineOp})`}
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── Layer 2b: Signal particles along panel connections ── */}
        {PANEL_CONNECTIONS.map((pc) => {
          const t = ((time / pc.dur + pc.phase) % 1 + 1) % 1;
          // Quadratic bezier position
          const mt = 1 - t;
          const sx = mt * mt * pc.x0 + 2 * mt * t * pc.cpx + t * t * pc.x1;
          const sy = mt * mt * pc.y0 + 2 * mt * t * pc.cpy + t * t * pc.y1;
          // Trailing particle
          const t2 = Math.max(0, t - 0.05);
          const mt2 = 1 - t2;
          const sx2 = mt2 * mt2 * pc.x0 + 2 * mt2 * t2 * pc.cpx + t2 * t2 * pc.x1;
          const sy2 = mt2 * mt2 * pc.y0 + 2 * mt2 * t2 * pc.cpy + t2 * t2 * pc.y1;
          // Breathing visibility of the connection
          const breathe = 0.5 + 0.5 * Math.sin(time * (Math.PI * 2 / pc.breatheDur) + pc.breathePhase * Math.PI * 2);
          const sigOp = (0.55 * Math.sin(t * Math.PI) * (0.5 + 0.5 * breathe)).toFixed(2);
          const trailOp = (parseFloat(sigOp) * 0.35).toFixed(2);

          return (
            <g key={`pc-sig-${pc.id}`}>
              <circle cx={sx2} cy={sy2} r="1.2"
                fill={`rgba(165,180,252,${trailOp})`}
                filter="url(#oc-glow)"
              />
              <circle cx={sx} cy={sy} r="1.8"
                fill={`rgba(165,180,252,${sigOp})`}
                filter="url(#oc-glow)"
              />
            </g>
          );
        })}

        {/* ── Layer 2c: Atmospheric background flow paths ── */}
        {FLOW_PATHS.map((fp) => {
          const breathe = fp.opacity * (0.7 + 0.3 * Math.sin(time * 0.6 + fp.phase * 10));
          return (
            <path
              key={fp.id}
              d={fp.d}
              fill="none"
              stroke={`rgba(129,140,248,${breathe.toFixed(3)})`}
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── Layer 2d: Signal dots along atmospheric paths ── */}
        {FLOW_PATHS.map((fp) => {
          const parsed = parseCubicPath(fp.d);
          const t = ((time / fp.dur + fp.phase) % 1 + 1) % 1;
          const pt = cubicBezierPoint(t, parsed.x0, parsed.y0, parsed.cx1, parsed.cy1, parsed.cx2, parsed.cy2, parsed.x1, parsed.y1);
          const sigOp = 0.50 * Math.sin(t * Math.PI);
          const t2 = Math.max(0, t - 0.06);
          const pt2 = cubicBezierPoint(t2, parsed.x0, parsed.y0, parsed.cx1, parsed.cy1, parsed.cx2, parsed.cy2, parsed.x1, parsed.y1);
          const trailOp = sigOp * 0.30;

          return (
            <g key={`sig-${fp.id}`}>
              <circle cx={pt2.x} cy={pt2.y} r="1.2"
                fill={`rgba(165,180,252,${trailOp.toFixed(2)})`}
                filter="url(#oc-glow)"
              />
              <circle cx={pt.x} cy={pt.y} r="1.8"
                fill={`rgba(165,180,252,${sigOp.toFixed(2)})`}
                filter="url(#oc-glow)"
              />
            </g>
          );
        })}
      </svg>

      {/* ── Layer 3: Micro-result surface panels (HTML) ── */}
      {MICRO_PANELS.map((panel) => {
        // Parallax: each panel shifts slightly differently
        const px = ox * panel.parallaxFactor;
        const py = oy * panel.parallaxFactor;

        return (
          <motion.div
            key={panel.id}
            style={{
              position: "absolute",
              left: panel.x,
              top: panel.y,
              zIndex: 1,
              willChange: "transform",
              pointerEvents: "none",
            }}
            animate={{ y: [0, panel.floatY, 0] }}
            transition={{
              duration: panel.floatDur,
              delay: panel.delay,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          >
            <div style={{
              transform: `translate(${px}px, ${py}px)`,
              transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
              padding: "8px 12px",
              borderRadius: "10px",
              background: "rgba(10,10,22,0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(129,140,248,0.10)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.20)",
              display: "flex",
              flexDirection: "column",
              minWidth: "90px",
            }}>
              {/* Visual element */}
              {panel.content === "trend" && <TrendSparkline progress={time / 8} />}
              {panel.content === "pulse" && <PulseWaveform time={time} />}
              {panel.content === "bar" && <ProgressBar progress={time / 10} />}
              {panel.content === "status" && <StatusDot time={time} />}

              {/* Label row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 600,
                  color: "rgba(200,210,255,0.75)",
                  letterSpacing: "0.02em",
                }}>
                  {panel.label}
                </span>
                {panel.sublabel && (
                  <span style={{
                    fontSize: "9px", fontWeight: 400,
                    color: "rgba(150,160,210,0.45)",
                    letterSpacing: "0.03em",
                  }}>
                    {panel.sublabel}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────── */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, PHRASE_DURATION);
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize to -1..1 relative to section center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        /* Pull section up to cover the navbar offset so background
           starts at the very top of the screen on all devices */
        marginTop: "-81px",
        paddingTop: "81px",
      }}
    >
      {/* Very subtle top atmospheric glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.0, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <div style={{
          position: "absolute",
          left: "50%", top: "-8%",
          transform: "translateX(-50%)",
          height: "480px", width: "680px",
          borderRadius: "9999px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.045) 0%, rgba(99,102,241,0.008) 65%, transparent 85%)",
        }} />
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.10 }} />
      </motion.div>

      {/* Operational Intelligence Canvas — fills section, content constrained to 1280px */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "1000px",
          height: "100%",
          flexShrink: 0,
        }}>
          <OperationalCanvas mouseX={mousePos.x} mouseY={mousePos.y} />
        </div>
      </div>

      {/* Subtle dark vignette behind text for readability */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 55% at 50% 38%, rgba(5,5,5,0.38) 0%, rgba(5,5,5,0.12) 55%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: "1280px", width: "100%",
        margin: "0 auto", padding: "80px 24px 120px",
        textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center",
        pointerEvents: "none",
      }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.80, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 400, lineHeight: 1.2,
            letterSpacing: "-0.025em", color: "#f5f5f7",
            margin: "0 0 20px",
            width: "100%", maxWidth: "min(680px, 90%)",
          }}
        >
          <span style={{ display: "block" }}>We build AI systems for</span>

          <span style={{
            display: "block", position: "relative",
            height: "1.2em", overflow: "hidden", marginTop: "10px",
          }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={index}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundImage: "linear-gradient(90deg, #818cf8 0%, #a78bfa 50%, #818cf8 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text", backgroundClip: "text",
                  WebkitTextFillColor: "transparent", color: "transparent",
                }}
                initial={{ y: "108%", opacity: 0, filter: "blur(6px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-108%", opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
              >
                {PHRASES[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
          style={{
            fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 300,
            lineHeight: 1.70, color: "rgba(255, 255, 255, 0.8)",
            width: "100%", maxWidth: "min(550px, 90%)", marginBottom: "40px", marginTop: "-10px",
          }}
        >
          From content execution to lead handling to internal workflows, we design AI-powered systems that help companies{" "}
          <strong style={{ fontWeight: 500, color: "rgb(255, 255, 255)" }}>
            scale with less manual work.
          </strong>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "30px", flexWrap: "wrap",
            pointerEvents: "auto",
          }}
        >
          <HeroPrimaryButton href="#contact" label="Book a Free Call" />
          <HeroSecondaryButton href="#how-it-works" label="See How It Works" />
        </motion.div>

      </div>
    </section>
  );
}

/* ─── Primary Button ─────────────────────────────────────────────── */
function HeroPrimaryButton({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center",
        justifyContent: "center", gap: "8px",
        width: "clamp(190px, 75vw, 210px)",
        padding: "14px 20px", borderRadius: "16px",
        fontSize: "14px", fontWeight: 400,
        letterSpacing: "0.02em", textDecoration: "none",
        color: "rgba(255,255,255,0.92)",
        background: hovered
          ? "linear-gradient(170deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)"
          : "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.28), inset 0 -1px 0 0 rgba(0,0,0,0.30), 0 8px 24px -4px rgba(79,70,229,0.55)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.14), inset 0 -1px 0 0 rgba(0,0,0,0.30)",
        border: hovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden", whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, width: "60%",
        left: hovered ? "120%" : "-60%",
        transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        transition: "left 550ms cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }} />
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.40), transparent)",
        pointerEvents: "none",
      }} />
      <span style={{
        transform: hovered ? "translateX(2px)" : "translateX(0)",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
        display: "inline-block",
      }}>
        {label}
      </span>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"
        style={{ transform: hovered ? "translateX(2px)" : "translateX(0)", transition: "transform 200ms", flexShrink: 0 }}>
        <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* ─── Secondary Button ───────────────────────────────────────────── */
function HeroSecondaryButton({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.98 : hovered ? 1.015 : 1;

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center",
        justifyContent: "center",
        width: "clamp(190px, 75vw, 210px)",
        padding: "14px 20px", borderRadius: "16px",
        fontSize: "14px", fontWeight: 400,
        textDecoration: "none", overflow: "hidden", whiteSpace: "nowrap",
        color: hovered ? "#f5f5f7" : "#d4d4d8",
        background: hovered ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
        border: hovered ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.14)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.20)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.06)",
        transform: `scale(${scale})`,
        transition: pressed ? "transform 100ms ease" : "all 240ms cubic-bezier(0, 0, 0.2, 1)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, width: "50%",
        left: hovered ? "110%" : "-50%",
        transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
        transition: "left 600ms cubic-bezier(0, 0, 0.2, 1)",
        pointerEvents: "none",
      }} />
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
        pointerEvents: "none",
      }} />
      {label}
    </a>
  );
}
