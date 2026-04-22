"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Config ─────────────────────────────────────────────────────── */
const PHRASES = ["marketing teams", "sales pipelines", "business operations"];
const PHRASE_DURATION = 2600;
const TRANSITION_MS = 480;

/* ─── Metric pool — 8 rotating business outcomes ─────────────────── */
const METRIC_POOL = [
  { value: 32,  unit: "%",  prefix: "+", label: "conversion rate",       icon: "trend"  },
  { value: 41,  unit: "%",  prefix: "+", label: "lead response speed",   icon: "pulse"  },
  { value: 18,  unit: "h",  prefix: "−", label: "manual work / week",    icon: "status" },
  { value: 78,  unit: "%",  prefix: "",  label: "tasks automated",       icon: "bar"    },
  { value: 2.4, unit: "x",  prefix: "+", label: "qualified leads",       icon: "trend"  },
  { value: 27,  unit: "%",  prefix: "+", label: "pipeline value",        icon: "pulse"  },
  { value: 35,  unit: "%",  prefix: "+", label: "content performance",   icon: "bar"    },
  { value: 22,  unit: "%",  prefix: "−", label: "operational overhead",  icon: "status" },
];

/* ─── Panel layout ───────────────────────────────────────────────── */
// 4 panels on desktop, 3 on mobile
// Positions are % of the hero container (900×860 SVG viewBox equivalent)
const PANEL_SLOTS_DESKTOP = [
  { id: "s1", x: "3%",  y: "34%", floatY: 5,  floatDur: 11.0, delay: 0,   parallaxFactor: 0.55, breatheOffset: 0.0, metricIdx: 0 },
  { id: "s2", x: "78%", y: "26%", floatY: -6, floatDur: 13.5, delay: 2.2, parallaxFactor: 0.75, breatheOffset: 2.1, metricIdx: 1 },
  { id: "s3", x: "80%", y: "48%", floatY: 4,  floatDur: 9.8,  delay: 4.5, parallaxFactor: 0.45, breatheOffset: 4.3, metricIdx: 3 },
  { id: "s4", x: "2%",  y: "58%", floatY: -5, floatDur: 12.2, delay: 1.8, parallaxFactor: 0.65, breatheOffset: 1.5, metricIdx: 2 },
];

const PANEL_SLOTS_MOBILE = [
  { id: "s2", x: "68%", y: "24%", floatY: -4, floatDur: 13.5, delay: 0,   parallaxFactor: 0, breatheOffset: 2.1, metricIdx: 1 },
  { id: "s3", x: "72%", y: "46%", floatY: 3,  floatDur: 9.8,  delay: 2.0, parallaxFactor: 0, breatheOffset: 4.3, metricIdx: 3 },
  { id: "s4", x: "2%",  y: "52%", floatY: -3, floatDur: 12.2, delay: 1.0, parallaxFactor: 0, breatheOffset: 1.5, metricIdx: 2 },
];

/* ─── Connections — smooth bezier curves ─────────────────────────── */
// SVG 900×860 viewBox. Panel centers (approx):
//   s1: (72, 320)   s2: (738, 244)   s3: (756, 432)   s4: (54, 516)
// Control points chosen for elegant, symmetric arcs
const CONNECTIONS_DESKTOP = [
  // s1 → s2: wide diagonal arc, control point above center
  { id: "c1", x0: 72,  y0: 320, x1: 738, y1: 244, cpx: 380, cpy: 160, dur: 9.2,  phase: 0.00, breatheDur: 7.0, breathePhase: 0.00 },
  // s2 → s3: short right-side drop, control point bows right
  { id: "c2", x0: 738, y0: 244, x1: 756, y1: 432, cpx: 840, cpy: 338, dur: 7.8,  phase: 0.33, breatheDur: 8.5, breathePhase: 0.40 },
  // s4 → s1: left-side rise, control point bows left
  { id: "c3", x0: 54,  y0: 516, x1: 72,  y1: 320, cpx: -20, cpy: 418, dur: 8.6,  phase: 0.67, breatheDur: 6.5, breathePhase: 0.70 },
];

