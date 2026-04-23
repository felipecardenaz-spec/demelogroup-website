"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from "framer-motion";

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
  },
  {
    id: "sales",
    title: "Sales & Lead Systems",
    short: "Sales",
    description:
      "Capture, qualify, respond to, and manage leads with AI-powered systems that improve speed and reduce missed opportunities.",
    capabilities: ["Lead capture", "Qualification flows", "Automated follow-ups"],
    results: ["+41% lead response speed", "+2.4x qualified leads"],
    color: "rgba(129,120,248,",
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
  },
];

/* ─── Lerp helper ────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* ─── Mini visualizations (refined, less busy) ───────────────────── */
function MarketingMini({ t, active }: { t: number; active: boolean }) {
  const s = active ? 1.2 : 0.8;
  const pts = [11, 9, 12, 7, 10, 5, 8, 3, 6, 1].map((y, i) => [
    i * 11,
    Math.max(0, y + 1.2 * Math.sin(t * 0.35 + i * 0.80) * s),
  ]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const nodes = [0, 1, 2, 3, 4];
  const baseOp = active ? 0.55 : 0.28;
  return (
    <div style={{ width: "100%", height: "58px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", position: "absolute", top: "5px", left: "2px", right: "2px" }}>
        {nodes.map((i) => {
          const op = baseOp * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.45 + i * 0.30)));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                background: `rgba(129,140,248,${op.toFixed(2)})`,
              }} />
              {i < 4 && <div style={{ flex: 1, height: "1px", background: `rgba(129,140,248,${(op * 0.35).toFixed(2)})` }} />}
            </div>
          );
        })}
      </div>
      <svg width="100%" height="34" viewBox="0 0 99 13" fill="none" preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "2px", left: "2px", width: "calc(100% - 4px)" }}>
        <defs>
          <linearGradient id="mf2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(129,140,248,${active ? "0.14" : "0.07"})`} />
            <stop offset="100%" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <path d={`${d} L 99 13 L 0 13 Z`} fill="url(#mf2)" />
        <path d={d} stroke={`rgba(129,140,248,${active ? "0.55" : "0.28"})`} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.5" fill={`rgba(165,180,252,${active ? "0.80" : "0.45"})`} />
      </svg>
    </div>
  );
}

function SalesMini({ t, active }: { t: number; active: boolean }) {
  const s = active ? 1.1 : 0.8;
  const stages = ["Capture", "Qualify", "Respond", "Convert"];
  const widths = [0.85, 0.64, 0.46, 0.28];
  return (
    <div style={{ width: "100%", height: "58px", padding: "3px 2px 2px", display: "flex", flexDirection: "column", gap: "4px" }}>
      {stages.map((label, i) => {
        const w = widths[i] * (0.88 + 0.12 * Math.sin(t * 0.38 + i * 0.8)) * s;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "6.5px", color: `rgba(160,168,220,${active ? "0.45" : "0.28"})`, width: "32px", flexShrink: 0, letterSpacing: "0.03em" }}>{label}</span>
            <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(129,140,248,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, w * 100)}%`, borderRadius: "1px", background: `rgba(129,140,248,${active ? "0.50" : "0.28"})`, transition: "width 600ms ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OpsMini({ t, active }: { t: number; active: boolean }) {
  const s = active ? 1.1 : 0.8;
  const tasks = [{ label: "Workflow", fill: 0.78 }, { label: "Reporting", fill: 0.62 }, { label: "Sync", fill: 0.90 }];
  const cp = ((t * 0.30) % 1 + 1) % 1;
  return (
    <div style={{ width: "100%", height: "58px", padding: "2px 2px 2px", display: "flex", flexDirection: "column", gap: "4px" }}>
      {tasks.map((task, i) => {
        const w = task.fill * (0.85 + 0.15 * Math.sin(t * 0.28 + i * 1.0));
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "3px", height: "3px", borderRadius: "1px", flexShrink: 0, background: `rgba(129,140,248,${active ? "0.45" : "0.22"})` }} />
            <span style={{ fontSize: "6.5px", color: `rgba(160,168,220,${active ? "0.45" : "0.28"})`, width: "38px", flexShrink: 0, letterSpacing: "0.03em" }}>{task.label}</span>
            <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(129,140,248,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, w * 100)}%`, borderRadius: "1px", background: `rgba(129,140,248,${active ? "0.50" : "0.28"})`, transition: "width 600ms ease" }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: "3px", paddingLeft: "1px", marginTop: "2px" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const isActive = Math.abs(cp - i / 5) < 0.18;
          const op = isActive ? (active ? 0.60 : 0.30) : (active ? 0.18 : 0.10);
          return <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: `rgba(129,140,248,${op})`, transition: "background 300ms ease" }} />;
        })}
        <div style={{ flex: 1, height: "1px", background: `rgba(129,140,248,${active ? "0.10" : "0.05"})` }} />
        <span style={{ fontSize: "5.5px", color: `rgba(129,140,248,${active ? "0.38" : "0.18"})`, letterSpacing: "0.06em" }}>SYNC</span>
      </div>
    </div>
  );
}

