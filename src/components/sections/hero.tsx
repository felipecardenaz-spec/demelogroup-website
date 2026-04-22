"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Config ─────────────────────────────────────────────────────── */
const PHRASES = ["marketing teams", "sales pipelines", "business operations"];
const PHRASE_DURATION = 2800;
const TRANSITION_MS = 500;

/* ─── Metric pool ────────────────────────────────────────────────── */
const METRIC_POOL = [
  { value: 32,  unit: "%",  prefix: "+", label: "conversion rate",      icon: "trend"  },
  { value: 41,  unit: "%",  prefix: "+", label: "lead response speed",  icon: "pulse"  },
  { value: 18,  unit: "h",  prefix: "−", label: "manual work / week",   icon: "status" },
  { value: 78,  unit: "%",  prefix: "",  label: "tasks automated",      icon: "bar"    },
  { value: 2.4, unit: "x",  prefix: "+", label: "qualified leads",      icon: "trend"  },
  { value: 27,  unit: "%",  prefix: "+", label: "pipeline value",       icon: "pulse"  },
  { value: 35,  unit: "%",  prefix: "+", label: "content performance",  icon: "bar"    },
  { value: 22,  unit: "%",  prefix: "−", label: "operational overhead", icon: "status" },
];

/* ─── Orbital card layout ────────────────────────────────────────── */
// Cards orbit around the hero content block.
// Positions are % of the 1000px content container.
// The hero text sits roughly in the horizontal center (30%–70%) and
// vertically from ~15% to ~65%. Cards are placed around that zone.
//
// Desktop: 8 cards in a loose elliptical orbit
// Each card has a slow individual drift (orbitR px, orbitDur seconds)
const CARDS_DESKTOP = [
  // Upper-left cluster
  { id: "c1", cx: "5%",  cy: "18%", orbitR: 12, orbitDur: 18, orbitPhase: 0.00, pFactor: 0.50, bOff: 0.0, mOff: 0 },
  { id: "c2", cx: "14%", cy: "52%", orbitR: 10, orbitDur: 22, orbitPhase: 0.60, pFactor: 0.60, bOff: 1.8, mOff: 3 },
  // Upper-right cluster
  { id: "c3", cx: "76%", cy: "14%", orbitR: 11, orbitDur: 20, orbitPhase: 0.25, pFactor: 0.55, bOff: 3.2, mOff: 1 },
  { id: "c4", cx: "80%", cy: "44%", orbitR: 13, orbitDur: 24, orbitPhase: 0.75, pFactor: 0.45, bOff: 5.0, mOff: 2 },
  // Lower-left cluster
  { id: "c5", cx: "4%",  cy: "72%", orbitR: 10, orbitDur: 19, orbitPhase: 0.40, pFactor: 0.65, bOff: 2.4, mOff: 4 },
  { id: "c6", cx: "20%", cy: "82%", orbitR: 12, orbitDur: 23, orbitPhase: 0.15, pFactor: 0.40, bOff: 4.1, mOff: 7 },
  // Lower-right cluster
  { id: "c7", cx: "72%", cy: "76%", orbitR: 11, orbitDur: 21, orbitPhase: 0.55, pFactor: 0.55, bOff: 0.9, mOff: 5 },
  { id: "c8", cx: "82%", cy: "64%", orbitR: 9,  orbitDur: 17, orbitPhase: 0.85, pFactor: 0.70, bOff: 3.6, mOff: 6 },
];

// Mobile: 4 cards, placed at the sides so they don't overlap the text
const CARDS_MOBILE = [
  { id: "m1", cx: "1%",  cy: "20%", orbitR: 5, orbitDur: 20, orbitPhase: 0.00, pFactor: 0, bOff: 0.0, mOff: 0 },
  { id: "m2", cx: "68%", cy: "16%", orbitR: 5, orbitDur: 24, orbitPhase: 0.25, pFactor: 0, bOff: 2.1, mOff: 1 },
  { id: "m3", cx: "1%",  cy: "56%", orbitR: 5, orbitDur: 18, orbitPhase: 0.50, pFactor: 0, bOff: 4.3, mOff: 3 },
  { id: "m4", cx: "70%", cy: "50%", orbitR: 5, orbitDur: 22, orbitPhase: 0.75, pFactor: 0, bOff: 1.5, mOff: 2 },
];

