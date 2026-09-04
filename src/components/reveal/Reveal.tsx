"use client";

import { useReveal } from "@/hooks/use-reveal";
import type { RevealEffect, RevealOptions } from "@/hooks/reveal-props";

interface RevealProps extends RevealOptions {
  children: React.ReactNode;
  className?: string;
  effect?: RevealEffect;
  threshold?: number;
}

/** Wrapper for callers that don't already own an element to put the reveal on
 * — mostly page files, which stay server components this way. Everything else
 * should spread `useReveal` onto the element it already renders. */
export function Reveal({
  children,
  className,
  effect = "rise",
  threshold = 0.1,
  ...options
}: RevealProps) {
  const { ref, props } = useReveal(effect, { threshold, ...options });

  return (
    <div ref={ref} {...props} className={`${props.className} ${className ?? ""}`}>
      {children}
    </div>
  );
}
