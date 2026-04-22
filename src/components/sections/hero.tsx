"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Config ─────────────────────────────────────────────────────── */
const PHRASES = ["marketing teams", "sales pipelines", "business operations"];
const PHRASE_DURATION = 2600;
const TRANSITION_MS = 480;

/* ─── Business metric panels ─────────────────────────────────────── */
// Each panel shows a real business outcome with a live-updating metric
const PANELS_DESKTOP = [
  {
    id: "p1", x: "3%", y: "36%",
    floatY: 5, floatDur: 11.0, delay: 0, parallaxFactor: 0.55, breatheOffset: 0.0,
    metric: { base: 32, unit: "%", prefix: "+", label: "conversion rate", decimals: 0 },
    icon: "trend",
  },
  {
    id: "p2", x: "78%", y: "28%",
    floatY: -6, floatDur: 13.5, delay: 2.2, parallaxFactor: 0.75, breatheOffset: 2.1,
    metric: { base: 41, unit: "%", prefix: "+", label: "response speed", decimals: 0 },
    icon: "pulse",
  },
  {
    id: "p3", x: "80%", y: "50%",
    floatY: 4, floatDur: 9.8, delay: 4.5, parallaxFactor: 0.45, breatheOffset: 4.3,
    metric: { base: 78, unit: "%", prefix: "", label: "tasks automated", decimals: 0 },
    icon: "bar",
  },
  {
    id: "p4", x: "2%", y: "60%",
    floatY: -5, floatDur: 12.2, delay: 1.8, parallaxFactor: 0.65, breatheOffset: 1.5,
    metric: { base: 18, unit: "h", prefix: "−", label: "manual work saved", decimals: 0 },
    icon: "status",
  },
];

const PANELS_MOBILE = [
  {
    id: "p2", x: "70%", y: "26%",
    floatY: -4, floatDur: 13.5, delay: 0, parallaxFactor: 0, breatheOffset: 2.1,
    metric: { base: 41, unit: "%", prefix: "+", label: "response speed", decimals: 0 },
    icon: "pulse",
  },
  {
    id: "p4", x: "2%", y: "54%",
    floatY: 3, floatDur: 12.2, delay: 1.0, parallaxFactor: 0, breatheOffset: 1.5,
    metric: { base: 18, unit: "h", prefix: "−", label: "manual work saved", decimals: 0 },
    icon: "status",
  },
];

/* ─── Panel connections (SVG quadratic bezier) ───────────────────── */
// Anchors correspond to panel centers in a 900×860 viewBox
// p1: x=3%→27, y=36%→310  p2: x=78%→702, y=28%→241
// p3: x=80%→720, y=50%→430  p4: x=2%→18, y=60%→516
const CONNECTIONS = [
  { id: "c1", x0: 72,  y0: 335, x1: 747, y1: 266, cpx: 380, cpy: 190, dur: 9.0,  phase: 0.0,  breatheDur: 6.5, breathePhase: 0.0 },
  { id: "c2", x0: 747, y0: 266, x1: 765, y1: 455, cpx: 830, cpy: 360, dur: 7.5,  phase: 0.35, breatheDur: 8.0, breathePhase: 0.4 },
  { id: "c3", x0: 43,  y0: 541, x1: 72,  y1: 335, cpx: 15,  cpy: 430, dur: 8.5,  phase: 0.65, breatheDur: 7.0, breathePhase: 0.7 },
];

/* ─── Atmospheric paths ──────────────────────────────────────────── */
const FLOW_PATHS = [
  { id: "fp1", d: "M 60 560 C 200 420, 500 280, 820 160",  dur: 8.0,  phase: 0.0,  opacity: 0.045 },
  { id: "fp2", d: "M 100 380 C 280 260, 550 420, 800 300", dur: 11.0, phase: 0.3,  opacity: 0.032 },
  { id: "fp3", d: "M 0 620 C 250 540, 600 520, 900 460",   dur: 14.0, phase: 0.6,  opacity: 0.028 },
  { id: "fp4", d: "M 80 200 C 300 160, 580 240, 860 360",  dur: 10.0, phase: 0.15, opacity: 0.028 },
  { id: "fp5", d: "M 550 500 C 650 440, 760 460, 880 520", dur: 7.0,  phase: 0.5,  opacity: 0.038 },
];

