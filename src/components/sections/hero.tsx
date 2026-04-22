"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Config ─────────────────────────────────────────────────────── */
const PHRASES = ["marketing teams", "sales pipelines", "business operations"];
const PHRASE_DURATION = 2600;
const TRANSITION_MS = 480;

/* ─── Micro-panel definitions ────────────────────────────────────── */
const MICRO_PANELS = [
  { id: "mp1", x: "4%",  y: "38%", floatY: 5,  floatDur: 11.0, delay: 0,   parallaxFactor: 0.6, content: "trend",  label: "+24%",  sublabel: "lead quality",  breatheOffset: 0.0 },
  { id: "mp2", x: "78%", y: "30%", floatY: -6, floatDur: 13.5, delay: 2.2, parallaxFactor: 0.8, content: "pulse",  label: "Active", sublabel: "12 workflows", breatheOffset: 2.1 },
  { id: "mp3", x: "80%", y: "50%", floatY: 4,  floatDur: 9.8,  delay: 4.5, parallaxFactor: 0.5, content: "bar",    label: "Synced", sublabel: null,            breatheOffset: 4.3 },
  { id: "mp4", x: "3%",  y: "60%", floatY: -5, floatDur: 12.2, delay: 1.8, parallaxFactor: 0.7, content: "status", label: "Live",   sublabel: "3 tasks",       breatheOffset: 1.5 },
];

// Mobile: only show 2 panels, repositioned to avoid text overlap
const MICRO_PANELS_MOBILE = [
  { id: "mp2", x: "72%", y: "28%", floatY: -4, floatDur: 13.5, delay: 0,   parallaxFactor: 0, content: "pulse",  label: "Active", sublabel: "12 workflows", breatheOffset: 2.1 },
  { id: "mp4", x: "2%",  y: "55%", floatY: 3,  floatDur: 12.2, delay: 1.0, parallaxFactor: 0, content: "status", label: "Live",   sublabel: "3 tasks",       breatheOffset: 1.5 },
];

/* ─── Panel connections ──────────────────────────────────────────── */
const PANEL_CONNECTIONS = [
  { id: "pc1", x0: 81, y0: 352, x1: 747, y1: 283, cpx: 380, cpy: 200, dur: 9.0,  phase: 0.0,  breatheDur: 6.0, breathePhase: 0.0 },
  { id: "pc2", x0: 747, y0: 283, x1: 765, y1: 455, cpx: 820, cpy: 370, dur: 7.5,  phase: 0.35, breatheDur: 8.0, breathePhase: 0.4 },
  { id: "pc3", x0: 72,  y0: 498, x1: 81,  y1: 352, cpx: 20,  cpy: 420, dur: 8.5,  phase: 0.65, breatheDur: 7.0, breathePhase: 0.7 },
];

/* ─── Atmospheric flow paths ─────────────────────────────────────── */
const FLOW_PATHS = [
  { id: "fp1", d: "M 60 560 C 200 420, 500 280, 820 160",  dur: 8.0,  phase: 0.0,  opacity: 0.055 },
  { id: "fp2", d: "M 100 380 C 280 260, 550 420, 800 300", dur: 11.0, phase: 0.3,  opacity: 0.042 },
  { id: "fp3", d: "M 0 620 C 250 540, 600 520, 900 460",   dur: 14.0, phase: 0.6,  opacity: 0.035 },
  { id: "fp4", d: "M 80 200 C 300 160, 580 240, 860 360",  dur: 10.0, phase: 0.15, opacity: 0.035 },
  { id: "fp5", d: "M 550 500 C 650 440, 760 460, 880 520", dur: 7.0,  phase: 0.5,  opacity: 0.048 },
];

/* ─── Contour arcs ───────────────────────────────────────────────── */
const CONTOUR_ARCS = [
  { cx: 450, cy: 700, rx: 500, ry: 280, opacity: 0.016 },
  { cx: 450, cy: 720, rx: 680, ry: 380, opacity: 0.010 },
  { cx: 450, cy: 740, rx: 860, ry: 480, opacity: 0.006 },
];

/* ─── Bezier helpers ─────────────────────────────────────────────── */
function cubicBezierPoint(t: number, x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x1: number, y1: number) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*x0 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x1,
    y: mt*mt*mt*y0 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y1,
  };
}
function parseCubicPath(d: string) {
  const p = d.replace(/[MC,]/g, " ").trim().split(/\s+/).map(Number);
  return { x0: p[0], y0: p[1], cx1: p[2], cy1: p[3], cx2: p[4], cy2: p[5], x1: p[6], y1: p[7] };
}
// Ease in-out for signal acceleration
function easeInOut(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

/* ─── Micro Panel Renderers ──────────────────────────────────────── */
function TrendSparkline({ time }: { time: number }) {
  // Slightly fluctuating values
  const base = [18, 14, 16, 10, 12, 6, 8, 2];
  const pts = base.map((y, i) => [i * 8, Math.max(0, y + 1.5 * Math.sin(time * 0.4 + i * 0.9))]);
  const pathD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <svg width="58" height="22" viewBox="0 0 58 22" fill="none">
      <path d={pathD} stroke="rgba(129,140,248,0.60)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill="rgba(165,180,252,0.85)" />
    </svg>
  );
}