/* ─── AI Core (refined) ──────────────────────────────────────────── */
function AICore({ t }: { t: number }) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.65);
  const rot = (t * 8) % 360;

  return (
    <div style={{
      width: "120px", height: "120px",
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {/* Single soft outer ring */}
      <div aria-hidden="true" style={{
        position: "absolute",
        width: `${130 + pulse * 8}px`, height: `${130 + pulse * 8}px`,
        borderRadius: "50%",
        border: `1px solid rgba(129,140,248,${(0.05 + pulse * 0.04).toFixed(2)})`,
        left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      {/* Rotating dashed ring — very subtle */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: "-6px",
        borderRadius: "50%",
        border: "1px dashed rgba(129,140,248,0.08)",
        transform: `rotate(${rot}deg)`,
      }} />

      {/* Glass disc */}
      <div style={{
        width: "120px", height: "120px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%,rgba(99,102,241,0.10) 0%,rgba(6,6,18,0.90) 60%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(129,140,248,0.14)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 28px rgba(99,102,241,${(0.06 + pulse * 0.04).toFixed(2)})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "5px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Top shimmer */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right,transparent,rgba(165,180,252,0.14),transparent)",
        }} />

        {/* Inner grid — very faint */}
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ position: "absolute", opacity: 0.10 }}>
          {[17, 35, 53].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="70" stroke="rgba(129,140,248,1)" strokeWidth="0.5" />)}
          {[17, 35, 53].map(y => <line key={`h${y}`} x1="0" y1={y} x2="70" y2={y} stroke="rgba(129,140,248,1)" strokeWidth="0.5" />)}
          <circle cx="35" cy="35" r="14" stroke="rgba(129,140,248,1)" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Center dot */}
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: `rgba(165,180,252,${(0.55 + pulse * 0.20).toFixed(2)})`,
          boxShadow: `0 0 ${6 + pulse * 6}px rgba(99,102,241,0.35)`,
        }} />

        <span style={{
          fontSize: "8px", fontWeight: 600, letterSpacing: "0.10em",
          color: "rgba(165,180,252,0.55)", textTransform: "uppercase",
          lineHeight: 1,
        }}>
          AI Core
        </span>
      </div>
    </div>
  );
}

