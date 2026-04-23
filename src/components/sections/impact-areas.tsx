"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── Domain data ────────────────────────────────────────────────── */
type DomainId = "marketing" | "sales" | "operations";

type Domain = {
  id: DomainId;
  title: string;
  short: string;
  description: string;
  capabilities: string[];
  results: string[];
  color: string;
  colorSolid: string;
};

const DOMAINS: Domain[] = [
  {
    id: "marketing",
    title: "Marketing & Content Systems",
    short: "Marketing",
    description:
      "Automate content creation, campaign workflows, publishing pipelines, and performance visibility across your marketing operation.",
    capabilities: ["Content generation", "Campaign execution", "Publishing workflows"],
    results: ["+35% content performance", "Faster campaign delivery"],
    color: "rgba(99,102,241,",
    colorSolid: "#6366f1",
  },
  {
    id: "sales",
    title: "Sales & Lead Systems",
    short: "Sales",
    description:
      "Capture, qualify, respond to, and manage leads with AI-powered systems that improve speed and reduce missed opportunities.",
    capabilities: ["Lead capture", "Qualification flows", "Automated follow-ups"],
    results: ["+41% lead response speed", "+2.4x qualified leads"],
    color: "rgba(139,92,246,",
    colorSolid: "#8b5cf6",
  },
  {
    id: "operations",
    title: "Operations & Workflow Systems",
    short: "Operations",
    description:
      "Streamline repetitive tasks, internal processes, reporting flows, and team coordination with intelligent operational automation.",
    capabilities: ["Workflow automation", "Reporting systems", "Task coordination"],
    results: ["−18h manual work / week", "78% tasks automated"],
    color: "rgba(79,70,229,",
    colorSolid: "#4f46e5",
  },
];

/* ─── Math helpers ───────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* ─── Mini visualizations ────────────────────────────────────────── */
function MarketingMini({ t, active }: { t: number; active: boolean }) {
  const s = active ? 1.5 : 1.0;
  const pts = [12, 10, 13, 8, 11, 6, 9, 4, 7, 2].map((y, i) => [
    i * 11,
    Math.max(0, y + 1.6 * Math.sin(t * 0.42 + i * 0.88) * s),
  ]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const nodes = [0, 1, 2, 3, 4];
  return (
    <div style={{ width: "100%", height: "64px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", position: "absolute", top: "6px", left: "2px", right: "2px" }}>
        {nodes.map((i) => {
          const op = (0.28 + 0.42 * Math.abs(Math.sin((t * 0.55 + i * 0.22) * Math.PI * 2))) * s;
          const glow = Math.sin(t * 0.7 + i * 0.5) > 0.3;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                background: `rgba(129,140,248,${Math.min(1, op).toFixed(2)})`,
                boxShadow: glow && active ? `0 0 7px rgba(99,102,241,0.45)` : "none",
                transition: "box-shadow 300ms ease",
              }} />
              {i < 4 && <div style={{ flex: 1, height: "1px", background: `rgba(129,140,248,${(op * 0.4).toFixed(2)})` }} />}
            </div>
          );
        })}
      </div>
      <svg width="100%" height="38" viewBox="0 0 99 14" fill="none" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "2px", left: "2px", width: "calc(100% - 4px)" }}>
        <defs>
          <linearGradient id="mf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(129,140,248,${active ? "0.22" : "0.12"})`} />
            <stop offset="100%" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <path d={`${d} L 99 14 L 0 14 Z`} fill="url(#mf)" />
        <path d={d} stroke={`rgba(129,140,248,${active ? "0.75" : "0.45"})`} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={`rgba(165,180,252,${active ? "0.95" : "0.70"})`} />
      </svg>
    </div>
  );
}

