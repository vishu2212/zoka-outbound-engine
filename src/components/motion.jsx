import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────
   SHARED MOTION VARIANTS — Premium SaaS Animations
   Subtle, minimal, 60fps. Not flashy.
   ───────────────────────────────────────────────────── */

// Page-level fade/slide transition
export const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Stagger container — children animate sequentially
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// Individual stagger child (fade up)
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Card fade-in
export const cardFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Hover lift — use as whileHover prop
export const hoverLift = {
  y: -3,
  transition: { duration: 0.2, ease: 'easeOut' },
};

// Hover lift + subtle scale for stat cards
export const hoverLiftScale = {
  y: -4,
  scale: 1.01,
  transition: { duration: 0.25, ease: 'easeOut' },
};

// Tap press down
export const tapPress = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

/* ─────────────────────────────────────────────────────
   MOTION WRAPPER COMPONENTS
   ───────────────────────────────────────────────────── */

// Animated page wrapper
export function MotionPage({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// Stagger grid (immediate children stagger in)
export function StaggerGrid({ children, className = '', style }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// Single stagger child
export function StaggerChild({ children, className = '' }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

// Card with fade + hover lift
export function MotionCard({ children, className = '', delay = 0, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hoverLift}
    >
      {children}
    </motion.div>
  );
}

// Stat card with stagger + hover lift+scale
export function MotionStatCard({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      whileHover={hoverLiftScale}
    >
      {children}
    </motion.div>
  );
}