/* ─── Connection paths ───────────────────────────────────────────── */
// SVG 900×860 viewBox. Card anchor SVG coords (cx% × 900, cy% × 860):
//   c1: (45,155)   c2: (126,447)  c3: (684,120)  c4: (720,378)
//   c5: (36,619)   c6: (180,705)  c7: (648,654)  c8: (738,550)
// Connections form a loose ring around the center (450,430)
const CONNS_DESKTOP = [
  // c1 → c3: top arc
  { id: "k1", x0:  45, y0: 155, x1: 684, y1: 120, cpx: 360, cpy:  30, dur: 10.0, phase: 0.00, bDur: 8.0, bPh: 0.00 },
  // c3 → c4: right drop
  { id: "k2", x0: 684, y0: 120, x1: 720, y1: 378, cpx: 820, cpy: 249, dur:  8.5, phase: 0.20, bDur: 7.0, bPh: 0.30 },
  // c4 → c8: right lower
  { id: "k3", x0: 720, y0: 378, x1: 738, y1: 550, cpx: 840, cpy: 464, dur:  7.0, phase: 0.40, bDur: 9.0, bPh: 0.60 },
  // c8 → c7: bottom right
  { id: "k4", x0: 738, y0: 550, x1: 648, y1: 654, cpx: 760, cpy: 640, dur:  9.0, phase: 0.55, bDur: 6.5, bPh: 0.80 },
  // c7 → c6: bottom arc
  { id: "k5", x0: 648, y0: 654, x1: 180, y1: 705, cpx: 414, cpy: 800, dur: 11.0, phase: 0.65, bDur: 8.5, bPh: 0.10 },
  // c6 → c5: bottom left
  { id: "k6", x0: 180, y0: 705, x1:  36, y1: 619, cpx:  60, cpy: 700, dur:  8.0, phase: 0.75, bDur: 7.5, bPh: 0.45 },
  // c5 → c2: left side
  { id: "k7", x0:  36, y0: 619, x1: 126, y1: 447, cpx: -40, cpy: 533, dur:  9.5, phase: 0.85, bDur: 8.0, bPh: 0.70 },
  // c2 → c1: left upper
  { id: "k8", x0: 126, y0: 447, x1:  45, y1: 155, cpx: -30, cpy: 301, dur:  8.0, phase: 0.10, bDur: 7.0, bPh: 0.20 },
];

const CONNS_MOBILE = [
  { id: "km1", x0:  9, y0: 172, x1: 612, y1: 138, cpx: 310, cpy:  60, dur: 10.0, phase: 0.00, bDur: 8.0, bPh: 0.00 },
  { id: "km2", x0: 612, y0: 138, x1: 630, y1: 430, cpx: 740, cpy: 284, dur:  8.5, phase: 0.50, bDur: 7.0, bPh: 0.50 },
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
function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function eioSoft(t: number) { const e = eio(t); return e + 0.035*Math.sin(e*Math.PI); }

/* ─── Mini visualizations ────────────────────────────────────────── */
function TrendLine({ t }: { t: number }) {
  const base = [14,11,13,8,10,5,7,2];
  const pts = base.map((y,i) => [i*7, Math.max(0, y + 1.8*Math.sin(t*0.38+i*0.9) + 0.5*Math.sin(t*1.2+i*1.6))]);
  const d = pts.map(([x,y],i) => `${i===0?"M":"L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg width="50" height="18" viewBox="0 0 50 18" fill="none" style={{display:"block"}}>
      <path d={d} stroke="rgba(129,140,248,0.65)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill="rgba(165,180,252,0.90)"/>
    </svg>
  );
}
function PulseBars({ t }: { t: number }) {
  const base = [3,6,4,9,7,11,5,8,3,10,6,4];
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:"2px",height:"14px"}}>
      {base.map((h,i) => {
        const v = h*(0.5+0.5*Math.abs(Math.sin(t*1.5+i*0.65)*0.4+Math.sin(t*0.9+i*1.2)*0.3+0.3));
        const op = 0.35+0.45*Math.abs(Math.sin(t*1.0+i*0.5));
        return <div key={i} style={{width:"2px",height:`${Math.max(2,v)}px`,borderRadius:"1px",background:`rgba(129,140,248,${op.toFixed(2)})`}}/>;
      })}
    </div>
  );
}
function ProgressBar({ t }: { t: number }) {
  const fill = 0.65+0.20*Math.sin(t*0.28)+0.05*Math.sin(t*2.1+0.5);
  return (
    <div style={{width:"56px",height:"3px",borderRadius:"2px",background:"rgba(129,140,248,0.12)",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(97,fill*100)}%`,borderRadius:"2px",background:"linear-gradient(90deg,rgba(99,102,241,0.70),rgba(165,180,252,0.90))",transition:"width 500ms ease"}}/>
    </div>
  );
}
function StatusDot({ t }: { t: number }) {
  const p = 0.55+0.38*Math.abs(Math.sin(t*1.15))*(0.7+0.3*Math.sin(t*3.5+0.8));
  return (
    <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
      <div style={{width:"6px",height:"6px",borderRadius:"50%",background:`rgba(129,140,248,${p.toFixed(2)})`,boxShadow:`0 0 ${3+4*p}px rgba(99,102,241,0.40)`}}/>
      <span style={{fontSize:"9px",color:"rgba(165,180,252,0.65)",letterSpacing:"0.06em",fontWeight:600}}>LIVE</span>
    </div>
  );
}