function SalesMini({ t, active }: { t: number; active: boolean }) {
  const s = active ? 1.4 : 1.0;
  const stages = ["Capture", "Qualify", "Respond", "Convert"];
  const widths = [0.88, 0.66, 0.48, 0.30];
  return (
    <div style={{ width: "100%", height: "64px", padding: "4px 2px 2px", display: "flex", flexDirection: "column", gap: "5px" }}>
      {stages.map((label, i) => {
        const w = widths[i] * (0.82 + 0.18 * Math.sin(t * 0.48 + i * 0.9)) * s;
        const pulse = 0.25 + 0.30 * Math.abs(Math.sin(t * 1.1 + i * 0.65));
        const glow = Math.sin(t * 0.85 + i * 0.4) > 0.2 && active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "7px", color: `rgba(160,168,220,${active ? "0.55" : "0.38"})`, width: "34px", flexShrink: 0, letterSpacing: "0.04em" }}>{label}</span>
            <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(129,140,248,0.07)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, w * 100)}%`, borderRadius: "2px", background: `linear-gradient(90deg,rgba(99,102,241,${active ? "0.65" : "0.40"}),rgba(165,180,252,${active ? "0.90" : "0.60"}))`, transition: "width 500ms ease" }} />
            </div>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0, background: `rgba(129,140,248,${pulse.toFixed(2)})`, boxShadow: glow ? "0 0 5px rgba(99,102,241,0.40)" : "none" }} />
          </div>
        );
      })}
    </div>
  );
}

function OpsMini({ t, active }: { t: number; active: boolean }) {
  const s = active ? 1.4 : 1.0;
  const tasks = [{ label: "Workflow", fill: 0.78 }, { label: "Reporting", fill: 0.62 }, { label: "Sync", fill: 0.90 }];
  const cp = ((t * 0.38) % 1 + 1) % 1;
  return (
    <div style={{ width: "100%", height: "64px", padding: "3px 2px 2px", display: "flex", flexDirection: "column", gap: "5px" }}>
      {tasks.map((task, i) => {
        const w = task.fill * (0.78 + 0.22 * Math.sin(t * 0.36 + i * 1.1));
        const op = (0.30 + 0.28 * Math.abs(Math.sin(t * 0.9 + i * 0.7))) * s;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "4px", height: "4px", borderRadius: "1px", flexShrink: 0, background: `rgba(129,140,248,${Math.min(1, op).toFixed(2)})` }} />
            <span style={{ fontSize: "7px", color: `rgba(160,168,220,${active ? "0.55" : "0.38"})`, width: "40px", flexShrink: 0, letterSpacing: "0.04em" }}>{task.label}</span>
            <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(129,140,248,0.07)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, w * 100)}%`, borderRadius: "1px", background: `rgba(129,140,248,${active ? "0.65" : "0.40"})`, transition: "width 500ms ease" }} />
            </div>
            <span style={{ fontSize: "6.5px", color: `rgba(129,140,248,${active ? "0.60" : "0.35"})`, letterSpacing: "0.06em", fontWeight: 600 }}>AUTO</span>
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: "3px", paddingLeft: "1px", marginTop: "1px" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const isActive = Math.abs(cp - i / 6) < 0.16;
          const op = isActive ? 0.80 * s : (0.15 + 0.10 * Math.sin(t * 0.6 + i * 0.9)) * s;
          return <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: `rgba(129,140,248,${Math.min(1, op).toFixed(2)})`, transition: "background 200ms ease" }} />;
        })}
        <div style={{ flex: 1, height: "1px", background: `rgba(129,140,248,${active ? "0.14" : "0.08"})` }} />
        <span style={{ fontSize: "6px", color: `rgba(129,140,248,${active ? "0.50" : "0.28"})`, letterSpacing: "0.06em" }}>SYNC</span>
      </div>
    </div>
  );
}

