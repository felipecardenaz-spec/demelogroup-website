"use client";

import { useState, useEffect } from "react";

type ModuleId = "hero" | "marketing" | "sales" | "operations";

/* ─── Animated flow dot ──────────────────────────────────────────── */
function FlowDot({ t, offset = 0 }: { t: number; offset?: number }) {
  const progress = ((t * 0.28 + offset) % 1 + 1) % 1;
  const x = progress * 100;
  return (
    <svg width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{ display: "block" }}>
      <line x1="0" y1="4" x2="100" y2="4" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <circle cx={x} cy="4" r="2" fill="rgba(129,140,248,0.45)" />
      <circle cx={Math.max(0, x - 10)} cy="4" r="1.2" fill="rgba(129,140,248,0.20)" />
    </svg>
  );
}

/* ─── Pulse indicator ────────────────────────────────────────────── */
function Pulse({ t }: { t: number }) {
  const v = 0.50 + 0.30 * Math.abs(Math.sin(t * 0.9));
  return (
    <div style={{
      width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
      background: `rgba(129,140,248,${v.toFixed(2)})`,
    }} />
  );
}

/* ─── Hero block ─────────────────────────────────────────────────── */
function HeroBlock({ t, isHovered, onHover }: {
  t: number; isHovered: boolean; onHover: (v: boolean) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        borderRadius: "16px",
        background: "rgba(8,8,18,0.82)",
        border: `1px solid ${isHovered ? "rgba(129,140,248,0.20)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: isHovered
          ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 50px rgba(0,0,0,0.38)"
          : "inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 32px rgba(0,0,0,0.28)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Top line */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right,transparent,rgba(165,180,252,0.12),transparent)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Pulse t={t} />
          <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(129,140,248,0.50)" }}>
            Core System
          </span>
        </div>
        <h3 style={{
          fontSize: "clamp(18px,1.9vw,22px)", fontWeight: 500,
          letterSpacing: "-0.022em", lineHeight: 1.25,
          color: "#f0f0f5", margin: 0,
        }}>
          AI Systems That Replace<br />Manual Work
        </h3>
        <p style={{
          fontSize: "13px", fontWeight: 300, lineHeight: 1.65,
          color: "rgba(255,255,255,0.80)", margin: 0,
          maxWidth: "340px",
        }}>
          Automate marketing, sales, and operations with systems designed to execute consistently and efficiently.
        </p>
      </div>

      {/* System visual */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Central bar */}
        <div style={{
          padding: "10px 14px",
          borderRadius: "9px",
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(129,140,248,0.14)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Pulse t={t} />
            <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(200,206,255,0.85)" }}>AI Automation System</span>
          </div>
          <span style={{ fontSize: "8.5px", fontWeight: 600, color: "rgba(129,140,248,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Active</span>
        </div>

        {/* Three nodes */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { label: "Marketing", sub: "Content & Campaigns" },
            { label: "Sales", sub: "Leads & Follow-ups" },
            { label: "Operations", sub: "Workflows & Reports" },
          ].map((node, i) => (
            <div key={node.label} style={{
              flex: 1, padding: "10px 10px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex", flexDirection: "column", gap: "5px",
            }}>
              <span style={{ fontSize: "9px", fontWeight: 600, color: "rgba(175,182,215,0.65)", letterSpacing: "0.03em" }}>{node.label}</span>
              <span style={{ fontSize: "8px", color: "rgba(130,138,190,0.35)", lineHeight: 1.4 }}>{node.sub}</span>
              <FlowDot t={t} offset={i * 0.33} />
            </div>
          ))}
        </div>
      </div>

      {/* 3 inline points */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {[
          "Automate execution",
          "Reduce manual tasks",
          "Improve response speed",
        ].map((point) => (
          <div key={point} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
              <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="rgba(129,140,248,0.50)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(175,182,215,0.55)" }}>{point}</span>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", gap: "10px" }}>
        {[
          { value: "−18h", label: "manual work / week" },
          { value: "+41%", label: "response speed" },
        ].map((m) => (
          <div key={m.label} style={{
            flex: 1, padding: "12px 14px",
            borderRadius: "10px",
            background: "rgba(99,102,241,0.05)",
            border: "1px solid rgba(129,140,248,0.09)",
            display: "flex", flexDirection: "column", gap: "3px",
          }}>
            <span style={{ fontSize: "20px", fontWeight: 600, color: "rgba(200,206,255,0.90)", letterSpacing: "-0.03em", lineHeight: 1 }}>{m.value}</span>
            <span style={{ fontSize: "9px", color: "rgba(130,138,190,0.42)", letterSpacing: "0.02em" }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Supporting module ──────────────────────────────────────────── */
function Module({
  t,
  eyebrow,
  title,
  description,
  points,
  visual,
  isHovered,
  isDimmed,
  onHover,
  horizontal = false,
}: {
  t: number;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  visual: React.ReactNode;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (v: boolean) => void;
  horizontal?: boolean;
}) {
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        borderRadius: "14px",
        background: "rgba(8,8,18,0.72)",
        border: `1px solid ${isHovered ? "rgba(129,140,248,0.18)" : "rgba(255,255,255,0.06)"}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: isHovered
          ? "inset 0 1px 0 rgba(255,255,255,0.04), 0 14px 40px rgba(0,0,0,0.32)"
          : "inset 0 1px 0 rgba(255,255,255,0.02), 0 6px 20px rgba(0,0,0,0.20)",
        padding: horizontal ? "22px 26px" : "22px",
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        gap: horizontal ? "32px" : "16px",
        alignItems: horizontal ? "center" : "flex-start",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        opacity: isDimmed ? 0.50 : 1,
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right,transparent,rgba(165,180,252,0.08),transparent)",
        pointerEvents: "none",
      }} />

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: horizontal ? "0 0 auto" : undefined, maxWidth: horizontal ? "220px" : undefined }}>
        <span style={{ fontSize: "8.5px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(129,140,248,0.42)" }}>
          {eyebrow}
        </span>
        <h4 style={{ fontSize: "14.5px", fontWeight: 500, letterSpacing: "-0.016em", color: "#f0f0f5", margin: 0, lineHeight: 1.3 }}>
          {title}
        </h4>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.80)", margin: 0, lineHeight: 1.60 }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "2px" }}>
          {points.map((p) => (
            <span key={p} style={{
              fontSize: "9px", fontWeight: 500,
              color: "rgba(165,180,252,0.50)",
              padding: "2px 8px",
              borderRadius: "4px",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(129,140,248,0.09)",
            }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Visual */}
      <div style={{ flex: 1, width: horizontal ? undefined : "100%" }}>
        {visual}
      </div>
    </div>
  );
}

/* ─── Marketing visual ───────────────────────────────────────────── */
function MarketingVisual({ t }: { t: number }) {
  const steps = ["Plan", "Create", "Review", "Publish"];
  const active = Math.floor((t * 0.30) % steps.length);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {steps.map((s, i) => {
          const isA = i === active;
          const isP = i < active;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{
                padding: "3px 8px", borderRadius: "5px",
                background: isA ? "rgba(99,102,241,0.16)" : isP ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.025)",
                border: isA ? "1px solid rgba(129,140,248,0.28)" : "1px solid rgba(255,255,255,0.04)",
                transition: "all 350ms ease",
              }}>
                <span style={{ fontSize: "8.5px", fontWeight: 500, color: isA ? "rgba(200,206,255,0.90)" : "rgba(140,148,190,0.35)", transition: "color 350ms ease" }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path d="M1 3H5M5 3L3 1M5 3L3 5" stroke="rgba(129,140,248,0.20)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      <FlowDot t={t} />
    </div>
  );
}

/* ─── Sales visual ───────────────────────────────────────────────── */
function SalesVisual({ t }: { t: number }) {
  const stages = [
    { label: "Captured", pct: 100 },
    { label: "Qualified", pct: 65 },
    { label: "Booked", pct: 38 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {stages.map((s, i) => {
        const w = s.pct * (0.88 + 0.12 * Math.abs(Math.sin(t * 0.35 + i * 0.7)));
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "8px", color: "rgba(140,148,190,0.40)", width: "48px", flexShrink: 0 }}>{s.label}</span>
            <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${w}%`, borderRadius: "2px",
                background: `rgba(129,140,248,${0.30 + (1 - i * 0.12) * 0.25})`,
                transition: "width 500ms ease",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Operations visual ──────────────────────────────────────────── */
function OpsVisual({ t }: { t: number }) {
  const tasks = [
    { label: "Report generation", done: true },
    { label: "Data sync", done: true },
    { label: "Status updates", done: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {tasks.map((task, i) => {
        const isRunning = !task.done && i === tasks.filter(x => x.done).length;
        return (
          <div key={task.label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{
              width: "11px", height: "11px", borderRadius: "3px", flexShrink: 0,
              background: task.done ? "rgba(99,102,241,0.16)" : "rgba(255,255,255,0.025)",
              border: task.done ? "1px solid rgba(129,140,248,0.26)" : isRunning ? "1px solid rgba(129,140,248,0.16)" : "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {task.done && (
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path d="M1 3L2.4 4.8L5 1.2" stroke="rgba(165,180,252,0.75)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isRunning && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(129,140,248,0.55)" }} />}
            </div>
            <span style={{
              fontSize: "9px",
              color: task.done ? "rgba(175,182,215,0.40)" : isRunning ? "rgba(200,206,255,0.75)" : "rgba(130,138,190,0.30)",
              textDecoration: task.done ? "line-through" : "none",
            }}>{task.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Mobile card ────────────────────────────────────────────────── */
function MobileCard({ eyebrow, title, description, points, visual }: {
  eyebrow: string; title: string; description: string; points: string[]; visual: React.ReactNode;
}) {
  return (
    <div style={{
      borderRadius: "14px",
      background: "rgba(8,8,18,0.75)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 20px rgba(0,0,0,0.22)",
      padding: "22px",
      display: "flex", flexDirection: "column", gap: "14px",
      position: "relative", overflow: "hidden",
    }}>
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right,transparent,rgba(165,180,252,0.08),transparent)",
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <span style={{ fontSize: "8.5px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(129,140,248,0.42)" }}>{eyebrow}</span>
        <h4 style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.016em", color: "#f0f0f5", margin: 0, lineHeight: 1.3 }}>{title}</h4>
        <p style={{ fontSize: "12.5px", fontWeight: 300, color: "rgba(255,255,255,0.80)", margin: 0, lineHeight: 1.60 }}>{description}</p>
      </div>
      {visual}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {points.map((p) => (
          <span key={p} style={{
            fontSize: "9px", fontWeight: 500,
            color: "rgba(165,180,252,0.50)",
            padding: "2px 8px", borderRadius: "4px",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(129,140,248,0.09)",
          }}>{p}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */
export function ImpactAreas() {
  const [t, setT] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState<ModuleId | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
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

  const isDimmed = (id: ModuleId) => hovered !== null && hovered !== id;

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <section aria-label="AI Systems for Business Operations" style={{ padding: "60px 20px 80px", position: "relative" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "25%", transform: "translate(-50%,-50%)",
          width: "500px", height: "300px", borderRadius: "9999px",
          background: "radial-gradient(ellipse,rgba(99,102,241,0.035) 0%,transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(129,140,248,0.44)", margin: 0 }}>
              AI Systems for Business Operations
            </p>
            <h2 style={{ fontSize: "clamp(22px,6vw,28px)", fontWeight: 400, letterSpacing: "-0.022em", lineHeight: 1.22, color: "#f0f0f5", margin: 0 }}>
              Operate faster.<br />Do more with less.
            </h2>
            <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.65, color: "rgba(255,255,255,0.80)", margin: 0 }}>
              We design AI-powered systems that automate workflows and improve how your business runs.
            </p>
          </div>

          {/* Hero card */}
          <MobileCard
            eyebrow="Core System"
            title="AI Systems That Replace Manual Work"
            description="Automate marketing, sales, and operations with systems built to execute consistently."
            points={["Automate execution", "Reduce manual tasks", "Improve response speed"]}
            visual={
              <div style={{ display: "flex", gap: "8px" }}>
                {[{ value: "−18h", label: "manual work/wk" }, { value: "+41%", label: "response speed" }].map((m) => (
                  <div key={m.label} style={{
                    flex: 1, padding: "10px 12px", borderRadius: "9px",
                    background: "rgba(99,102,241,0.05)", border: "1px solid rgba(129,140,248,0.09)",
                    display: "flex", flexDirection: "column", gap: "2px",
                  }}>
                    <span style={{ fontSize: "18px", fontWeight: 600, color: "rgba(200,206,255,0.88)", letterSpacing: "-0.03em", lineHeight: 1 }}>{m.value}</span>
                    <span style={{ fontSize: "8.5px", color: "rgba(130,138,190,0.40)" }}>{m.label}</span>
                  </div>
                ))}
              </div>
            }
          />

          <MobileCard
            eyebrow="Marketing Automation"
            title="Marketing Automation"
            description="Plan, create, and publish content automatically."
            points={["Content workflows", "Publishing systems"]}
            visual={<MarketingVisual t={t} />}
          />

          <MobileCard
            eyebrow="Lead Management"
            title="Lead Systems"
            description="Capture and convert leads without manual follow-up."
            points={["Qualification", "Follow-ups"]}
            visual={<SalesVisual t={t} />}
          />

          <MobileCard
            eyebrow="Operations"
            title="Workflow Automation"
            description="Automate internal processes and recurring tasks."
            points={["Reporting", "Task flows"]}
            visual={<OpsVisual t={t} />}
          />
        </div>
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <section aria-label="AI Systems for Business Operations" style={{ padding: "80px 20px 100px", position: "relative" }}>
      <div aria-hidden="true" style={{
        position: "absolute", left: "50%", top: "35%", transform: "translate(-50%,-50%)",
        width: "800px", height: "400px", borderRadius: "9999px",
        background: "radial-gradient(ellipse,rgba(99,102,241,0.035) 0%,transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "1050px", margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "52px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "560px", margin: "0 auto" }}>
          <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(129,140,248,0.44)", margin: 0 }}>
            AI Systems for Business Operations
          </p>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.18, color: "#f0f0f5", margin: 0 }}>
            Operate faster. Do more with less.
          </h2>
          <p style={{ fontSize: "clamp(13px,1.2vw,14.5px)", fontWeight: 300, lineHeight: 1.68, color: "rgba(255,255,255,0.80)", margin: 0 }}>
            We design AI-powered systems that automate workflows and improve how your business runs.
          </p>
        </div>

        {/* Row 1: hero (left) + stacked modules (right) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "14px", alignItems: "stretch" }}>
          <HeroBlock
            t={t}
            isHovered={hovered === "hero"}
            onHover={(v) => setHovered(v ? "hero" : null)}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Module
              t={t}
              eyebrow="Marketing Automation"
              title="Marketing Automation"
              description="Plan, create, and publish content automatically."
              points={["Content workflows", "Publishing systems"]}
              visual={<MarketingVisual t={t} />}
              isHovered={hovered === "marketing"}
              isDimmed={isDimmed("marketing")}
              onHover={(v) => setHovered(v ? "marketing" : null)}
            />
            <Module
              t={t}
              eyebrow="Lead Management"
              title="Lead Systems"
              description="Capture and convert leads without manual follow-up."
              points={["Qualification", "Follow-ups"]}
              visual={<SalesVisual t={t} />}
              isHovered={hovered === "sales"}
              isDimmed={isDimmed("sales")}
              onHover={(v) => setHovered(v ? "sales" : null)}
            />
          </div>
        </div>

        {/* Row 2: operations (horizontal) */}
        <Module
          t={t}
          eyebrow="Operations"
          title="Workflow Automation"
          description="Automate internal processes and recurring tasks."
          points={["Reporting", "Task flows"]}
          visual={<OpsVisual t={t} />}
          isHovered={hovered === "operations"}
          isDimmed={isDimmed("operations")}
          onHover={(v) => setHovered(v ? "operations" : null)}
          horizontal
        />
      </div>
    </section>
  );
}
