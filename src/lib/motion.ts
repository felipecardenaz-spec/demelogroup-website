/**
 * Framer Motion — Shared Animation Presets
 *
 * Centralized animation variants and transition configs.
 * Import these in components instead of defining inline.
 *
 * Usage:
 *   import { fadeIn, staggerContainer } from "@/lib/motion";
 *   <motion.div variants={fadeIn} initial="hidden" animate="visible" />
 */

import type { Variants, Transition } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
   TRANSITIONS
   ───────────────────────────────────────────────────────────────── */

export const transitionDefault: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
};

export const transitionSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const transitionSlow: Transition = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1],
};

/* ─────────────────────────────────────────────────────────────────
   FADE VARIANTS
   ───────────────────────────────────────────────────────────────── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionDefault,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefault,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefault,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionDefault,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionDefault,
  },
};

/* ─────────────────────────────────────────────────────────────────
   SCALE VARIANTS
   ───────────────────────────────────────────────────────────────── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionDefault,
  },
};

/* ─────────────────────────────────────────────────────────────────
   STAGGER CONTAINERS
   Use as parent variant to stagger children animations.
   
   Usage:
     <motion.div variants={staggerContainer} initial="hidden" animate="visible">
       <motion.div variants={fadeInUp}>Child 1</motion.div>
       <motion.div variants={fadeInUp}>Child 2</motion.div>
     </motion.div>
   ───────────────────────────────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/* ─────────────────────────────────────────────────────────────────
   VIEWPORT / SCROLL TRIGGER CONFIG
   Reusable whileInView settings.
   
   Usage:
     <motion.div
       variants={fadeInUp}
       initial="hidden"
       whileInView="visible"
       viewport={viewportOnce}
     />
   ───────────────────────────────────────────────────────────────── */

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};

export const viewportAlways = {
  once: false,
  margin: "-80px" as const,
};

/* ─────────────────────────────────────────────────────────────────
   HOVER / TAP PRESETS
   ───────────────────────────────────────────────────────────────── */

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const tapScale = {
  scale: 0.98,
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2 },
};