const CONNECTIONS_MOBILE = [
  // s2 → s3 only on mobile
  { id: "c2", x0: 648, y0: 230, x1: 684, y1: 414, cpx: 780, cpy: 322, dur: 7.8, phase: 0.33, breatheDur: 8.5, breathePhase: 0.40 },
];

/* ─── Atmospheric paths ──────────────────────────────────────────── */
const FLOW_PATHS = [
  { id: "fp1", d: "M 60 560 C 200 420, 500 280, 820 160",  dur: 8.0,  phase: 0.00, opacity: 0.040 },
  { id: "fp2", d: "M 100 380 C 280 260, 550 420, 800 300", dur: 11.0, phase: 0.30, opacity: 0.028 },
  { id: "fp3", d: "M 0 620 C 250 540, 600 520, 900 460",   dur: 14.0, phase: 0.60, opacity: 0.024 },
  { id: "fp4", d: "M 80 200 C 300 160, 580 240, 860 360",  dur: 10.0, phase: 0.15, opacity: 0.024 },
  { id: "fp5", d: "M 550 500 C 650 440, 760 460, 880 520", dur: 7.0,  phase: 0.50, opacity: 0.034 },
];

/* ─── Math helpers ───────────────────────────────────────────────── */
function qBez(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
  const m = 1 - t;
  return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
}
function qBezTangent(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
  const m = 1 - t;
  return { dx: 2*m*(cpx-x0) + 2*t*(x1-cpx), dy: 2*m*(cpy-y0) + 2*t*(y1-cpy) };
}
function cubicBez(t: number, x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x1: number, y1: number) {
  const m = 1 - t;
  return { x: m*m*m*x0+3*m*m*t*cx1+3*m*t*t*cx2+t*t*t*x1, y: m*m*m*y0+3*m*m*t*cy1+3*m*t*t*cy2+t*t*t*y1 };
}
function parseCubic(d: string) {
  const p = d.replace(/[MC,]/g," ").trim().split(/\s+/).map(Number);
  return { x0:p[0],y0:p[1],cx1:p[2],cy1:p[3],cx2:p[4],cy2:p[5],x1:p[6],y1:p[7] };
}
// Smooth ease in-out
function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
// Ease in-out with slight overshoot feel
function eioSoft(t: number) {
  const e = eio(t);
  return e + 0.04 * Math.sin(e * Math.PI);
}

/* ─── Panel icon renderers ───────────────────────────────────────── */
function TrendIcon({ t }: { t: number }) {
  const base = [18,14,16,10,12,6,8,2];
  const pts = base.map((y,i) => [i*8, Math.max(0, y + 2.0*Math.sin(t*0.36+i*0.82) + 0.6*Math.sin(t*1.1+i*1.5))]);
  const d = pts.map(([x,y],i) => `${i===0?"M":"L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg width="56" height="20" viewBox="0 0 56 20" fill="none">
      <path d={d} stroke="rgba(129,140,248,0.50)" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="1.6" fill="rgba(165,180,252,0.75)"/>
    </svg>
  );
}
function PulseIcon({ t }: { t: number }) {
  const base = [3,7,5,10,8,12,6,9,4,11,7,5];
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:"2px",height:"16px"}}>
      {base.map((h,i) => {
        const v = h * (0.48 + 0.52 * Math.abs(
          Math.sin(t*1.4+i*0.62)*0.38 + Math.sin(t*0.82+i*1.18)*0.28 + 0.34
        ));
        const op = 0.22 + 0.32 * Math.abs(Math.sin(t*0.95+i*0.48));
        return <div key={i} style={{width:"2px",height:`${Math.max(2,v)}px`,borderRadius:"1px",background:`rgba(129,140,248,${op.toFixed(2)})`}}/>;
      })}
    </div>
  );
}
function BarIcon({ t }: { t: number }) {
  const fill = 0.62 + 0.18*Math.sin(t*0.30) + 0.06*Math.sin(t*1.9+0.5);
  return (
    <div style={{width:"60px",height:"3px",borderRadius:"2px",background:"rgba(129,140,248,0.08)",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(98,fill*100)}%`,borderRadius:"2px",background:"linear-gradient(90deg,rgba(99,102,241,0.55),rgba(165,180,252,0.75))",transition:"width 400ms ease"}}/>
    </div>
  );
}
function StatusIcon({ t }: { t: number }) {
  const p = 0.48 + 0.40 * Math.abs(Math.sin(t*1.12)) * (0.75 + 0.25*Math.sin(t*3.3+0.8));
  return (
    <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
      <div style={{width:"5px",height:"5px",borderRadius:"50%",background:`rgba(129,140,248,${p.toFixed(2)})`,boxShadow:`0 0 ${2+3.5*p}px rgba(99,102,241,0.28)`}}/>
      <span style={{fontSize:"9px",color:"rgba(165,180,252,0.50)",letterSpacing:"0.04em",fontWeight:500}}>LIVE</span>
    </div>
  );
}

