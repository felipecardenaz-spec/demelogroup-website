"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const LOGOS = [
  { src: "/logos/image 52.png", alt: "Statkick", height: 55 },
  { src: "/logos/image 53.png", alt: "Traderly", height: 41 },
  { src: "/logos/image 54.png", alt: "SummitFlow", height: 42 },
  { src: "/logos/image 55.png", alt: "The Kits Pace", height: 49 },
  { src: "/logos/image 56.png", alt: "WorkWise", height: 37 },
  { src: "/logos/image 57.png", alt: "Level company", height: 47 },
  { src: "/logos/image 58.png", alt: "shaker", height: 35 },
  { src: "/logos/image 59.png", alt: "ED Pro", height: 41 },
  { src: "/logos/image 60.png", alt: "BluePeak", height: 39 },
];

const SPEED = 0.5;
const LOGO_GAP = 50;

export function LogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const singleWidthRef = useRef(0);

  useEffect(() => {
    let running = true;

    function frame() {
      if (!running) return;
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      if (singleWidthRef.current === 0) {
        singleWidthRef.current = track.scrollWidth / 3;
      }

      offsetRef.current += SPEED;
      if (offsetRef.current >= singleWidthRef.current) {
        offsetRef.current -= singleWidthRef.current;
      }

      track.style.transform = `translateX(-${offsetRef.current}px)`;

      // Per-logo scale + opacity based on distance from center
      const cw = container.offsetWidth;
      const center = cw / 2;
      const containerRect = container.getBoundingClientRect();
      const items = track.querySelectorAll<HTMLElement>("[data-logo-item]");

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left - containerRect.left + rect.width / 2;
        const dist = Math.abs(itemCenter - center);
        const t = Math.min(dist / (center * 0.85), 1);
        const scale = 1.1 - t * 0.22;
        const opacity = 1.0 - t * 0.60;
        item.style.transform = `scale(${scale})`;
        item.style.opacity = String(opacity);
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      aria-label="Trusted by"
      style={{ padding: "52px 0 80px", position: "relative" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ textAlign: "center", marginBottom: "52px", padding: "0 20px" }}
      >
        <h2 style={{
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#f5f5f7",
          margin: 0,
          lineHeight: 1.2,
        }}>
          Empowering Business and Startups
        </h2>
        <p style={{
          marginTop: "10px",
          fontSize: "clamp(14px, 2vw, 16px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.80)",
          lineHeight: 1.6,
          margin: "10px 0 0",
        }}>
          Software solutions trusted by startups and businesses
        </p>
      </motion.div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
      >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          overflow: "hidden",
          maxWidth: "900px",
          margin: "-50px auto",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${LOGO_GAP}px`,
            willChange: "transform",
            width: "max-content",
            padding: "20px 0",
          }}
        >
          {[0, 1, 2].flatMap((copy) =>
            LOGOS.map((logo, i) => (
              <LogoItem key={`${copy}-${i}`} src={logo.src} alt={logo.alt} height={logo.height} />
            ))
          )}
        </div>
      </div>
      </motion.div>
    </section>
  );
}

function LogoItem({ src, alt, height }: { src: string; alt: string; height: number }) {
  // Estimate width from height to keep aspect ratio reasonable
  const width = Math.round(height * 3.5);

  return (
    <div
      data-logo-item=""
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transformOrigin: "center center",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          height: `${height}px`,
          width: "auto",
          maxWidth: `${width}px`,
          objectFit: "contain",
          display: "block",
          // Keep logos white/light — they're already light-gray PNGs
          filter: "brightness(1.1)",
        }}
        draggable={false}
      />
    </div>
  );
}