/* ─── Domain node (refined) ──────────────────────────────────────── */
function DomainNode({
  domain,
  active,
  hovered,
  t,
  onActivate,
}: {
  domain: Domain;
  active: boolean;
  hovered: boolean;
  t: number;
  onActivate: () => void;
}) {
  const emphasis = active || hovered;
  return (
    <div
      onMouseEnter={onActivate}
      onClick={onActivate}
      style={{
        position: "relative",
        borderRadius: "14px",
        background: emphasis ? "rgba(10,10,26,0.88)" : "rgba(6,6,18,0.70)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: emphasis
          ? `1px solid rgba(129,140,248,0.22)`
          : `1px solid rgba(129,140,248,0.08)`,
        boxShadow: emphasis
          ? `inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 36px rgba(0,0,0,0.30), 0 0 16px rgba(99,102,241,0.07)`
          : `inset 0 1px 0 rgba(255,255,255,0.02), 0 4px 18px rgba(0,0,0,0.18)`,
        transform: emphasis ? "translateY(-2px) scale(1.010)" : "translateY(0) scale(1)",
        transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
        cursor: "pointer",
        overflow: "hidden",
        padding: "14px 14px 12px",
        width: "190px",
      }}
    >
      {/* Top shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: emphasis
          ? "linear-gradient(to right,transparent,rgba(165,180,252,0.18),transparent)"
          : "linear-gradient(to right,transparent,rgba(165,180,252,0.05),transparent)",
        transition: "background 400ms ease",
        pointerEvents: "none",
      }} />

      {/* Mini viz */}
      <div style={{
        borderRadius: "8px",
        background: "rgba(129,140,248,0.03)",
        border: "1px solid rgba(129,140,248,0.06)",
        marginBottom: "10px",
        overflow: "hidden",
        padding: "7px 7px 4px",
      }}>
        {domain.id === "marketing"  && <MarketingMini t={t} active={emphasis} />}
        {domain.id === "sales"      && <SalesMini     t={t} active={emphasis} />}
        {domain.id === "operations" && <OpsMini       t={t} active={emphasis} />}
      </div>

      {/* Title */}
      <p style={{
        fontSize: "11.5px",
        fontWeight: 600,
        color: emphasis ? "rgba(230,233,255,0.92)" : "rgba(180,186,220,0.55)",
        letterSpacing: "-0.005em",
        lineHeight: 1.3,
        margin: 0,
        transition: "color 400ms ease",
      }}>
        {domain.short}
      </p>
      <p style={{
        fontSize: "9.5px",
        fontWeight: 400,
        color: emphasis ? "rgba(150,158,210,0.55)" : "rgba(130,138,190,0.35)",
        margin: "2px 0 0",
        lineHeight: 1.4,
        transition: "color 400ms ease",
      }}>
        Systems
      </p>

      {/* Active indicator */}
      <div style={{
        position: "absolute", bottom: "9px", right: "11px",
        width: "4px", height: "4px", borderRadius: "50%",
        background: active ? "rgba(129,140,248,0.65)" : "rgba(129,140,248,0.15)",
        transition: "all 400ms ease",
      }} />
    </div>
  );
}