/* ─── Animated metric display ────────────────────────────────────── */
function MetricDisplay({ metric, t }: { metric: typeof METRIC_POOL[0]; t: number }) {
  // Smooth drift: ±1.5 for integers, ±0.1 for decimals
  const isDecimal = metric.value % 1 !== 0;
  const drift = isDecimal
    ? (metric.value + 0.12*Math.sin(t*0.16+metric.value*0.4)).toFixed(1)
    : String(Math.round(metric.value + 1.5*Math.sin(t*0.17+metric.value*0.3)));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"2px",marginTop:"5px"}}>
      <span style={{fontSize:"13px",fontWeight:600,color:"rgba(210,215,255,0.90)",letterSpacing:"0.01em",fontVariantNumeric:"tabular-nums",lineHeight:1}}>
        {metric.prefix}{drift}{metric.unit}
      </span>
      <span style={{fontSize:"9px",fontWeight:400,color:"rgba(150,160,210,0.42)",letterSpacing:"0.03em",lineHeight:1}}>
        {metric.label}
      </span>
    </div>
  );
}

/* ─── Signal capsule (elongated, with motion blur feel) ─────────── */
function SignalCapsule({
  cx, cy, angle, opacity, size,
}: { cx: number; cy: number; angle: number; opacity: number; size: number }) {
  const len = size * 5;
  const dx = Math.cos(angle) * len * 0.5;
  const dy = Math.sin(angle) * len * 0.5;
  return (
    <line
      x1={cx - dx} y1={cy - dy}
      x2={cx + dx} y2={cy + dy}
      stroke={`rgba(165,180,252,${opacity.toFixed(2)})`}
      strokeWidth={size}
      strokeLinecap="round"
      filter="url(#hg-glow)"
    />
  );
}