function PulseWaveform({ time }: { time: number }) {
  const base = [3, 7, 5, 10, 8, 12, 6, 9, 4, 11, 7, 5];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "18px" }}>
      {base.map((h, i) => {
        // More organic: use multiple sine waves with different frequencies
        const noise = Math.sin(time * 1.6 + i * 0.7) * 0.3 + Math.sin(time * 0.9 + i * 1.3) * 0.2;
        const animated = h * (0.55 + 0.45 * Math.abs(noise + 0.5));
        return (
          <div key={i} style={{
            width: "2px", height: `${Math.max(2, animated)}px`, borderRadius: "1px",
            background: `rgba(129,140,248,${0.28 + 0.28 * Math.abs(Math.sin(time * 1.1 + i * 0.5))})`,
          }} />
        );
      })}
    </div>
  );
}

function ProgressBar({ time }: { time: number }) {
  // Slowly oscillating fill with occasional micro-jump
  const fill = 0.68 + 0.14 * Math.sin(time * 0.35) + 0.04 * Math.sin(time * 2.1);
  return (
    <div style={{ width: "64px", height: "3px", borderRadius: "2px", background: "rgba(129,140,248,0.10)", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${fill * 100}%`, borderRadius: "2px",
        background: "linear-gradient(90deg, rgba(99,102,241,0.65), rgba(165,180,252,0.85))",
        transition: "width 300ms ease",
      }} />
    </div>
  );
}

function StatusDot({ time }: { time: number }) {
  // More natural pulse: not perfectly sinusoidal
  const pulse = 0.55 + 0.35 * Math.abs(Math.sin(time * 1.2)) * (0.8 + 0.2 * Math.sin(time * 3.7));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div style={{
        width: "5px", height: "5px", borderRadius: "50%",
        background: `rgba(129,140,248,${pulse.toFixed(2)})`,
        boxShadow: `0 0 ${3 + 4 * pulse}px rgba(99,102,241,0.35)`,
      }} />
    </div>
  );
}

/* ─── Operational Intelligence Canvas ───────────────────────────── */
function OperationalCanvas({
  mouseX, mouseY, isMobile,
}: { mouseX: number; mouseY: number; isMobile: boolean }) {
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

  // Parallax — disabled on mobile
  const ox = isMobile ? 0 : mouseX * 10;
  const oy = isMobile ? 0 : mouseY * 6;

  // "Focus moment" — cycles through panels every ~8s
  const focusCycle = 8.0;
  const focusIndex = Math.floor((time / focusCycle) % PANEL_CONNECTIONS.length);
  const focusProgress = ((time / focusCycle) % 1);
  // Smooth in/out: active for middle 60% of cycle
  const focusIntensity = Math.max(0, Math.sin(focusProgress * Math.PI));

  const panels = isMobile ? MICRO_PANELS_MOBILE : MICRO_PANELS;
  const connections = isMobile ? [PANEL_CONNECTIONS[0]] : PANEL_CONNECTIONS;
  const flowPaths = isMobile ? FLOW_PATHS.slice(0, 2) : FLOW_PATHS;

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* ── SVG: atmospheric base + connections + signals ── */}
      <svg viewBox="0 0 900 860" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <filter id="oc-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="oc-depth" cx="50%" cy="80%" r="55%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0.050)" />
            <stop offset="60%"  stopColor="rgba(99,102,241,0.010)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </radialGradient>
          <radialGradient id="oc-top" cx="50%" cy="0%" r="50%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0.035)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </radialGradient>
        </defs>

        {/* Depth gradients */}
        <rect x="0" y="0" width="900" height="860" fill="url(#oc-depth)" />
        <rect x="0" y="0" width="900" height="860" fill="url(#oc-top)" />

        {/* Contour arcs */}
        {CONTOUR_ARCS.map((arc, i) => (
          <ellipse key={`arc${i}`} cx={arc.cx} cy={arc.cy} rx={arc.rx} ry={arc.ry}
            fill="none" stroke={`rgba(129,140,248,${arc.opacity})`} strokeWidth="0.5" />
        ))}

        {/* Grid — reduced visibility */}
        {!isMobile && [180, 360, 540, 720].map((x) => (
          <line key={`gv${x}`} x1={x} y1="0" x2={x} y2="860" stroke="rgba(255,255,255,0.008)" strokeWidth="0.5" />
        ))}
        {!isMobile && [260, 430, 600, 760].map((y) => (
          <line key={`gh${y}`} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.008)" strokeWidth="0.5" />
        ))}

        {/* Atmospheric flow paths */}
        {flowPaths.map((fp) => {
          const breathe = fp.opacity * (0.65 + 0.35 * Math.sin(time * 0.5 + fp.phase * 10));
          return (
            <path key={fp.id} d={fp.d} fill="none"
              stroke={`rgba(129,140,248,${breathe.toFixed(3)})`}
              strokeWidth="0.5" strokeLinecap="round" />
          );
        })}

        {/* Atmospheric signal dots — reduced on mobile */}
        {!isMobile && flowPaths.map((fp) => {
          const parsed = parseCubicPath(fp.d);
          const t = ((time / fp.dur + fp.phase) % 1 + 1) % 1;
          const pt = cubicBezierPoint(t, parsed.x0, parsed.y0, parsed.cx1, parsed.cy1, parsed.cx2, parsed.cy2, parsed.x1, parsed.y1);
          const sigOp = 0.40 * Math.sin(t * Math.PI);
          const t2 = Math.max(0, t - 0.06);
          const pt2 = cubicBezierPoint(t2, parsed.x0, parsed.y0, parsed.cx1, parsed.cy1, parsed.cx2, parsed.cy2, parsed.x1, parsed.y1);
          return (
            <g key={`sig-${fp.id}`}>
              <circle cx={pt2.x} cy={pt2.y} r="1.0" fill={`rgba(165,180,252,${(sigOp*0.28).toFixed(2)})`} filter="url(#oc-glow)" />
              <circle cx={pt.x}  cy={pt.y}  r="1.6" fill={`rgba(165,180,252,${sigOp.toFixed(2)})`} filter="url(#oc-glow)" />
            </g>
          );
        })}

        {/* Panel connection lines */}
        {connections.map((pc, ci) => {
          const isFocused = ci === focusIndex;
          const breathe = 0.5 + 0.5 * Math.sin(time * (Math.PI * 2 / pc.breatheDur) + pc.breathePhase * Math.PI * 2);
          const focusBoost = isFocused ? focusIntensity * 0.12 : 0;
          const lineOp = (0.06 + 0.08 * breathe + focusBoost).toFixed(3);
          return (
            <path key={`pc-line-${pc.id}`}
              d={`M ${pc.x0} ${pc.y0} Q ${pc.cpx} ${pc.cpy} ${pc.x1} ${pc.y1}`}
              fill="none" stroke={`rgba(129,140,248,${lineOp})`}
              strokeWidth={isFocused ? "0.8" : "0.5"} strokeLinecap="round" />
          );
        })}

        {/* Panel connection signals — with easing + secondary trail */}
        {connections.map((pc, ci) => {
          const isFocused = ci === focusIndex;
          const breathe = 0.5 + 0.5 * Math.sin(time * (Math.PI * 2 / pc.breatheDur) + pc.breathePhase * Math.PI * 2);
          const focusBoost = isFocused ? focusIntensity * 0.3 : 0;

          // Primary signal with easing
          const tRaw = ((time / pc.dur + pc.phase) % 1 + 1) % 1;
          const t = easeInOut(tRaw);
          const mt = 1 - t;
          const sx = mt*mt*pc.x0 + 2*mt*t*pc.cpx + t*t*pc.x1;
          const sy = mt*mt*pc.y0 + 2*mt*t*pc.cpy + t*t*pc.y1;

          // Trail
          const t2Raw = Math.max(0, tRaw - 0.05);
          const t2 = easeInOut(t2Raw);
          const mt2 = 1 - t2;
          const sx2 = mt2*mt2*pc.x0 + 2*mt2*t2*pc.cpx + t2*t2*pc.x1;
          const sy2 = mt2*mt2*pc.y0 + 2*mt2*t2*pc.cpy + t2*t2*pc.y1;

          // Secondary faint signal (offset by 0.5 phase)
          const t3Raw = ((time / pc.dur + pc.phase + 0.5) % 1 + 1) % 1;
          const t3 = easeInOut(t3Raw);
          const mt3 = 1 - t3;
          const sx3 = mt3*mt3*pc.x0 + 2*mt3*t3*pc.cpx + t3*t3*pc.x1;
          const sy3 = mt3*mt3*pc.y0 + 2*mt3*t3*pc.cpy + t3*t3*pc.y1;

          const baseOp = 0.5 + 0.5 * breathe;
          const sigOp = ((0.45 + focusBoost) * Math.sin(tRaw * Math.PI) * baseOp).toFixed(2);
          const trailOp = (parseFloat(sigOp) * 0.30).toFixed(2);
          const secOp = (0.20 * Math.sin(t3Raw * Math.PI) * baseOp).toFixed(2);

          return (
            <g key={`pc-sig-${pc.id}`}>
              {/* Secondary faint signal */}
              <circle cx={sx3} cy={sy3} r="1.2" fill={`rgba(165,180,252,${secOp})`} filter="url(#oc-glow)" />
              {/* Trail */}
              <circle cx={sx2} cy={sy2} r="1.0" fill={`rgba(165,180,252,${trailOp})`} filter="url(#oc-glow)" />
              {/* Primary */}
              <circle cx={sx}  cy={sy}  r="1.8" fill={`rgba(165,180,252,${sigOp})`}  filter="url(#oc-glow)" />
            </g>
          );
        })}
      </svg>

      {/* ── Micro-panels (HTML) ── */}
      {panels.map((panel, pi) => {
        const px = ox * panel.parallaxFactor;
        const py = oy * panel.parallaxFactor;

        // Panel breathing — offset per panel
        const breathe = 0.5 + 0.5 * Math.sin(time * 0.55 + panel.breatheOffset);
        const panelOpacity = 0.82 + 0.12 * breathe;

        // Focus moment: is this panel the focused one?
        const isFocused = pi === focusIndex % panels.length;
        const focusGlow = isFocused ? focusIntensity * 0.18 : 0;

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
              transform: `translate(${px}px, ${py}px) scale(${isFocused ? 1 + focusIntensity * 0.015 : 1})`,
              transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
              padding: "8px 12px",
              borderRadius: "10px",
              background: `rgba(10,10,22,${0.52 + focusGlow * 0.3})`,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid rgba(129,140,248,${0.10 + focusGlow})`,
              boxShadow: isFocused
                ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.22), 0 0 20px rgba(99,102,241,${(focusGlow * 0.4).toFixed(2)})`
                : "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.20)",
              display: "flex",
              flexDirection: "column",
              minWidth: "90px",
              opacity: panelOpacity,
            }}>
              {panel.content === "trend"  && <TrendSparkline time={time} />}
              {panel.content === "pulse"  && <PulseWaveform time={time} />}
              {panel.content === "bar"    && <ProgressBar time={time} />}
              {panel.content === "status" && <StatusDot time={time} />}

              <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(200,210,255,0.80)", letterSpacing: "0.02em" }}>
                  {panel.label}
                </span>
                {panel.sublabel && (
                  <span style={{ fontSize: "9px", fontWeight: 400, color: "rgba(150,160,210,0.48)", letterSpacing: "0.03em" }}>
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
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % PHRASES.length), PHRASE_DURATION);
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isMobile) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isMobile]);

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
        marginTop: "-81px",
        paddingTop: "81px",
      }}
    >
      {/* Atmospheric top glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.0, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <div style={{
          position: "absolute", left: "50%", top: "-8%",
          transform: "translateX(-50%)",
          height: "480px", width: "680px", borderRadius: "9999px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.040) 0%, rgba(99,102,241,0.007) 65%, transparent 85%)",
        }} />
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.07 }} />
      </motion.div>

      {/* Canvas */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        overflow: "hidden", pointerEvents: "none",
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "1000px", height: "100%", flexShrink: 0 }}>
          <OperationalCanvas mouseX={mousePos.x} mouseY={mousePos.y} isMobile={isMobile} />
        </div>
      </div>

      {/* Readability vignette */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 55% at 50% 38%, rgba(5,5,5,0.40) 0%, rgba(5,5,5,0.14) 55%, transparent 80%)",
      }} />

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
          <span style={{ display: "block", position: "relative", height: "1.2em", overflow: "hidden", marginTop: "10px" }}>
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
            lineHeight: 1.70, color: "rgba(255,255,255,0.80)",
            width: "100%", maxWidth: "min(550px, 90%)",
            marginBottom: "40px", marginTop: "-10px",
          }}
        >
          From content execution to lead handling to internal workflows, we design AI-powered systems that help companies{" "}
          <strong style={{ fontWeight: 500, color: "rgb(255,255,255)" }}>
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
    <a href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        width: "clamp(190px, 75vw, 210px)",
        padding: "14px 20px", borderRadius: "16px",
        fontSize: "14px", fontWeight: 400, letterSpacing: "0.02em",
        textDecoration: "none", color: "rgba(255,255,255,0.92)",
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
        left: hovered ? "120%" : "-60%", transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        transition: "left 550ms cubic-bezier(0.22,1,0.36,1)", pointerEvents: "none",
      }} />
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.40), transparent)",
        pointerEvents: "none",
      }} />
      <span style={{ transform: hovered ? "translateX(2px)" : "translateX(0)", transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)", display: "inline-block" }}>
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
    <a href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
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
        left: hovered ? "110%" : "-50%", transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
        transition: "left 600ms cubic-bezier(0, 0, 0.2, 1)", pointerEvents: "none",
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