/* ─── Metric value display ───────────────────────────────────────── */
function MetricValue({ metric, t }: { metric: typeof METRIC_POOL[0]; t: number }) {
  const isDecimal = metric.value % 1 !== 0;
  const drift = isDecimal
    ? (metric.value + 0.10*Math.sin(t*0.18+metric.value*0.4)).toFixed(1)
    : String(Math.round(metric.value + 1.2*Math.sin(t*0.19+metric.value*0.3)));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"3px",marginTop:"6px"}}>
      <span style={{
        fontSize:"15px",fontWeight:700,
        color:"rgba(235,238,255,0.96)",
        letterSpacing:"-0.01em",fontVariantNumeric:"tabular-nums",lineHeight:1,
      }}>
        {metric.prefix}{drift}{metric.unit}
      </span>
      <span style={{
        fontSize:"9.5px",fontWeight:400,
        color:"rgba(160,168,220,0.60)",
        letterSpacing:"0.04em",lineHeight:1.3,
        textTransform:"uppercase",
      }}>
        {metric.label}
      </span>
    </div>
  );
}

/* ─── Signal capsule ─────────────────────────────────────────────── */
function Signal({ cx, cy, angle, op, size }: { cx:number; cy:number; angle:number; op:number; size:number }) {
  const len = size * 6;
  const dx = Math.cos(angle)*len*0.5, dy = Math.sin(angle)*len*0.5;
  return (
    <line x1={cx-dx} y1={cy-dy} x2={cx+dx} y2={cy+dy}
      stroke={`rgba(165,180,252,${op.toFixed(2)})`}
      strokeWidth={size} strokeLinecap="round" filter="url(#glow)"/>
  );
}

