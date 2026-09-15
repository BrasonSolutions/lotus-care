"use client";

import { useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-in-view";

/** Radius of the cursor spotlight, in px. */
const SPOTLIGHT_SIZE = 260;

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  /** Solid fill behind the content; `transparent` lets a background layer show. */
  background: string;
  /** Border gradient, lit where the cursor is. */
  gradientFrom: string;
  gradientTo: string;
  /** Border colour away from the cursor, so the card still has an edge at rest. */
  borderRest: string;
  /** Tint of the spotlight wash across the card face. */
  spotlightColor: string;
}

/* Ported from Magic UI's magic-card (magicui.design/docs/components/magic-card),
   gradient mode only: orb mode was the sole consumer of next-themes, and this
   site has no dark theme. `cn` dropped too — the repo uses template literals. */
export function MagicCard({
  children,
  className = "",
  background,
  gradientFrom,
  gradientTo,
  borderRest,
  spotlightColor,
}: MagicCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const mouseX = useMotionValue(-SPOTLIGHT_SIZE);
  const mouseY = useMotionValue(-SPOTLIGHT_SIZE);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  // Parking the spotlight off-element is what hides it; there is no separate
  // visibility flag, so every exit path has to reset or it stays lit.
  const park = useCallback(() => {
    mouseX.set(-SPOTLIGHT_SIZE);
    mouseY.set(-SPOTLIGHT_SIZE);
  }, [mouseX, mouseY]);

  const borderBackground = useMotionTemplate`
    linear-gradient(${background} 0 0) padding-box,
    radial-gradient(${SPOTLIGHT_SIZE}px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom}, ${gradientTo}, ${borderRest} 100%) border-box
  `;

  const spotlight = useMotionTemplate`
    radial-gradient(${SPOTLIGHT_SIZE}px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor}, transparent 100%)
  `;

  if (prefersReducedMotion) {
    return (
      <div className={`border ${className}`} style={{ background, borderColor: borderRest }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`border border-transparent ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={park}
      style={{ background: borderBackground }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      {children}
    </motion.div>
  );
}