/* ─── Canvas ─────────────────────────────────────────────────────── */
function HeroCanvas({ mouseX, mouseY, isMobile }: { mouseX: number; mouseY: number; isMobile: boolean }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number|null = null;
    const loop = (ts: number) => {
      if (!start) start = ts;
      setT((ts - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ox = isMobile ? 0 : mouseX * 8;
  const oy = isMobile ? 0 : mouseY * 5;

  // Focus cycle: rotates through connections every ~8s
  const FOCUS_DUR = 8.0;
  const focusIdx = Math.floor((t / FOCUS_DUR) % CONNECTIONS_DESKTOP.length);
  const focusProg = (t / FOCUS_DUR) % 1;
  const focusInt = Math.max(0, Math.sin(focusProg * Math.PI));

  // AI pulse: slow breathing that occasionally brightens the whole system
  const aiPulse = Math.max(0, Math.sin(t * 0.20) * Math.sin(t * 0.065));

  // Slow gradient drift (color shift)
  const gradDrift = 0.5 + 0.5 * Math.sin(t * 0.08);

  const panels = isMobile ? PANEL_SLOTS_MOBILE : PANEL_SLOTS_DESKTOP;
  const conns = isMobile ? CONNECTIONS_MOBILE : CONNECTIONS_DESKTOP;
  const fps = isMobile ? FLOW_PATHS.slice(0, 2) : FLOW_PATHS;

  // Mouse SVG coords
  const msx = (mouseX * 0.5 + 0.5) * 900;
  const msy = (mouseY * 0.5 + 0.5) * 860;

  return (
    <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <svg viewBox="0 0 900 860" preserveAspectRatio="xMidYMid slice"
        style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <defs>
          <filter id="hg-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="hg-bg" cx="50%" cy="70%" r="60%">
            <stop offset="0%"   stopColor={`rgba(${Math.round(99+gradDrift*8)},102,241,${(0.038+aiPulse*0.018).toFixed(3)})`}/>
            <stop offset="55%"  stopColor="rgba(99,102,241,0.007)"/>
            <stop offset="100%" stopColor="rgba(99,102,241,0)"/>
          </radialGradient>
          <radialGradient id="hg-top" cx="50%" cy="0%" r="50%">
            <stop offset="0%"   stopColor={`rgba(${Math.round(99-gradDrift*6)},102,${Math.round(241+gradDrift*14)},${(0.026+aiPulse*0.012).toFixed(3)})`}/>
            <stop offset="100%" stopColor="rgba(99,102,241,0)"/>
          </radialGradient>
          <linearGradient id="hg-streak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(165,180,252,0)"/>
            <stop offset="35%"  stopColor="rgba(165,180,252,0.05)"/>
            <stop offset="55%"  stopColor="rgba(165,180,252,0.09)"/>
            <stop offset="100%" stopColor="rgba(165,180,252,0)"/>
          </linearGradient>
        </defs>

        {/* Background gradients */}
        <rect x="0" y="0" width="900" height="860" fill="url(#hg-bg)"/>
        <rect x="0" y="0" width="900" height="860" fill="url(#hg-top)"/>

        {/* Contour arcs */}
        {[
          {cx:450,cy:700,rx:500,ry:280,op:0.011},
          {cx:450,cy:720,rx:680,ry:380,op:0.007},
          {cx:450,cy:740,rx:860,ry:480,op:0.004},
        ].map((a,i) => (
          <ellipse key={i} cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry}
            fill="none" stroke={`rgba(129,140,248,${a.op})`} strokeWidth="0.5"/>
        ))}

        {/* Grid — desktop only, very faint */}
        {!isMobile && [180,360,540,720].map(x => (
          <line key={`gv${x}`} x1={x} y1="0" x2={x} y2="860" stroke="rgba(255,255,255,0.005)" strokeWidth="0.5"/>
        ))}
        {!isMobile && [260,430,600,760].map(y => (
          <line key={`gh${y}`} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.005)" strokeWidth="0.5"/>
        ))}

        {/* Light streak — every ~20s */}
        {(() => {
          const sc = 20.0;
          const sp = (t / sc) % 1;
          const sx = sp * 1100 - 100;
          const so = Math.max(0, Math.sin(sp * Math.PI) * 0.65);
          return (
            <rect x={sx-90} y="0" width="180" height="860"
              fill="url(#hg-streak)" opacity={so}
              transform="skewX(-16)"/>
          );
        })()}

        {/* Atmospheric flow paths */}
        {fps.map(fp => {
          const b = fp.opacity * (0.55 + 0.45 * Math.sin(t*0.42+fp.phase*10));
          return <path key={fp.id} d={fp.d} fill="none"
            stroke={`rgba(129,140,248,${b.toFixed(3)})`} strokeWidth="0.4" strokeLinecap="round"/>;
        })}

        {/* Atmospheric signal dots — desktop only */}
        {!isMobile && fps.map(fp => {
          const c = parseCubic(fp.d);
          const tRaw = ((t/fp.dur+fp.phase)%1+1)%1;
          const pt = cubicBez(tRaw,c.x0,c.y0,c.cx1,c.cy1,c.cx2,c.cy2,c.x1,c.y1);
          const op = 0.28 * Math.sin(tRaw * Math.PI);
          const t2 = Math.max(0, tRaw-0.06);
          const pt2 = cubicBez(t2,c.x0,c.y0,c.cx1,c.cy1,c.cx2,c.cy2,c.x1,c.y1);
          return (
            <g key={`as-${fp.id}`}>
              <circle cx={pt2.x} cy={pt2.y} r="0.8" fill={`rgba(165,180,252,${(op*0.22).toFixed(2)})`} filter="url(#hg-glow)"/>
              <circle cx={pt.x}  cy={pt.y}  r="1.4" fill={`rgba(165,180,252,${op.toFixed(2)})`} filter="url(#hg-glow)"/>
            </g>
          );
        })}

        {/* Connection lines — fade in/out independently */}
        {conns.map((c, ci) => {
          const isFoc = ci === focusIdx % conns.length;
          const breathe = 0.5 + 0.5 * Math.sin(t*(Math.PI*2/c.breatheDur)+c.breathePhase*Math.PI*2);
          const mid = qBez(0.5, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
          const dist = Math.hypot(msx-mid.x, msy-mid.y);
          const mouseBoost = isMobile ? 0 : Math.max(0, 1-dist/240) * 0.09;
          const focBoost = isFoc ? focusInt * 0.13 : 0;
          const lineOp = (0.04 + 0.065*breathe + focBoost + mouseBoost).toFixed(3);
          return (
            <path key={`cl-${c.id}`}
              d={`M ${c.x0} ${c.y0} Q ${c.cpx} ${c.cpy} ${c.x1} ${c.y1}`}
              fill="none" stroke={`rgba(129,140,248,${lineOp})`}
              strokeWidth={isFoc ? "0.70" : "0.40"} strokeLinecap="round"/>
          );
        })}

        {/* Connection signals — capsule-style with motion blur feel */}
        {conns.map((c, ci) => {
          const isFoc = ci === focusIdx % conns.length;
          const breathe = 0.5 + 0.5 * Math.sin(t*(Math.PI*2/c.breatheDur)+c.breathePhase*Math.PI*2);
          const focBoost = isFoc ? focusInt * 0.25 : 0;
          const mid = qBez(0.5, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
          const dist = Math.hypot(msx-mid.x, msy-mid.y);
          const mouseBoost = isMobile ? 0 : Math.max(0, 1-dist/240) * 0.18;

          // Primary signal
          const tRaw = ((t/c.dur+c.phase)%1+1)%1;
          const te = eioSoft(tRaw);
          const sp = qBez(te, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
          const tang = qBezTangent(te, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
          const angle = Math.atan2(tang.dy, tang.dx);

          // Trail (slightly behind)
          const t2r = Math.max(0, tRaw - 0.04);
          const sp2 = qBez(eioSoft(t2r), c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
          const t3r = Math.max(0, tRaw - 0.09);
          const sp3 = qBez(eioSoft(t3r), c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);

          // Secondary signal (offset 0.5)
          const t4r = ((t/c.dur+c.phase+0.5)%1+1)%1;
          const sp4 = qBez(eioSoft(t4r), c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);

          const base = 0.5 + 0.5 * breathe;
          const fade = Math.sin(tRaw * Math.PI);
          const sigOp = Math.min(0.80, (0.40 + focBoost + mouseBoost) * fade * base);
          const t2Op = sigOp * 0.45;
          const t3Op = sigOp * 0.18;
          const secOp = 0.16 * Math.sin(t4r * Math.PI) * base;

          return (
            <g key={`cs-${c.id}`}>
              {/* Far trail */}
              <circle cx={sp3.x} cy={sp3.y} r="0.7" fill={`rgba(165,180,252,${t3Op.toFixed(2)})`} filter="url(#hg-glow)"/>
              {/* Near trail */}
              <circle cx={sp2.x} cy={sp2.y} r="1.0" fill={`rgba(165,180,252,${t2Op.toFixed(2)})`} filter="url(#hg-glow)"/>
              {/* Primary — capsule */}
              <SignalCapsule cx={sp.x} cy={sp.y} angle={angle} opacity={sigOp} size={1.6}/>
              {/* Secondary faint */}
              <circle cx={sp4.x} cy={sp4.y} r="1.0" fill={`rgba(165,180,252,${secOp.toFixed(2)})`} filter="url(#hg-glow)"/>
            </g>
          );
        })}

        {/* AI processing pulse ring */}
        {(() => {
          const pc = 13.0;
          const pp = (t / pc) % 1;
          const pr = pp * 300;
          const po = Math.max(0, Math.sin(pp * Math.PI) * 0.055 * (0.5 + 0.5*Math.sin(t*0.28)));
          return <circle cx="450" cy="370" r={pr} fill="none"
            stroke={`rgba(99,102,241,${po.toFixed(3)})`} strokeWidth="0.55"/>;
        })()}
      </svg>

      {/* ── Panels (HTML) ── */}
      {panels.map((slot, pi) => {
        const metric = METRIC_POOL[slot.metricIdx];
        const px = ox * slot.parallaxFactor;
        const py = oy * slot.parallaxFactor;

        // Breathing
        const breathe = 0.5 + 0.5 * Math.sin(t*0.50+slot.breatheOffset);
        const panelOp = 0.78 + 0.16 * breathe;

        // Focus
        const isFoc = pi === focusIdx % panels.length;
        const focGlow = isFoc ? focusInt * 0.18 : 0;

        // Mouse proximity
        const panelCX = parseFloat(slot.x) / 100 * 900;
        const panelCY = parseFloat(slot.y) / 100 * 860;
        const dist = Math.hypot(msx - panelCX, msy - panelCY);
        const mouseProx = isMobile ? 0 : Math.max(0, 1 - dist/190);
        const mouseGlow = mouseProx * 0.14;
        const mouseScale = 1 + mouseProx * 0.016;

        const totalGlow = focGlow + mouseGlow;
        const scale = (isFoc ? 1 + focusInt*0.010 : 1) * mouseScale;

        return (
          <motion.div key={slot.id}
            style={{position:"absolute",left:slot.x,top:slot.y,zIndex:1,willChange:"transform",pointerEvents:"none"}}
            animate={{y:[0,slot.floatY,0]}}
            transition={{duration:slot.floatDur,delay:slot.delay,repeat:Infinity,ease:"easeInOut",repeatType:"mirror"}}
          >
            <div style={{
              transform:`translate(${px}px,${py}px) scale(${scale.toFixed(4)})`,
              transition:"transform 550ms cubic-bezier(0.22,1,0.36,1)",
              padding:"9px 13px",
              borderRadius:"12px",
              background:`rgba(7,7,18,${(0.56+totalGlow*0.22).toFixed(2)})`,
              backdropFilter:"blur(20px)",
              WebkitBackdropFilter:"blur(20px)",
              border:`1px solid rgba(129,140,248,${(0.08+totalGlow*0.90).toFixed(2)})`,
              boxShadow: totalGlow > 0.015
                ? `inset 0 1px 0 rgba(255,255,255,0.055),0 8px 28px rgba(0,0,0,0.22),0 0 18px rgba(99,102,241,${(totalGlow*0.30).toFixed(2)})`
                : "inset 0 1px 0 rgba(255,255,255,0.035),0 8px 24px rgba(0,0,0,0.18)",
              display:"flex",flexDirection:"column",minWidth:"98px",
              opacity:panelOp,
            }}>
              {metric.icon === "trend"  && <TrendIcon t={t}/>}
              {metric.icon === "pulse"  && <PulseIcon t={t}/>}
              {metric.icon === "bar"    && <BarIcon t={t}/>}
              {metric.icon === "status" && <StatusIcon t={t}/>}
              <MetricDisplay metric={metric} t={t}/>
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
    const id = setInterval(() => setIndex(p => (p+1)%PHRASES.length), PHRASE_DURATION);
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX-rect.left)/rect.width-0.5)*2,
      y: ((e.clientY-rect.top)/rect.height-0.5)*2,
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isMobile) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isMobile]);

  return (
    <section ref={sectionRef} aria-label="Hero" style={{
      position:"relative",overflow:"hidden",minHeight:"auto",
      display:"flex",flexDirection:"column",alignItems:"center",
      marginTop:"-81px",paddingTop:"81px",
    }}>
      {/* Atmospheric glow */}
      <motion.div aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2.2,ease:"easeOut"}}
        style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{
          position:"absolute",left:"50%",top:"-8%",transform:"translateX(-50%)",
          height:"500px",width:"700px",borderRadius:"9999px",
          background:"radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.032) 0%,rgba(99,102,241,0.005) 65%,transparent 85%)",
        }}/>
        <div className="bg-grid" style={{position:"absolute",inset:0,opacity:0.055}}/>
      </motion.div>

      {/* Canvas */}
      <div style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none",display:"flex",justifyContent:"center"}}>
        <div style={{position:"relative",width:"100%",maxWidth:"1000px",height:"100%",flexShrink:0}}>
          <HeroCanvas mouseX={mousePos.x} mouseY={mousePos.y} isMobile={isMobile}/>
        </div>
      </div>

      {/* Readability vignette */}
      <div aria-hidden="true" style={{
        position:"absolute",inset:0,zIndex:1,pointerEvents:"none",
        background:"radial-gradient(ellipse 64% 58% at 50% 38%,rgba(5,5,5,0.44) 0%,rgba(5,5,5,0.16) 55%,transparent 80%)",
      }}/>

      {/* Content */}
      <div style={{
        position:"relative",zIndex:2,maxWidth:"1280px",width:"100%",
        margin:"0 auto",padding:"80px 24px 120px",
        textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",
        pointerEvents:"none",
      }}>
        <motion.h1
          initial={{opacity:0,y:22}} animate={{opacity:1,y:0}}
          transition={{duration:0.80,ease:[0.22,1,0.36,1],delay:0.16}}
          style={{
            fontSize:"clamp(36px,5vw,60px)",fontWeight:400,lineHeight:1.2,
            letterSpacing:"-0.025em",color:"#f5f5f7",
            margin:"0 0 20px",width:"100%",maxWidth:"min(680px,90%)",
          }}
        >
          <span style={{display:"block"}}>We build AI systems for</span>
          <span style={{display:"block",position:"relative",height:"1.2em",overflow:"hidden",marginTop:"10px"}}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={index}
                style={{
                  position:"absolute",inset:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  backgroundImage:"linear-gradient(90deg,#818cf8 0%,#a78bfa 50%,#818cf8 100%)",
                  backgroundSize:"200% 100%",
                  WebkitBackgroundClip:"text",backgroundClip:"text",
                  WebkitTextFillColor:"transparent",color:"transparent",
                }}
                initial={{y:"108%",opacity:0,filter:"blur(6px)"}}
                animate={{y:"0%",opacity:1,filter:"blur(0px)"}}
                exit={{y:"-108%",opacity:0,filter:"blur(6px)"}}
                transition={{duration:TRANSITION_MS/1000,ease:[0.22,1,0.36,1]}}
              >
                {PHRASES[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
          transition={{duration:0.70,ease:[0.22,1,0.36,1],delay:0.28}}
          style={{
            fontSize:"clamp(15px,2vw,18px)",fontWeight:300,lineHeight:1.70,
            color:"rgba(255,255,255,0.80)",
            width:"100%",maxWidth:"min(550px,90%)",
            marginBottom:"40px",marginTop:"-10px",
          }}
        >
          From content execution to lead handling to internal workflows, we design AI-powered systems that help companies{" "}
          <strong style={{fontWeight:500,color:"rgb(255,255,255)"}}>scale with less manual work.</strong>
        </motion.p>

        <motion.div
          initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
          transition={{duration:0.70,ease:[0.22,1,0.36,1],delay:0.38}}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"30px",flexWrap:"wrap",pointerEvents:"auto"}}
        >
          <HeroPrimaryBtn href="#contact" label="Book a Free Call"/>
          <HeroSecondaryBtn href="#how-it-works" label="See How It Works"/>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Buttons ────────────────────────────────────────────────────── */
function HeroPrimaryBtn({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",
        width:"clamp(190px,75vw,210px)",padding:"14px 20px",borderRadius:"16px",
        fontSize:"14px",fontWeight:400,letterSpacing:"0.02em",
        textDecoration:"none",color:"rgba(255,255,255,0.92)",
        background:hov?"linear-gradient(170deg,#818cf8 0%,#6366f1 50%,#4f46e5 100%)":"linear-gradient(170deg,#5b5ef4 0%,#4338ca 100%)",
        boxShadow:hov?"inset 0 1px 0 0 rgba(255,255,255,0.28),inset 0 -1px 0 0 rgba(0,0,0,0.30),0 8px 24px -4px rgba(79,70,229,0.55)":"inset 0 1px 0 0 rgba(255,255,255,0.14),inset 0 -1px 0 0 rgba(0,0,0,0.30)",
        border:hov?"1px solid rgba(255,255,255,0.18)":"1px solid rgba(255,255,255,0.10)",
        transform:hov?"scale(1.03)":"scale(1)",
        transition:"all 280ms cubic-bezier(0.22,1,0.36,1)",
        overflow:"hidden",whiteSpace:"nowrap",
      }}
    >
      <span aria-hidden="true" style={{position:"absolute",top:0,bottom:0,width:"60%",left:hov?"120%":"-60%",transform:"skewX(-12deg)",background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 20%,rgba(255,255,255,0.28) 50%,rgba(255,255,255,0.06) 80%,transparent 100%)",transition:"left 550ms cubic-bezier(0.22,1,0.36,1)",pointerEvents:"none"}}/>
      <span aria-hidden="true" style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(to right,transparent,rgba(255,255,255,0.40),transparent)",pointerEvents:"none"}}/>
      <span style={{transform:hov?"translateX(2px)":"translateX(0)",transition:"transform 280ms cubic-bezier(0.22,1,0.36,1)",display:"inline-block"}}>{label}</span>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{transform:hov?"translateX(2px)":"translateX(0)",transition:"transform 200ms",flexShrink:0}}>
        <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}

function HeroSecondaryBtn({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  return (
    <a href={href}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPress(false);}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
      style={{
        position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",
        width:"clamp(190px,75vw,210px)",padding:"14px 20px",borderRadius:"16px",
        fontSize:"14px",fontWeight:400,textDecoration:"none",overflow:"hidden",whiteSpace:"nowrap",
        color:hov?"#f5f5f7":"#d4d4d8",
        background:hov?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)",
        border:hov?"1px solid rgba(255,255,255,0.22)":"1px solid rgba(255,255,255,0.14)",
        boxShadow:hov?"inset 0 1px 0 0 rgba(255,255,255,0.10),0 2px 8px rgba(0,0,0,0.20)":"inset 0 1px 0 0 rgba(255,255,255,0.06)",
        transform:`scale(${press?0.98:hov?1.015:1})`,
        transition:press?"transform 100ms ease":"all 240ms cubic-bezier(0,0,0.2,1)",
        backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
      }}
    >
      <span aria-hidden="true" style={{position:"absolute",top:0,bottom:0,width:"50%",left:hov?"110%":"-50%",transform:"skewX(-12deg)",background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.04) 50%,transparent 100%)",transition:"left 600ms cubic-bezier(0,0,0.2,1)",pointerEvents:"none"}}/>
      <span aria-hidden="true" style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(to right,transparent,rgba(255,255,255,0.12),transparent)",pointerEvents:"none"}}/>
      {label}
    </a>
  );
}
