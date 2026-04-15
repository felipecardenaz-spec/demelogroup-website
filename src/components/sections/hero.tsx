"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout";

const rotatingPhrases = [
  "for scalable operations",
  "for ambitious startups",
  "for growing businesses",
  "for faster time-to-market",
  "for modern product teams",
];

const PHRASE_DURATION = 3200;

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, PHRASE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <section aria-label="Hero" style={{ position: "relative" }}>
      {/* Background layers */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.05 }}
        style={{ position: "absolute", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "visible" }}
      >
        {/* Primary indigo glow — compact, tight to top center */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "-8%",
          transform: "translateX(-50%)",
          height: "420px",
          width: "600px",
          borderRadius: "9999px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.20) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)",
          filter: "blur(0px)",
        }} />
        {/* Secondary violet accent — small, offset */}
        <div style={{
          position: "absolute",
          left: "58%",
          top: "2%",
          height: "280px",
          width: "340px",
          borderRadius: "9999px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 65%)",
          filter: "blur(1px)",
        }} />
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        <ConcentricCircles />
      </motion.div>

      {/* Responsive container */}
      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "35px 20px 0px",
        textAlign: "center",
      }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            fontSize: "clamp(28px, 6vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "#f5f5f7",
            margin: 0,
          }}
        >
          <span style={{ display: "block" }}>We build software</span>

          {/* Rotating phrase */}
          <span style={{ position: "relative", display: "block", overflow: "hidden", height: "1.2em", minHeight: "1.2em" }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={index}
                style={{
                  position: "absolute",
                  inset: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformOrigin: "center bottom",
                  perspective: "800px",
                  whiteSpace: "nowrap",
                }}
                initial={{ y: "110%", rotateX: -25, opacity: 0 }}
                animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                exit={{ y: "-110%", rotateX: 25, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{
                  backgroundImage: "linear-gradient(90deg, #818cf8 0%, #6366f1 50%, #818cf8 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}>
                  {rotatingPhrases[index]}
                </span>
              </motion.span>
            </AnimatePresence>
          </span>

          <span style={{ display: "block" }}>engineered for performance</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
          className="hero-subtitle"
          style={{
            marginTop: "16px",
            fontSize: "clamp(14px, 2.5vw, 16px)",
            fontWeight: 400,
            lineHeight: 1.75,
            color: "#a1a1aa",
            maxWidth: "clamp(250px, 70vw, 480px)",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Custom{" "}
          <strong style={{ fontWeight: 500, color: "#ffffff" }}>web</strong> and{" "}
          <strong style={{ fontWeight: 500, color: "#ffffff" }}>mobile</strong>{" "}
          solutions that{" "}
          <strong style={{ fontWeight: 500, color: "#ffffff" }}>accelerate innovation</strong>{" "}
          for{" "}
          <strong style={{ fontWeight: 500, color: "#ffffff" }}>startups</strong>{" "}
          and growing companies.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <HeroPrimaryButton href="#contact" label="Start Your Project" className="hero-cta-primary" />
          <HeroSecondaryButton href="#pricing" label="View Our Pricing Model" className="hero-cta-secondary" />
        </motion.div>

      </div>
    </section>
  );
}

function HeroPrimaryButton({ href, label, className }: { href: string; label: string; className?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "clamp(200px, 75vw, 240px)",
        padding: "14px 20px",
        borderRadius: "16px",
        fontSize: "14px",
        fontWeight: 400,
        letterSpacing: "0.02em",
        textDecoration: "none",
        color: "rgba(255,255,255,0.92)",
        background: hovered
          ? "linear-gradient(170deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)"
          : "linear-gradient(170deg, #5b5ef4 0%, #4338ca 100%)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.28), inset 0 -1px 0 0 rgba(0,0,0,0.30), 0 6px 20px -4px rgba(79,70,229,0.55)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.14), inset 0 -1px 0 0 rgba(0,0,0,0.30)",
        border: hovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* Shimmer sweep */}
      <span aria-hidden="true" style={{
        position: "absolute",
        top: 0, bottom: 0,
        width: "60%",
        left: hovered ? "120%" : "-60%",
        transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        transition: "left 550ms cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }} />
      {/* Top edge highlight */}
      <span aria-hidden="true" style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.40), transparent)",
        pointerEvents: "none",
      }} />

      {/* Arrow — left side on hover, hidden on idle */}
      <span aria-hidden="true" style={{
        display: "flex",
        alignItems: "center",
        width: hovered ? "14px" : "0px",
        overflow: "hidden",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-8px)",
        transition: "width 280ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease, transform 280ms cubic-bezier(0.22,1,0.36,1)",
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Label — shifts right on hover */}
      <span style={{
        transform: hovered ? "translateX(3px)" : "translateX(0)",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
        display: "inline-block",
      }}>
        {label}
      </span>

      {/* Arrow — right side on idle, exits right on hover */}
      <span aria-hidden="true" style={{
        display: "flex",
        alignItems: "center",
        width: hovered ? "0px" : "14px",
        overflow: "hidden",
        opacity: hovered ? 0 : 1,
        transform: hovered ? "translateX(8px)" : "translateX(0)",
        transition: "width 280ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease, transform 280ms cubic-bezier(0.22,1,0.36,1)",
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

/* ── Concentric Circles Background ── */
const CIRCLES = [
  { size: 140,  opacity: 0.22, delay: 0 },
  { size: 260,  opacity: 0.15, delay: 0.5 },
  { size: 380,  opacity: 0.10, delay: 1.0 },
  { size: 500,  opacity: 0.068, delay: 1.5 },
  { size: 620,  opacity: 0.044, delay: 2.0 },
  { size: 740,  opacity: 0.028, delay: 2.5 },
  { size: 860,  opacity: 0.017, delay: 3.0 },
  { size: 980,  opacity: 0.010, delay: 3.5 },
];

function ConcentricCircles() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {CIRCLES.map((circle, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: circle.size,
            height: circle.size,
            marginLeft: -circle.size / 2,
            marginTop: -circle.size / 2,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,${circle.opacity})`,
            boxShadow: `0 0 ${Math.round(circle.size * 0.03)}px rgba(148,163,184,${circle.opacity * 0.5})`,
          }}
          animate={{
            scale: [1, 1.014, 1],
            opacity: [1, 1.3, 1],
          }}
          transition={{
            duration: 7 + i * 0.6,
            delay: circle.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function HeroSecondaryButton({ href, label, className }: { href: string; label: string; className?: string }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const scale = pressed ? 0.98 : hovered ? 1.015 : 1;

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(200px, 75vw, 240px)",
        padding: "14px 20px",
        borderRadius: "16px",
        fontSize: "14px",
        fontWeight: 400,
        textDecoration: "none",
        overflow: "hidden",
        whiteSpace: "nowrap",
        color: hovered ? "#f5f5f7" : "#d4d4d8",
        background: hovered ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
        border: hovered ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.14)",
        boxShadow: hovered
          ? "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.20)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.06)",
        transform: `scale(${scale})`,
        transition: pressed ? "transform 100ms ease" : "all 240ms cubic-bezier(0, 0, 0.2, 1)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute",
        top: 0, bottom: 0,
        width: "50%",
        left: hovered ? "110%" : "-50%",
        transform: "skewX(-12deg)",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
        transition: "left 600ms cubic-bezier(0, 0, 0.2, 1)",
        pointerEvents: "none",
      }} />
      <span aria-hidden="true" style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
        pointerEvents: "none",
      }} />
      {label}
    </a>
  );
}