/* ─── Contextual content panel (refined) ────────────────────────── */
function ContentPanel({ domain }: { domain: Domain }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={domain.id}
        initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{
          borderRadius: "14px",
          background: "rgba(6,6,18,0.70)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(129,140,248,0.10)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 24px rgba(0,0,0,0.20)",
          padding: "22px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top shimmer */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right,transparent,rgba(165,180,252,0.10),transparent)",
          pointerEvents: "none",
        }} />

        <p style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(129,140,248,0.50)", margin: "0 0 8px" }}>
          Active System
        </p>
        <h3 style={{ fontSize: "17px", fontWeight: 500, color: "rgba(225,228,255,0.92)", letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 10px" }}>
          {domain.title}
        </h3>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(170,176,215,0.65)", lineHeight: 1.68, margin: "0 0 18px" }}>
          {domain.description}
        </p>

        {/* Capabilities */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(129,140,248,0.40)", margin: "0 0 8px" }}>
            Capabilities
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {domain.capabilities.map((cap) => (
              <div key={cap} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(129,140,248,0.40)", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "rgba(170,176,215,0.60)", letterSpacing: "0.01em" }}>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ borderTop: "1px solid rgba(129,140,248,0.07)", paddingTop: "14px" }}>
          <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(129,140,248,0.40)", margin: "0 0 8px" }}>
            Results
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {domain.results.map((r) => (
              <div key={r} style={{
                padding: "5px 10px", borderRadius: "9999px",
                background: "rgba(129,140,248,0.06)",
                border: "1px solid rgba(129,140,248,0.10)",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(190,196,235,0.72)", letterSpacing: "0.01em" }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Desktop composition ────────────────────────────────────────── */
function DesktopComposition({ t, activeDomain, setHoveredDomain, hoveredDomain }: {
  t: number;
  activeDomain: DomainId;
  hoveredDomain: DomainId | null;
  setHoveredDomain: (id: DomainId | null) => void;
}) {
  const effectiveDomain = hoveredDomain ?? activeDomain;
  const active: Domain = DOMAINS.find(d => d.id === effectiveDomain) ?? DOMAINS[0];

  return (
    <div style={{ display: "flex", gap: "36px", alignItems: "flex-start", justifyContent: "center" }}>

      {/* Left: orbital composition */}
      <div style={{ position: "relative", width: "500px", height: "400px", flexShrink: 0 }}>

        {/* Domain: Marketing — upper left */}
        <div style={{ position: "absolute", top: "16px", left: "0px" }}>
          <DomainNode
            domain={DOMAINS[0]}
            active={activeDomain === "marketing"}
            hovered={hoveredDomain === "marketing"}
            t={t}
            onActivate={() => setHoveredDomain("marketing")}
          />
        </div>

        {/* Domain: Sales — upper right */}
        <div style={{ position: "absolute", top: "16px", right: "0px" }}>
          <DomainNode
            domain={DOMAINS[1]}
            active={activeDomain === "sales"}
            hovered={hoveredDomain === "sales"}
            t={t}
            onActivate={() => setHoveredDomain("sales")}
          />
        </div>

        {/* Domain: Operations — bottom center */}
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)" }}>
          <DomainNode
            domain={DOMAINS[2]}
            active={activeDomain === "operations"}
            hovered={hoveredDomain === "operations"}
            t={t}
            onActivate={() => setHoveredDomain("operations")}
          />
        </div>

        {/* AI Core — center */}
        <div
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          onMouseEnter={() => setHoveredDomain(null)}
        >
          <AICore t={t} />
        </div>

        {/* Connection lines SVG */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
          onMouseEnter={() => setHoveredDomain(null)}
        >
          {/* Marketing → Core: card center ~(95,116) → core center ~(250,200) */}
          {(() => {
            const isActive = effectiveDomain === "marketing";
            const op = isActive ? 0.38 : 0.06;
            const progress = ((t * 0.45) % 1 + 1) % 1;
            return (
              <g>
                <line x1="190" y1="116" x2="250" y2="200" stroke={`rgba(129,140,248,${op})`} strokeWidth="0.8" style={{ transition: "stroke 500ms ease" }} />
                {isActive && (
                  <circle cx={lerp(190, 250, progress)} cy={lerp(116, 200, progress)} r="2.5" fill="rgba(165,180,252,0.70)" />
                )}
              </g>
            );
          })()}
          {/* Sales → Core: card center ~(310,116) → core center ~(250,200) */}
          {(() => {
            const isActive = effectiveDomain === "sales";
            const op = isActive ? 0.38 : 0.06;
            const progress = ((t * 0.45 + 0.5) % 1 + 1) % 1;
            return (
              <g>
                <line x1="310" y1="116" x2="250" y2="200" stroke={`rgba(129,140,248,${op})`} strokeWidth="0.8" style={{ transition: "stroke 500ms ease" }} />
                {isActive && (
                  <circle cx={lerp(310, 250, progress)} cy={lerp(116, 200, progress)} r="2.5" fill="rgba(165,180,252,0.70)" />
                )}
              </g>
            );
          })()}
          {/* Operations → Core: card center ~(250,330) → core center ~(250,200) */}
          {(() => {
            const isActive = effectiveDomain === "operations";
            const op = isActive ? 0.38 : 0.06;
            const progress = ((t * 0.45 + 0.25) % 1 + 1) % 1;
            return (
              <g>
                <line x1="250" y1="330" x2="250" y2="270" stroke={`rgba(129,140,248,${op})`} strokeWidth="0.8" style={{ transition: "stroke 500ms ease" }} />
                {isActive && (
                  <circle cx={lerp(250, 250, progress)} cy={lerp(330, 270, progress)} r="2.5" fill="rgba(165,180,252,0.70)" />
                )}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Right: contextual content panel */}
      <div
        style={{ flex: 1, maxWidth: "360px", paddingTop: "16px" }}
        onMouseEnter={() => setHoveredDomain(null)}
      >
        <ContentPanel domain={active} />
      </div>

    </div>
  );
}

/* ─── Mobile composition ─────────────────────────────────────────── */
function MobileComposition({ t, activeDomain }: {
  t: number;
  activeDomain: DomainId;
}) {
  const active: Domain = DOMAINS.find(d => d.id === activeDomain) ?? DOMAINS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>

      {/* AI Core */}
      <AICore t={t} />

      {/* Connector */}
      <div style={{ width: "1px", height: "16px", background: "rgba(129,140,248,0.12)" }} />

      {/* Domain tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "340px" }}>
        {DOMAINS.map((domain) => {
          const isActive = activeDomain === domain.id;
          return (
            <div
              key={domain.id}
              style={{
                borderRadius: "12px",
                background: isActive ? "rgba(10,10,26,0.88)" : "rgba(6,6,18,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: isActive ? "1px solid rgba(129,140,248,0.20)" : "1px solid rgba(129,140,248,0.07)",
                boxShadow: isActive
                  ? "inset 0 1px 0 rgba(255,255,255,0.04), 0 6px 22px rgba(0,0,0,0.26)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02), 0 3px 12px rgba(0,0,0,0.16)",
                padding: "12px 16px",
                transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span aria-hidden="true" style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: isActive
                  ? "linear-gradient(to right,transparent,rgba(165,180,252,0.14),transparent)"
                  : "linear-gradient(to right,transparent,rgba(165,180,252,0.04),transparent)",
                pointerEvents: "none",
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: "13px", fontWeight: 500,
                  color: isActive ? "rgba(225,228,255,0.90)" : "rgba(170,176,215,0.50)",
                  transition: "color 400ms ease",
                }}>
                  {domain.title}
                </span>
                <div style={{
                  width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                  background: isActive ? "rgba(129,140,248,0.60)" : "rgba(129,140,248,0.15)",
                  transition: "all 400ms ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content panel */}
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <ContentPanel domain={active} />
      </div>
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────────────── */
export function ImpactAreas() {
  const [t, setT] = useState(0);
  const [activeDomain, setActiveDomain] = useState<DomainId>("marketing");
  const [hoveredDomain, setHoveredDomain] = useState<DomainId | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  // Scroll-based domain progression
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"],
  });

  // Map scroll progress to domain index: 0→marketing, 0.33→sales, 0.66→operations
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // Only update from scroll if user isn't hovering
      if (hoveredDomain) return;
      if (v < 0.38) setActiveDomain("marketing");
      else if (v < 0.72) setActiveDomain("sales");
      else setActiveDomain("operations");
    });
    return unsub;
  }, [scrollYProgress, hoveredDomain]);

  // Clear hover after 2s of no movement (let scroll take over again)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHover = useCallback((id: DomainId | null) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredDomain(id);
    if (id !== null) {
      hoverTimeoutRef.current = setTimeout(() => setHoveredDomain(null), 2200);
    }
  }, []);

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

  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      aria-label="How Our AI Systems Drive Business Impact"
      style={{ position: "relative", overflow: "hidden", padding: "96px 24px 80px" }}
    >
      {/* Atmospheric background — very restrained */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse at 50% 0%,rgba(88,92,241,0.018) 0%,transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: "linear-gradient(to right,transparent,rgba(129,140,248,0.08),transparent)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1080px", margin: "0 auto" }}>

        {/* Header */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "52px" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.50, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(129,140,248,0.55)", marginBottom: "14px" }}
          >
            AI Automation for Modern Businesses
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            style={{ fontSize: "clamp(24px,3.8vw,44px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.18, color: "#f0f0f5", margin: "0 0 16px" }}
          >
            How Our AI Systems Drive Business Impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: 0.20 }}
            style={{ fontSize: "clamp(13.5px,1.7vw,16px)", fontWeight: 300, lineHeight: 1.72, color: "rgba(190,196,230,0.62)", maxWidth: "540px", margin: "0 auto" }}
          >
            Explore how our AI-powered systems improve marketing execution, lead management, and internal operations through intelligent automation built for modern businesses.
          </motion.p>
        </div>

        {/* Scroll progress indicator — subtle domain tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.50, delay: 0.30 }}
          style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "40px" }}
        >
          {DOMAINS.map((d) => {
            const isActive = (hoveredDomain ?? activeDomain) === d.id;
            return (
              <div
                key={d.id}
                style={{
                  height: "2px",
                  width: isActive ? "28px" : "14px",
                  borderRadius: "1px",
                  background: isActive ? "rgba(129,140,248,0.55)" : "rgba(129,140,248,0.18)",
                  transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            );
          })}
        </motion.div>

        {/* Composition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
        >
          {isMobile
            ? <MobileComposition t={t} activeDomain={hoveredDomain ?? activeDomain} />
            : <DesktopComposition t={t} activeDomain={activeDomain} hoveredDomain={hoveredDomain} setHoveredDomain={handleHover} />
          }
        </motion.div>

        {/* Benefits row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginTop: "44px" }}
        >
          {["Less manual work", "Faster execution", "Better response times", "Clearer operational visibility"].map((b) => (
            <div key={b} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px", borderRadius: "9999px",
              background: "rgba(129,140,248,0.04)",
              border: "1px solid rgba(129,140,248,0.09)",
            }}>
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(129,140,248,0.40)", flexShrink: 0 }} />
              <span style={{ fontSize: "11.5px", fontWeight: 400, color: "rgba(170,176,215,0.60)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{b}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