/* ─── Bezier helpers ─────────────────────────────────────────────── */
function qBez(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
  const mt = 1 - t;
  return { x: mt*mt*x0 + 2*mt*t*cpx + t*t*x1, y: mt*mt*y0 + 2*mt*t*cpy + t*t*y1 };
}
function cubicBez(t: number, x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x1: number, y1: number) {
  const mt = 1 - t;
  return { x: mt*mt*mt*x0+3*mt*mt*t*cx1+3*mt*t*t*cx2+t*t*t*x1, y: mt*mt*mt*y0+3*mt*mt*t*cy1+3*mt*t*t*cy2+t*t*t*y1 };
}
function parseCubic(d: string) {
  const p = d.replace(/[MC,]/g," ").trim().split(/\s+/).map(Number);
  return { x0:p[0],y0:p[1],cx1:p[2],cy1:p[3],cx2:p[4],cy2:p[5],x1:p[6],y1:p[7] };
}
function eio(t: number) { return t<0.5?2*t*t:-1+(4-2*t)*t; }

/* ─── Panel icon renderers ───────────────────────────────────────── */
function TrendIcon({ t }: { t: number }) {
  const base = [18,14,16,10,12,6,8,2];
  const pts = base.map((y,i)=>[i*8, Math.max(0,y+1.8*Math.sin(t*0.38+i*0.85))]);
  const d = pts.map(([x,y],i)=>`${i===0?"M":"L"} ${x} ${y}`).join(" ");
  return (
    <svg width="56" height="20" viewBox="0 0 56 20" fill="none">
      <path d={d} stroke="rgba(129,140,248,0.55)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="1.8" fill="rgba(165,180,252,0.80)"/>
    </svg>
  );
}
function PulseIcon({ t }: { t: number }) {
  const base = [3,7,5,10,8,12,6,9,4,11,7,5];
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:"2px",height:"16px"}}>
      {base.map((h,i)=>{
        const v = h*(0.5+0.5*Math.abs(Math.sin(t*1.5+i*0.65)*0.35+Math.sin(t*0.85+i*1.2)*0.25+0.4));
        return <div key={i} style={{width:"2px",height:`${Math.max(2,v)}px`,borderRadius:"1px",background:`rgba(129,140,248,${0.25+0.30*Math.abs(Math.sin(t*1.0+i*0.5))})`}}/>;
      })}
    </div>
  );
}
function BarIcon({ t }: { t: number }) {
  const fill = 0.65+0.16*Math.sin(t*0.32)+0.05*Math.sin(t*2.0);
  return (
    <div style={{width:"60px",height:"3px",borderRadius:"2px",background:"rgba(129,140,248,0.09)",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${fill*100}%`,borderRadius:"2px",background:"linear-gradient(90deg,rgba(99,102,241,0.60),rgba(165,180,252,0.80))",transition:"width 350ms ease"}}/>
    </div>
  );
}
function StatusIcon({ t }: { t: number }) {
  const p = 0.50+0.38*Math.abs(Math.sin(t*1.15))*(0.78+0.22*Math.sin(t*3.5));
  return (
    <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
      <div style={{width:"5px",height:"5px",borderRadius:"50%",background:`rgba(129,140,248,${p.toFixed(2)})`,boxShadow:`0 0 ${3+4*p}px rgba(99,102,241,0.30)`}}/>
      <span style={{fontSize:"9px",color:"rgba(165,180,252,0.55)",letterSpacing:"0.04em"}}>LIVE</span>
    </div>
  );
}

/* ─── Animated metric value ──────────────────────────────────────── */
function MetricValue({ base, unit, prefix, t }: { base: number; unit: string; prefix: string; t: number }) {
  // Subtle drift: ±2 units, slow
  const drift = Math.round(base + 1.8*Math.sin(t*0.18+base*0.3));
  return (
    <span style={{fontSize:"13px",fontWeight:600,color:"rgba(210,215,255,0.88)",letterSpacing:"0.01em",fontVariantNumeric:"tabular-nums"}}>
      {prefix}{drift}{unit}
    </span>
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
      setT((ts-start)/1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ox = isMobile ? 0 : mouseX * 9;
  const oy = isMobile ? 0 : mouseY * 5;

  // Focus cycle: one connection becomes active every ~8s
  const FOCUS_DUR = 8.0;
  const focusIdx = Math.floor((t / FOCUS_DUR) % CONNECTIONS.length);
  const focusProg = (t / FOCUS_DUR) % 1;
  const focusInt = Math.max(0, Math.sin(focusProg * Math.PI));

  // AI processing pulse: slow wave that occasionally brightens the system
  const aiPulse = Math.max(0, Math.sin(t * 0.22) * Math.sin(t * 0.07));

  const panels = isMobile ? PANELS_MOBILE : PANELS_DESKTOP;
  const conns = isMobile ? [CONNECTIONS[0]] : CONNECTIONS;
  const fps = isMobile ? FLOW_PATHS.slice(0,2) : FLOW_PATHS;

  // Mouse proximity to each panel (SVG coords: panel x% * 900, y% * 860)
  const panelSVGCoords = PANELS_DESKTOP.map(p => ({
    x: parseFloat(p.x) / 100 * 900,
    y: parseFloat(p.y) / 100 * 860,
  }));
  // mouseX/Y are -1..1 normalized
  const msx = (mouseX * 0.5 + 0.5) * 900;
  const msy = (mouseY * 0.5 + 0.5) * 860;

  return (
    <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <svg viewBox="0 0 900 860" preserveAspectRatio="xMidYMid slice"
        style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <defs>
          <filter id="hg-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="hg-softglow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="hg-depth" cx="50%" cy="75%" r="55%">
            <stop offset="0%"   stopColor={`rgba(99,102,241,${0.04+aiPulse*0.02})`}/>
            <stop offset="60%"  stopColor="rgba(99,102,241,0.008)"/>
            <stop offset="100%" stopColor="rgba(99,102,241,0)"/>
          </radialGradient>
          <radialGradient id="hg-top" cx="50%" cy="0%" r="50%">
            <stop offset="0%"   stopColor={`rgba(99,102,241,${0.028+aiPulse*0.015})`}/>
            <stop offset="100%" stopColor="rgba(99,102,241,0)"/>
          </radialGradient>
          {/* Gradient for light streak */}
          <linearGradient id="hg-streak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(165,180,252,0)"/>
            <stop offset="40%"  stopColor="rgba(165,180,252,0.06)"/>
            <stop offset="60%"  stopColor="rgba(165,180,252,0.10)"/>
            <stop offset="100%" stopColor="rgba(165,180,252,0)"/>
          </linearGradient>
        </defs>

        {/* Depth gradients */}
        <rect x="0" y="0" width="900" height="860" fill="url(#hg-depth)"/>
        <rect x="0" y="0" width="900" height="860" fill="url(#hg-top)"/>

        {/* Contour arcs */}
        {[{cx:450,cy:700,rx:500,ry:280,op:0.013},{cx:450,cy:720,rx:680,ry:380,op:0.008},{cx:450,cy:740,rx:860,ry:480,op:0.005}].map((a,i)=>(
          <ellipse key={i} cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} fill="none" stroke={`rgba(129,140,248,${a.op})`} strokeWidth="0.5"/>
        ))}

        {/* Grid */}
        {!isMobile && [180,360,540,720].map(x=>(
          <line key={`gv${x}`} x1={x} y1="0" x2={x} y2="860" stroke="rgba(255,255,255,0.006)" strokeWidth="0.5"/>
        ))}
        {!isMobile && [260,430,600,760].map(y=>(
          <line key={`gh${y}`} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.006)" strokeWidth="0.5"/>
        ))}

        {/* Occasional light streak — passes across the system every ~18s */}
        {(() => {
          const streakCycle = 18.0;
          const sp = (t / streakCycle) % 1;
          const sx = sp * 1100 - 100;
          const streakOp = Math.max(0, Math.sin(sp * Math.PI) * 0.7);
          return (
            <rect x={sx-80} y="0" width="160" height="860"
              fill="url(#hg-streak)"
              opacity={streakOp}
              transform={`skewX(-18)`}
            />
          );
        })()}

        {/* Atmospheric flow paths */}
        {fps.map(fp=>{
          const breathe = fp.opacity*(0.60+0.40*Math.sin(t*0.45+fp.phase*10));
          return <path key={fp.id} d={fp.d} fill="none" stroke={`rgba(129,140,248,${breathe.toFixed(3)})`} strokeWidth="0.45" strokeLinecap="round"/>;
        })}

        {/* Atmospheric signal dots — desktop only */}
        {!isMobile && fps.map(fp=>{
          const c = parseCubic(fp.d);
          const tRaw = ((t/fp.dur+fp.phase)%1+1)%1;
          const pt = cubicBez(tRaw,c.x0,c.y0,c.cx1,c.cy1,c.cx2,c.cy2,c.x1,c.y1);
          const op = 0.32*Math.sin(tRaw*Math.PI);
          const t2 = Math.max(0,tRaw-0.06);
          const pt2 = cubicBez(t2,c.x0,c.y0,c.cx1,c.cy1,c.cx2,c.cy2,c.x1,c.y1);
          return (
            <g key={`as-${fp.id}`}>
              <circle cx={pt2.x} cy={pt2.y} r="0.9" fill={`rgba(165,180,252,${(op*0.25).toFixed(2)})`} filter="url(#hg-glow)"/>
              <circle cx={pt.x}  cy={pt.y}  r="1.5" fill={`rgba(165,180,252,${op.toFixed(2)})`} filter="url(#hg-glow)"/>
            </g>
          );
        })}

        {/* Connection lines */}
        {conns.map((c,ci)=>{
          const isFoc = ci===focusIdx;
          const breathe = 0.5+0.5*Math.sin(t*(Math.PI*2/c.breatheDur)+c.breathePhase*Math.PI*2);
          // Mouse proximity boost: check if cursor is near this connection's midpoint
          const mid = qBez(0.5,c.x0,c.y0,c.cpx,c.cpy,c.x1,c.y1);
          const dist = Math.hypot(msx-mid.x, msy-mid.y);
          const mouseBoost = isMobile ? 0 : Math.max(0, 1-dist/220)*0.10;
          const focBoost = isFoc ? focusInt*0.14 : 0;
          const lineOp = (0.05+0.07*breathe+focBoost+mouseBoost).toFixed(3);
          return (
            <path key={`cl-${c.id}`}
              d={`M ${c.x0} ${c.y0} Q ${c.cpx} ${c.cpy} ${c.x1} ${c.y1}`}
              fill="none" stroke={`rgba(129,140,248,${lineOp})`}
              strokeWidth={isFoc ? "0.75" : "0.45"} strokeLinecap="round"/>
          );
        })}

        {/* Connection signals */}
        {conns.map((c,ci)=>{
          const isFoc = ci===focusIdx;
          const breathe = 0.5+0.5*Math.sin(t*(Math.PI*2/c.breatheDur)+c.breathePhase*Math.PI*2);
          const focBoost = isFoc ? focusInt*0.28 : 0;
          const mid = qBez(0.5,c.x0,c.y0,c.cpx,c.cpy,c.x1,c.y1);
          const dist = Math.hypot(msx-mid.x, msy-mid.y);
          const mouseBoost = isMobile ? 0 : Math.max(0,1-dist/220)*0.20;

          // Primary
          const tRaw = ((t/c.dur+c.phase)%1+1)%1;
          const te = eio(tRaw);
          const sp = qBez(te,c.x0,c.y0,c.cpx,c.cpy,c.x1,c.y1);
          // Trail
          const t2r = Math.max(0,tRaw-0.05);
          const sp2 = qBez(eio(t2r),c.x0,c.y0,c.cpx,c.cpy,c.x1,c.y1);
          // Secondary (offset 0.5)
          const t3r = ((t/c.dur+c.phase+0.5)%1+1)%1;
          const sp3 = qBez(eio(t3r),c.x0,c.y0,c.cpx,c.cpy,c.x1,c.y1);

          const base = (0.5+0.5*breathe);
          const sigOp = Math.min(0.85,(0.42+focBoost+mouseBoost)*Math.sin(tRaw*Math.PI)*base);
          const trailOp = sigOp*0.28;
          const secOp = 0.18*Math.sin(t3r*Math.PI)*base;

          return (
            <g key={`cs-${c.id}`}>
              <circle cx={sp3.x} cy={sp3.y} r="1.1" fill={`rgba(165,180,252,${secOp.toFixed(2)})`} filter="url(#hg-glow)"/>
              <circle cx={sp2.x} cy={sp2.y} r="0.9" fill={`rgba(165,180,252,${trailOp.toFixed(2)})`} filter="url(#hg-glow)"/>
              <circle cx={sp.x}  cy={sp.y}  r="1.7" fill={`rgba(165,180,252,${sigOp.toFixed(2)})`}  filter="url(#hg-glow)"/>
            </g>
          );
        })}

        {/* AI processing pulse — occasional soft ring emanating from center */}
        {(() => {
          const pulseCycle = 12.0;
          const pp = (t/pulseCycle)%1;
          const pr = pp*320;
          const po = Math.max(0, Math.sin(pp*Math.PI)*0.06*(0.5+0.5*Math.sin(t*0.3)));
          return (
            <circle cx="450" cy="380" r={pr} fill="none"
              stroke={`rgba(99,102,241,${po.toFixed(3)})`} strokeWidth="0.6"/>
          );
        })()}
      </svg>

      {/* ── Panels (HTML) ── */}
      {panels.map((panel, pi) => {
        const px = ox * panel.parallaxFactor;
        const py = oy * panel.parallaxFactor;

        // Breathing opacity
        const breathe = 0.5+0.5*Math.sin(t*0.52+panel.breatheOffset);
        const panelOp = 0.80+0.14*breathe;

        // Focus
        const isFoc = pi===focusIdx%panels.length;
        const focGlow = isFoc ? focusInt*0.20 : 0;

        // Mouse proximity (HTML coords: panel x% of container, y% of container)
        const panelCX = parseFloat(panel.x)/100*900;
        const panelCY = parseFloat(panel.y)/100*860;
        const dist = Math.hypot(msx-panelCX, msy-panelCY);
        const mouseProx = isMobile ? 0 : Math.max(0,1-dist/200);
        const mouseGlow = mouseProx*0.15;
        const mouseScale = 1+mouseProx*0.018;

        const totalGlow = focGlow+mouseGlow;
        const scale = (isFoc ? 1+focusInt*0.012 : 1)*mouseScale;

        return (
          <motion.div key={panel.id}
            style={{position:"absolute",left:panel.x,top:panel.y,zIndex:1,willChange:"transform",pointerEvents:"none"}}
            animate={{y:[0,panel.floatY,0]}}
            transition={{duration:panel.floatDur,delay:panel.delay,repeat:Infinity,ease:"easeInOut",repeatType:"mirror"}}
          >
            <div style={{
              transform:`translate(${px}px,${py}px) scale(${scale})`,
              transition:"transform 500ms cubic-bezier(0.22,1,0.36,1)",
              padding:"9px 13px",
              borderRadius:"11px",
              background:`rgba(8,8,20,${0.54+totalGlow*0.25})`,
              backdropFilter:"blur(18px)",
              WebkitBackdropFilter:"blur(18px)",
              border:`1px solid rgba(129,140,248,${0.09+totalGlow*1.1})`,
              boxShadow: totalGlow > 0.02
                ? `inset 0 1px 0 rgba(255,255,255,0.06),0 8px 28px rgba(0,0,0,0.24),0 0 22px rgba(99,102,241,${(totalGlow*0.35).toFixed(2)})`
                : "inset 0 1px 0 rgba(255,255,255,0.04),0 8px 24px rgba(0,0,0,0.20)",
              display:"flex",flexDirection:"column",minWidth:"96px",
              opacity:panelOp,
            }}>
              {panel.icon==="trend"  && <TrendIcon t={t}/>}
              {panel.icon==="pulse"  && <PulseIcon t={t}/>}
              {panel.icon==="bar"    && <BarIcon t={t}/>}
              {panel.icon==="status" && <StatusIcon t={t}/>}

              <div style={{display:"flex",flexDirection:"column",gap:"1px",marginTop:"5px"}}>
                <MetricValue {...panel.metric} t={t}/>
                <span style={{fontSize:"9px",fontWeight:400,color:"rgba(150,160,210,0.45)",letterSpacing:"0.03em"}}>
                  {panel.metric.label}
                </span>
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
      <motion.div aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2.0,ease:"easeOut"}}
        style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{
          position:"absolute",left:"50%",top:"-8%",transform:"translateX(-50%)",
          height:"480px",width:"680px",borderRadius:"9999px",
          background:"radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.035) 0%,rgba(99,102,241,0.006) 65%,transparent 85%)",
        }}/>
        <div className="bg-grid" style={{position:"absolute",inset:0,opacity:0.06}}/>
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
        background:"radial-gradient(ellipse 62% 56% at 50% 38%,rgba(5,5,5,0.42) 0%,rgba(5,5,5,0.15) 55%,transparent 80%)",
      }}/>

      {/* Content */}
      <div style={{
        position:"relative",zIndex:2,maxWidth:"1280px",width:"100%",
        margin:"0 auto",padding:"80px 24px 120px",
        textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",
        pointerEvents:"none",
      }}>
        {/* H1 */}
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

        {/* Subheadline */}
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

        {/* CTAs */}
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
