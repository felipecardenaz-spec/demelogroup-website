"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Data ─────────────────────────────────────────────────────── */
const STATS = [
  { value: 27,  suffix: "+",      label: "Projects Built",    duration: 1600 },
  { value: 4,   suffix: "weeks",  label: "Average Timeline",  duration: 1000 },
  { value: 98,  suffix: "%",      label: "Success Rate",      duration: 1800 },
];

/* ─── Count-up hook ─────────────────────────────────────────────── */
function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({
  value, suffix, label, duration, index, active,
}: {
  value: number; suffix: string; label: string;
  duration: number; index: number; active: boolean;
}) {
  const count = useCountUp(value, duration, active);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1 + index * 0.12,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0",
        minWidth: 0,
        position: "relative",
        borderRadius: "16px",
        padding: "24px 24px 22px",
        cursor: "default",
        /* Glass surface */
        background: hovered
          ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: hovered
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.30), 0 0 0 1px rgba(99,102,241,0.08)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.20)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 260ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
      }}
    >
      {/* Top-edge shimmer */}
      <span aria-hidden="true" style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)",
        pointerEvents: "none",
      }} />

      {/* Ambient inner glow on hover */}
      {hovered && (
        <span aria-hidden="true" style={{
          position: "absolute",
          top: "-40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "120px",
          borderRadius: "9999px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Number */}
      <div style={{
        fontSize: "clamp(30px, 3.5vw, 42px)",
        fontWeight: 600,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        color: "#f5f5f7",
        fontVariantNumeric: "tabular-nums",
        display: "flex",
        alignItems: "baseline",
        gap: 0,
      }}>
        <span style={{ display: "inline-block" }}>{count}</span>
        <span style={{
          fontSize: suffix === "weeks" ? "clamp(14px, 2vw, 18px)" : "clamp(20px, 2.5vw, 28px)",
          fontWeight: 500,
          color: "rgba(245,245,247,0.70)",
          letterSpacing: suffix === "weeks" ? "-0.01em" : "-0.02em",
          marginLeft: suffix === "weeks" ? "10px" : "4px",
        }}>
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p style={{
        marginTop: "10px",
        fontSize: "13px",
        fontWeight: 400,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "rgba(161,161,170,0.75)",
        lineHeight: 1.4,
      }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      aria-label="Stats"
      style={{ padding: "0 20px 80px", position: "relative" }}
    >
      {/* Ambient glow behind section */}
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "700px",
        height: "300px",
        borderRadius: "9999px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        display: "flex",
        gap: "16px",
        position: "relative",
        zIndex: 1,
        /* Mobile: stack */
        flexWrap: "wrap",
      }}>
        {STATS.map((stat, i) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            duration={stat.duration}
            index={i}
            active={inView}
          />
        ))}
      </div>
    </section>
  );
}