/* ─── Background SVG (full-width atmospheric layer) ─────────────── */
function BgSvg({ t, isMobile }: { t: number; isMobile: boolean }) {
  const aiPulse = Math.max(0, Math.sin(t*0.22)*Math.sin(t*0.07));
  const gd = 0.5+0.5*Math.sin(t*0.09);

  // Orbital guide arcs — subtle concentric ellipses around center
  const arcs = [
    { rx: 340, ry: 200, op: 0.028 },
    { rx: 460, ry: 280, op: 0.018 },
    { rx: 560, ry: 340, op: 0.012 },
  ];

  return (
    <svg viewBox="0 0 900 860" preserveAspectRatio="xMidYMid slice"
      style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
      <defs>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="bgGrad" cx="50%" cy="55%" r="65%">
          <stop offset="0%"   stopColor={`rgba(${Math.round(88+gd*12)},92,241,${(0.055+aiPulse*0.025).toFixed(3)})`}/>
          <stop offset="50%"  stopColor="rgba(88,92,241,0.010)"/>
          <stop offset="100%" stopColor="rgba(88,92,241,0)"/>
        </radialGradient>
        <radialGradient id="topGrad" cx="50%" cy="0%" r="55%">
          <stop offset="0%"   stopColor={`rgba(${Math.round(88-gd*8)},92,${Math.round(241+gd*18)},${(0.038+aiPulse*0.015).toFixed(3)})`}/>
          <stop offset="100%" stopColor="rgba(88,92,241,0)"/>
        </radialGradient>
        <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(165,180,252,0)"/>
          <stop offset="40%"  stopColor="rgba(165,180,252,0.06)"/>
          <stop offset="60%"  stopColor="rgba(165,180,252,0.11)"/>
          <stop offset="100%" stopColor="rgba(165,180,252,0)"/>
        </linearGradient>
      </defs>

      {/* Atmospheric gradients */}
      <rect x="0" y="0" width="900" height="860" fill="url(#bgGrad)"/>
      <rect x="0" y="0" width="900" height="860" fill="url(#topGrad)"/>

      {/* Orbital guide arcs — centered at (450, 430) */}
      {arcs.map((a,i) => (
        <ellipse key={i} cx="450" cy="430" rx={a.rx} ry={a.ry}
          fill="none" stroke={`rgba(129,140,248,${a.op})`} strokeWidth="0.6"
          strokeDasharray="4 8"/>
      ))}

      {/* Faint grid — desktop only */}
      {!isMobile && [180,360,540,720].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="860" stroke="rgba(255,255,255,0.006)" strokeWidth="0.5"/>
      ))}
      {!isMobile && [215,430,645,760].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.006)" strokeWidth="0.5"/>
      ))}

      {/* Light streak every ~22s */}
      {(() => {
        const sp = (t/22)%1;
        const sx = sp*1100-100;
        const so = Math.max(0, Math.sin(sp*Math.PI)*0.70);
        return <rect x={sx-80} y="0" width="160" height="860" fill="url(#streakGrad)" opacity={so} transform="skewX(-14)"/>;
      })()}

      {/* Atmospheric flow paths */}
      {!isMobile && [
        { d:"M 40 580 C 180 440, 480 290, 820 150", dur:8.5,  ph:0.00, op:0.050 },
        { d:"M 80 380 C 260 260, 540 420, 800 290", dur:11.5, ph:0.30, op:0.035 },
        { d:"M 0  640 C 240 560, 590 530, 900 460", dur:14.0, ph:0.60, op:0.030 },
        { d:"M 60 200 C 290 160, 570 240, 860 370", dur:10.5, ph:0.15, op:0.030 },
        { d:"M 540 510 C 640 450, 750 470, 880 530", dur:7.5, ph:0.50, op:0.040 },
      ].map((fp,i) => {
        const b = fp.op*(0.55+0.45*Math.sin(t*0.44+fp.ph*10));
        return <path key={i} d={fp.d} fill="none" stroke={`rgba(129,140,248,${b.toFixed(3)})`} strokeWidth="0.5" strokeLinecap="round"/>;
      })}

      {/* AI pulse ring */}
      {(() => {
        const pp = (t/14)%1;
        const pr = pp*320;
        const po = Math.max(0, Math.sin(pp*Math.PI)*0.065*(0.5+0.5*Math.sin(t*0.30)));
        return <circle cx="450" cy="430" r={pr} fill="none" stroke={`rgba(99,102,241,${po.toFixed(3)})`} strokeWidth="0.6"/>;
      })()}
    </svg>
  );
}