/* ─── AI Core ────────────────────────────────────────────────────── */
function AICore({ t, activeDomain }: { t: number; activeDomain: DomainId }) {
  const pulse1 = 0.5 + 0.5 * Math.sin(t * 0.8);
  const pulse2 = 0.5 + 0.5 * Math.sin(t * 0.55 + 1.2);
  const rot = (t * 12) % 360;

  return (
    <div style={{
      width: "140px", height: "140px",
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {/* Outer pulse rings */}
      {[1, 2].map((i) => {
        const p = i === 1 ? pulse1 : pulse2;
        const size = 140 + i * 20 + p * 12;
        return (
          <div key={i} aria-hidden="true" style={{
            position: "absolute",
            width: `${size}px`, height: `${size}px`,
            borderRadius: "50%",
            border: `1px solid rgba(129,140,248,${(0.06 + p * 0.06).toFixed(2)})`,
            left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }} />
        );
      })}

      {/* Rotating dashed ring */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: "-8px",
        borderRadius: "50%",
        border: "1px dashed rgba(129,140,248,0.14)",
        transform: `rotate(${rot}deg)`,
      }} />

      {/* Glass disc */}
      <div style={{
        width: "140px", height: "140px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 32%,rgba(99,102,241,0.18) 0%,rgba(8,8,22,0.88) 65%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(129,140,248,0.20)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 40px rgba(99,102,241,${(0.10 + pulse1 * 0.06).toFixed(2)})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "4px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Inner shimmer */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right,transparent,rgba(165,180,252,0.22),transparent)",
        }} />

        {/* Animated inner grid lines */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ position: "absolute", opacity: 0.18 }}>
          {[20, 40, 60].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="80" stroke="rgba(129,140,248,1)" strokeWidth="0.5" />)}
          {[20, 40, 60].map(y => <line key={`h${y}`} x1="0" y1={y} x2="80" y2={y} stroke="rgba(129,140,248,1)" strokeWidth="0.5" />)}
          <circle cx="40" cy="40" r="18" stroke="rgba(129,140,248,1)" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Center dot */}
        <div style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: `rgba(165,180,252,${(0.70 + pulse1 * 0.25).toFixed(2)})`,
          boxShadow: `0 0 ${8 + pulse1 * 8}px rgba(99,102,241,0.55)`,
        }} />

        <span style={{
          fontSize: "9px", fontWeight: 600, letterSpacing: "0.10em",
          color: "rgba(165,180,252,0.70)", textTransform: "uppercase",
          lineHeight: 1,
        }}>
          AI Core
        </span>
      </div>
    </div>
  );
}

/* ─── Connection line between core and domain ────────────────────── */
function ConnectionLine({ active, t, angle }: { active: boolean; t: number; angle: number }) {
  const progress = ((t * 0.6) % 1 + 1) % 1;
  const op = active ? 0.55 : 0.10;
  const dotOp = active ? 0.85 : 0;

  return (
    <div style={{
      position: "absolute",
      width: "80px", height: "1px",
      background: `rgba(129,140,248,${op})`,
      transformOrigin: "left center",
      transform: `rotate(${angle}deg)`,
      transition: "background 400ms ease",
      overflow: "visible",
    }}>
      {/* Moving signal dot */}
      {active && (
        <div style={{
          position: "absolute",
          width: "5px", height: "5px",
          borderRadius: "50%",
          background: `rgba(165,180,252,${dotOp})`,
          boxShadow: "0 0 6px rgba(99,102,241,0.60)",
          top: "-2px",
          left: `${progress * 100}%`,
          transform: "translateX(-50%)",
          transition: "opacity 300ms ease",
        }} />
      )}
    </div>
  );
}