/* ─── Connection + signal layer (centered, 1000px wide) ─────────── */
function ConnSvg({ t, conns, isMobile, msx, msy, focusIdx, focusInt }: {
  t: number;
  conns: typeof CONNS_DESKTOP;
  isMobile: boolean;
  msx: number; msy: number;
  focusIdx: number; focusInt: number;
}) {
  return (
    <svg viewBox="0 0 900 860" preserveAspectRatio="xMidYMid meet"
      style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible"}}>
      {conns.map((c, ci) => {
        const isFoc = ci === focusIdx % conns.length;
        const breathe = 0.5+0.5*Math.sin(t*(Math.PI*2/c.bDur)+c.bPh*Math.PI*2);
        const mid = qBez(0.5, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
        const dist = Math.hypot(msx-mid.x, msy-mid.y);
        const mBoost = isMobile ? 0 : Math.max(0, 1-dist/260)*0.10;
        const fBoost = isFoc ? focusInt*0.14 : 0;
        const lineOp = (0.06+0.08*breathe+fBoost+mBoost).toFixed(3);

        // Signal
        const tRaw = ((t/c.dur+c.phase)%1+1)%1;
        const te = eioSoft(tRaw);
        const sp = qBez(te, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
        const tang = qBezTangent(te, c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
        const angle = Math.atan2(tang.dy, tang.dx);
        const t2r = Math.max(0, tRaw-0.04);
        const sp2 = qBez(eioSoft(t2r), c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
        const t3r = Math.max(0, tRaw-0.09);
        const sp3 = qBez(eioSoft(t3r), c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);
        const t4r = ((t/c.dur+c.phase+0.5)%1+1)%1;
        const sp4 = qBez(eioSoft(t4r), c.x0, c.y0, c.cpx, c.cpy, c.x1, c.y1);

        const base = 0.5+0.5*breathe;
        const fade = Math.sin(tRaw*Math.PI);
        const sFocBoost = isFoc ? focusInt*0.28 : 0;
        const sMBoost = isMobile ? 0 : Math.max(0, 1-dist/260)*0.20;
        const sigOp = Math.min(0.85, (0.45+sFocBoost+sMBoost)*fade*base);
        const t2Op = sigOp*0.42;
        const t3Op = sigOp*0.18;
        const secOp = 0.18*Math.sin(t4r*Math.PI)*base;

        return (
          <g key={c.id}>
            <path d={`M ${c.x0} ${c.y0} Q ${c.cpx} ${c.cpy} ${c.x1} ${c.y1}`}
              fill="none" stroke={`rgba(129,140,248,${lineOp})`}
              strokeWidth={isFoc ? "0.80" : "0.45"} strokeLinecap="round"/>
            <circle cx={sp3.x} cy={sp3.y} r="0.8" fill={`rgba(165,180,252,${t3Op.toFixed(2)})`} filter="url(#glow)"/>
            <circle cx={sp2.x} cy={sp2.y} r="1.1" fill={`rgba(165,180,252,${t2Op.toFixed(2)})`} filter="url(#glow)"/>
            <Signal cx={sp.x} cy={sp.y} angle={angle} op={sigOp} size={1.8}/>
            <circle cx={sp4.x} cy={sp4.y} r="1.1" fill={`rgba(165,180,252,${secOp.toFixed(2)})`} filter="url(#glow)"/>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── HeroCanvas ─────────────────────────────────────────────────── */
function HeroCanvas({ mouseX, mouseY, isMobile, metricCycle }: {
  mouseX: number; mouseY: number; isMobile: boolean; metricCycle: number;
}) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number, start: number|null = null;
    const loop = (ts: number) => { if (!start) start=ts; setT((ts-start)/1000); raf=requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ox = isMobile ? 0 : mouseX*9;
  const oy = isMobile ? 0 : mouseY*6;

  const cards = isMobile ? CARDS_MOBILE : CARDS_DESKTOP;
  const conns = isMobile ? CONNS_MOBILE : CONNS_DESKTOP;

  const FOCUS_DUR = 9.0;
  const focusIdx = Math.floor((t/FOCUS_DUR) % conns.length);
  const focusProg = (t/FOCUS_DUR)%1;
  const focusInt = Math.max(0, Math.sin(focusProg*Math.PI));

  // Mouse in SVG coords (for proximity calc)
  const msx = (mouseX*0.5+0.5)*900;
  const msy = (mouseY*0.5+0.5)*860;

  return (
    <div aria-hidden="true" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>

      {/* Full-width atmospheric background */}
      <BgSvg t={t} isMobile={isMobile}/>

      {/* Centered content layer: connections + cards */}
      <div style={{position:"absolute",inset:0,display:"flex",justifyContent:"center",pointerEvents:"none"}}>
        <div style={{position:"relative",width:"100%",maxWidth:"1000px",height:"100%"}}>

          {/* Connection + signal SVG */}
          <ConnSvg t={t} conns={conns} isMobile={isMobile} msx={msx} msy={msy} focusIdx={focusIdx} focusInt={focusInt}/>

          {/* Metric cards */}
          {cards.map((slot, pi) => {
            const metricIdx = (slot.mOff + metricCycle) % METRIC_POOL.length;
            const metric = METRIC_POOL[metricIdx];

            const orbitAngle = (t/slot.orbitDur + slot.orbitPhase)*Math.PI*2;
            const orbitX = Math.cos(orbitAngle)*slot.orbitR;
            const orbitY = Math.sin(orbitAngle)*slot.orbitR*0.55;

            const px = ox*slot.pFactor;
            const py = oy*slot.pFactor;

            const breathe = 0.5+0.5*Math.sin(t*0.52+slot.bOff);
            const panelOp = 0.88+0.10*breathe;

            const isFoc = pi === focusIdx % cards.length;
            const focGlow = isFoc ? focusInt*0.22 : 0;

            // Mouse proximity
            const cxSvg = parseFloat(slot.cx)/100*900;
            const cySvg = parseFloat(slot.cy)/100*860;
            const dist = Math.hypot(msx-cxSvg, msy-cySvg);
            const mProx = isMobile ? 0 : Math.max(0, 1-dist/200);
            const mGlow = mProx*0.18;
            const mScale = 1+mProx*0.018;

            const totalGlow = focGlow+mGlow;
            const scale = (isFoc ? 1+focusInt*0.012 : 1)*mScale;

            const borderOp = (0.14+totalGlow*0.80).toFixed(2);
            const bgAlpha = (0.62+totalGlow*0.18).toFixed(2);
            const glowStr = totalGlow > 0.02
              ? `inset 0 1px 0 rgba(255,255,255,0.08),0 8px 32px rgba(0,0,0,0.28),0 0 20px rgba(99,102,241,${(totalGlow*0.35).toFixed(2)})`
              : "inset 0 1px 0 rgba(255,255,255,0.05),0 6px 20px rgba(0,0,0,0.22)";

            const cardStyle: React.CSSProperties = isMobile ? {
              padding:"7px 10px",
              borderRadius:"10px",
              background:`rgba(8,8,22,${bgAlpha})`,
              backdropFilter:"blur(18px)",
              WebkitBackdropFilter:"blur(18px)",
              border:`1px solid rgba(129,140,248,${borderOp})`,
              boxShadow:glowStr,
              display:"flex",flexDirection:"column",
              minWidth:"82px",maxWidth:"92px",
              overflow:"hidden",
            } : {
              padding:"10px 14px",
              borderRadius:"12px",
              background:`rgba(8,8,22,${bgAlpha})`,
              backdropFilter:"blur(22px)",
              WebkitBackdropFilter:"blur(22px)",
              border:`1px solid rgba(129,140,248,${borderOp})`,
              boxShadow:glowStr,
              display:"flex",flexDirection:"column",
              minWidth:"104px",
              overflow:"hidden",
            };

            return (
              <div key={slot.id} style={{
                position:"absolute",
                left:slot.cx, top:slot.cy,
                zIndex:2, pointerEvents:"none",
                transform:`translate(${orbitX+px}px,${orbitY+py}px)`,
                willChange:"transform",
              }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${slot.id}-${metricIdx}`}
                    initial={{ opacity:0, scale:0.86, filter:"blur(8px)" }}
                    animate={{ opacity:panelOp, scale:scale, filter:"blur(0px)" }}
                    exit={{ opacity:0, scale:0.86, filter:"blur(8px)" }}
                    transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
                    style={cardStyle}
                  >
                    {/* Top shimmer line */}
                    <span aria-hidden="true" style={{
                      position:"absolute",top:0,left:0,right:0,height:"1px",
                      background:"linear-gradient(to right,transparent,rgba(165,180,252,0.22),transparent)",
                      pointerEvents:"none",
                    }}/>
                    {metric.icon === "trend"  && <TrendLine t={t}/>}
                    {metric.icon === "pulse"  && <PulseBars t={t}/>}
                    {metric.icon === "bar"    && <ProgressBar t={t}/>}
                    {metric.icon === "status" && <StatusDot t={t}/>}
                    <MetricValue metric={metric} t={t}/>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────── */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x:0, y:0 });
  const [isMobile, setIsMobile] = useState(false);
  const [metricCycle, setMetricCycle] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive:true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setIndex(p => (p+1)%PHRASES.length), PHRASE_DURATION);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setMetricCycle(c => c+1), 4500);
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
    el.addEventListener("mousemove", handleMouseMove, { passive:true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isMobile]);

  return (
    <section ref={sectionRef} aria-label="Hero" style={{
      position:"relative", overflow:"hidden", minHeight:"580px",
      display:"flex", flexDirection:"column", alignItems:"center",
      marginTop:"-81px", paddingTop:"81px", paddingBottom:"0",
    }}>
      {/* Atmospheric glow overlay */}
      <motion.div aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2.4,ease:"easeOut"}}
        style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{
          position:"absolute",left:"50%",top:"-10%",transform:"translateX(-50%)",
          height:"520px",width:"720px",borderRadius:"9999px",
          background:"radial-gradient(ellipse at 50% 0%,rgba(88,92,241,0.040) 0%,rgba(88,92,241,0.006) 65%,transparent 85%)",
        }}/>
        <div className="bg-grid" style={{position:"absolute",inset:0,opacity:0.060}}/>
      </motion.div>

      {/* Canvas */}
      <div style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <HeroCanvas mouseX={mousePos.x} mouseY={mousePos.y} isMobile={isMobile} metricCycle={metricCycle}/>
      </div>

      {/* Readability vignette — keeps text legible over the orbit */}
      <div aria-hidden="true" style={{
        position:"absolute",inset:0,zIndex:1,pointerEvents:"none",
        background:"radial-gradient(ellipse 55% 52% at 50% 40%,rgba(4,4,12,0.52) 0%,rgba(4,4,12,0.18) 55%,transparent 80%)",
      }}/>

      {/* Hero content */}
      <div style={{
        position:"relative",zIndex:2,maxWidth:"1280px",width:"100%",
        margin:"0 auto",padding:"80px 24px 48px",
        textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",
        pointerEvents:"none",
      }}>
        <motion.h1
          initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
          transition={{duration:0.85,ease:[0.22,1,0.36,1],delay:0.18}}
          style={{
            fontSize:"clamp(36px,5vw,62px)",fontWeight:400,lineHeight:1.18,
            letterSpacing:"-0.028em",color:"#f5f5f7",
            margin:"0 0 22px",width:"100%",maxWidth:"min(700px,90%)",
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
                initial={{y:"110%",opacity:0,filter:"blur(6px)"}}
                animate={{y:"0%",opacity:1,filter:"blur(0px)"}}
                exit={{y:"-110%",opacity:0,filter:"blur(6px)"}}
                transition={{duration:TRANSITION_MS/1000,ease:[0.22,1,0.36,1]}}
              >
                {PHRASES[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
          transition={{duration:0.72,ease:[0.22,1,0.36,1],delay:0.30}}
          style={{
            fontSize:"clamp(15px,2vw,18px)",fontWeight:300,lineHeight:1.72,
            color:"rgba(255,255,255,0.78)",
            width:"100%",maxWidth:"min(560px,90%)",
            marginBottom:"42px",marginTop:"-8px",
          }}
        >
          From content execution to lead handling to internal workflows, we design AI-powered systems that help companies{" "}
          <strong style={{fontWeight:500,color:"rgba(255,255,255,0.96)"}}>scale with less manual work.</strong>
        </motion.p>

        <motion.div
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
          transition={{duration:0.72,ease:[0.22,1,0.36,1],delay:0.40}}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"28px",flexWrap:"wrap",pointerEvents:"auto"}}
        >
          <PrimaryBtn href="#contact" label="Book a Free Call"/>
          <SecondaryBtn href="#how-it-works" label="See How It Works"/>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Buttons ────────────────────────────────────────────────────── */
function PrimaryBtn({ href, label }: { href:string; label:string }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",
        width:"clamp(190px,75vw,214px)",padding:"14px 20px",borderRadius:"16px",
        fontSize:"14px",fontWeight:400,letterSpacing:"0.02em",
        textDecoration:"none",color:"rgba(255,255,255,0.94)",
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

function SecondaryBtn({ href, label }: { href:string; label:string }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  return (
    <a href={href}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPress(false);}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
      style={{
        position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",
        width:"clamp(190px,75vw,214px)",padding:"14px 20px",borderRadius:"16px",
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