/* ─── Domain node ────────────────────────────────────────────────── */
function DomainNode({
  domain,
  active,
  t,
  onActivate,
  style,
}: {
  domain: Domain;
  active: boolean;
  t: number;
  onActivate: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onMouseEnter={onActivate}
      onClick={onActivate}
      style={{
        position: "relative",
        borderRadius: "16px",
        background: active ? "rgba(12,12,30,0.90)" : "rgba(8,8,22,0.72)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: active
          ? `1px solid rgba(129,140,248,0.32)`
          : `1px solid rgba(129,140,248,0.10)`,
        boxShadow: active
          ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 16px 48px rgba(0,0,0,0.36), 0 0 24px rgba(99,102,241,0.14)`
          : `inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 24px rgba(0,0,0,0.22)`,
        transform: active ? "translateY(-3px) scale(1.015)" : "translateY(0) scale(1)",
        transition: "all 350ms cubic-bezier(0.22,1,0.36,1)",
        cursor: "pointer",
        overflow: "hidden",
        padding: "16px 16px 14px",
        width: "200px",
        ...style,
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: active
          ? "linear-gradient(to right,transparent,rgba(165,180,252,0.28),transparent)"
          : "linear-gradient(to right,transparent,rgba(165,180,252,0.08),transparent)",
        transition: "background 350ms ease",
        pointerEvents: "none",
      }} />

      {/* Mini viz */}
      <div style={{
        borderRadius: "10px",
        background: "rgba(129,140,248,0.04)",
        border: "1px solid rgba(129,140,248,0.07)",
        marginBottom: "12px",
        overflow: "hidden",
        padding: "8px 8px 4px",
      }}>
        {domain.id === "marketing"  && <MarketingMini t={t} active={active} />}
        {domain.id === "sales"      && <SalesMini     t={t} active={active} />}
        {domain.id === "operations" && <OpsMini       t={t} active={active} />}
      </div>

      {/* Title */}
      <p style={{
        fontSize: "12px",
        fontWeight: 600,
        color: active ? "rgba(235,238,255,0.96)" : "rgba(200,205,230,0.70)",
        letterSpacing: "-0.005em",
        lineHeight: 1.3,
        margin: 0,
        transition: "color 350ms ease",
      }}>
        {domain.short}
      </p>
      <p style={{
        fontSize: "10px",
        fontWeight: 400,
        color: active ? "rgba(160,168,220,0.60)" : "rgba(140,148,200,0.40)",
        margin: "2px 0 0",
        lineHeight: 1.4,
        transition: "color 350ms ease",
      }}>
        Systems
      </p>

      {/* Active indicator dot */}
      <div style={{
        position: "absolute", bottom: "10px", right: "12px",
        width: "5px", height: "5px", borderRadius: "50%",
        background: active ? "rgba(129,140,248,0.80)" : "rgba(129,140,248,0.20)",
        boxShadow: active ? "0 0 6px rgba(99,102,241,0.50)" : "none",
        transition: "all 350ms ease",
      }} />
    </div>
  );
}

/* ─── Contextual content panel ───────────────────────────────────── */
function ContentPanel({ domain }: { domain: Domain }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={domain.id}
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          borderRadius: "16px",
          background: "rgba(8,8,22,0.72)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(129,140,248,0.14)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.24)",
          padding: "24px 26px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top shimmer */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right,transparent,rgba(165,180,252,0.14),transparent)",
          pointerEvents: "none",
        }} />

        {/* Corner accent */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, right: 0, width: "100px", height: "100px",
          background: `radial-gradient(circle at 100% 0%,${domain.color}0.08) 0%,transparent 70%)`,
          pointerEvents: "none",
        }} />

        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(129,140,248,0.65)", margin: "0 0 8px" }}>
          Active System
        </p>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "rgba(235,238,255,0.96)", letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 10px" }}>
          {domain.title}
        </h3>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(180,186,220,0.68)", lineHeight: 1.65, margin: "0 0 18px" }}>
          {domain.description}
        </p>

        {/* Capabilities */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(129,140,248,0.50)", margin: "0 0 8px" }}>
            Capabilities
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {domain.capabilities.map((cap) => (
              <div key={cap} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(129,140,248,0.55)", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "rgba(180,186,220,0.65)", letterSpacing: "0.01em" }}>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ borderTop: "1px solid rgba(129,140,248,0.08)", paddingTop: "14px" }}>
          <p style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(129,140,248,0.50)", margin: "0 0 8px" }}>
            Results
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {domain.results.map((r) => (
              <div key={r} style={{
                padding: "5px 10px", borderRadius: "9999px",
                background: "rgba(129,140,248,0.08)",
                border: "1px solid rgba(129,140,248,0.14)",
              }}>
                <span style={{ fontSize: "11.5px", fontWeight: 500, color: "rgba(200,205,240,0.80)", letterSpacing: "0.01em" }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Desktop composition ────────────────────────────────────────── */
function DesktopComposition({ t, activeDomain, setActiveDomain }: {
  t: number;
  activeDomain: DomainId;
  setActiveDomain: (id: DomainId) => void;
}) {
  const active: Domain = DOMAINS.find(d => d.id === activeDomain) ?? DOMAINS[0];

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", justifyContent: "center" }}>

      {/* Left: orbital composition */}
      <div style={{ position: "relative", width: "520px", height: "420px", flexShrink: 0 }}>

        {/* Domain: Marketing — upper left */}
        <div style={{ position: "absolute", top: "20px", left: "0px" }}>
          <DomainNode
            domain={DOMAINS[0]}
            active={activeDomain === "marketing"}
            t={t}
            onActivate={() => setActiveDomain("marketing")}
          />
        </div>

        {/* Domain: Sales — upper right */}
        <div style={{ position: "absolute", top: "20px", right: "0px" }}>
          <DomainNode
            domain={DOMAINS[1]}
            active={activeDomain === "sales"}
            t={t}
            onActivate={() => setActiveDomain("sales")}
          />
        </div>

        {/* Domain: Operations — bottom center */}
        <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)" }}>
          <DomainNode
            domain={DOMAINS[2]}
            active={activeDomain === "operations"}
            t={t}
            onActivate={() => setActiveDomain("operations")}
          />
        </div>

        {/* AI Core — center */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
          <AICore t={t} activeDomain={activeDomain} />
        </div>

        {/* Connection lines (SVG overlay) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
          {/* Marketing → Core */}
          {(() => {
            const isActive = activeDomain === "marketing";
            const op = isActive ? 0.50 : 0.08;
            const progress = ((t * 0.55) % 1 + 1) % 1;
            // from center of marketing card (~100,120) to core center (~260,210)
            return (
              <g>
                <line x1="200" y1="120" x2="260" y2="210" stroke={`rgba(129,140,248,${op})`} strokeWidth="1" />
                {isActive && (
                  <circle
                    cx={lerp(200, 260, progress)}
                    cy={lerp(120, 210, progress)}
                    r="3" fill="rgba(165,180,252,0.85)"
                    style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.60))" }}
                  />
                )}
              </g>
            );
          })()}
          {/* Sales → Core */}
          {(() => {
            const isActive = activeDomain === "sales";
            const op = isActive ? 0.50 : 0.08;
            const progress = ((t * 0.55 + 0.5) % 1 + 1) % 1;
            // from center of sales card (~320,120) to core center (~260,210)
            return (
              <g>
                <line x1="320" y1="120" x2="260" y2="210" stroke={`rgba(129,140,248,${op})`} strokeWidth="1" />
                {isActive && (
                  <circle
                    cx={lerp(320, 260, progress)}
                    cy={lerp(120, 210, progress)}
                    r="3" fill="rgba(165,180,252,0.85)"
                    style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.60))" }}
                  />
                )}
              </g>
            );
          })()}
          {/* Operations → Core */}
          {(() => {
            const isActive = activeDomain === "operations";
            const op = isActive ? 0.50 : 0.08;
            const progress = ((t * 0.55 + 0.25) % 1 + 1) % 1;
            // from center of ops card (~260,340) to core center (~260,210)
            return (
              <g>
                <line x1="260" y1="340" x2="260" y2="280" stroke={`rgba(129,140,248,${op})`} strokeWidth="1" />
                {isActive && (
                  <circle
                    cx={lerp(260, 260, progress)}
                    cy={lerp(340, 280, progress)}
                    r="3" fill="rgba(165,180,252,0.85)"
                    style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.60))" }}
                  />
                )}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Right: contextual content panel */}
      <div style={{ flex: 1, maxWidth: "380px", paddingTop: "20px" }}>
        <ContentPanel domain={active} />
      </div>

    </div>
  );
}

/* ─── Mobile composition ─────────────────────────────────────────── */
function MobileComposition({ t, activeDomain, setActiveDomain }: {
  t: number;
  activeDomain: DomainId;
  setActiveDomain: (id: DomainId) => void;
}) {
  const active: Domain = DOMAINS.find(d => d.id === activeDomain) ?? DOMAINS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

      {/* AI Core */}
      <AICore t={t} activeDomain={activeDomain} />

      {/* Connector line */}
      <div style={{ width: "1px", height: "20px", background: "rgba(129,140,248,0.18)" }} />

      {/* Domain nodes stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "320px" }}>
        {DOMAINS.map((domain) => (
          <div
            key={domain.id}
            onClick={() => setActiveDomain(domain.id)}
            style={{
              borderRadius: "14px",
              background: activeDomain === domain.id ? "rgba(12,12,30,0.90)" : "rgba(8,8,22,0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: activeDomain === domain.id
                ? "1px solid rgba(129,140,248,0.28)"
                : "1px solid rgba(129,140,248,0.10)",
              boxShadow: activeDomain === domain.id
                ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 28px rgba(0,0,0,0.30), 0 0 18px rgba(99,102,241,0.10)"
                : "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.20)",
              padding: "14px 16px",
              cursor: "pointer",
              transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span aria-hidden="true" style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: activeDomain === domain.id
                ? "linear-gradient(to right,transparent,rgba(165,180,252,0.22),transparent)"
                : "linear-gradient(to right,transparent,rgba(165,180,252,0.06),transparent)",
              pointerEvents: "none",
            }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: "13px", fontWeight: 600,
                color: activeDomain === domain.id ? "rgba(235,238,255,0.96)" : "rgba(180,186,220,0.65)",
                transition: "color 300ms ease",
              }}>
                {domain.title}
              </span>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                background: activeDomain === domain.id ? "rgba(129,140,248,0.80)" : "rgba(129,140,248,0.20)",
                boxShadow: activeDomain === domain.id ? "0 0 6px rgba(99,102,241,0.50)" : "none",
                transition: "all 300ms ease",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Content panel */}
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <ContentPanel domain={active} />
      </div>
    </div>
  );
}

/* ─── Micro-benefits row ─────────────────────────────────────────── */
const BENEFITS = ["Less manual work", "Faster execution", "Better response times", "Clearer operational visibility"];

/* ─── Main section ───────────────────────────────────────────────── */
export function ImpactAreas() {
  const [t, setT] = useState(0);
  const [activeDomain, setActiveDomain] = useState<DomainId>("marketing");
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

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
      aria-label="How Our AI Systems Drive Business Impact"
      style={{ position: "relative", overflow: "hidden", padding: "100px 24px 80px" }}
    >
      {/* Atmospheric background */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)",
          width: "900px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%,rgba(88,92,241,0.030) 0%,rgba(88,92,241,0.004) 60%,transparent 80%)",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
          background: "linear-gradient(to right,transparent,rgba(129,140,248,0.10),transparent)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "56px" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.50, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(129,140,248,0.70)", marginBottom: "14px" }}
          >
            AI Automation for Modern Businesses
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            style={{ fontSize: "clamp(26px,4vw,46px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.18, color: "#f5f5f7", margin: "0 0 16px" }}
          >
            How Our AI Systems Drive Business Impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: 0.20 }}
            style={{ fontSize: "clamp(14px,1.8vw,16.5px)", fontWeight: 300, lineHeight: 1.72, color: "rgba(200,205,230,0.70)", maxWidth: "560px", margin: "0 auto" }}
          >
            Explore how our AI-powered systems improve marketing execution, lead management, and internal operations through intelligent automation built for modern businesses.
          </motion.p>
        </div>

        {/* Composition */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
        >
          {isMobile
            ? <MobileComposition t={t} activeDomain={activeDomain} setActiveDomain={setActiveDomain} />
            : <DesktopComposition t={t} activeDomain={activeDomain} setActiveDomain={setActiveDomain} />
          }
        </motion.div>

        {/* Benefits row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.60, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "48px" }}
        >
          {BENEFITS.map((b) => (
            <div key={b} style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "7px 14px", borderRadius: "9999px",
              background: "rgba(129,140,248,0.06)",
              border: "1px solid rgba(129,140,248,0.12)",
            }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(129,140,248,0.55)", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", fontWeight: 400, color: "rgba(180,186,220,0.68)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{b}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
