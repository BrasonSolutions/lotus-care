"use client";

import { useInView } from "@/hooks/use-in-view";
import { revealProps, type RevealEffect, type RevealOptions } from "@/hooks/reveal-props";

interface UseRevealOptions extends RevealOptions {
  threshold?: number;
}

/** Reveals an element on scroll. Spread `props` onto the element you already
 * own and merge its className; `inView` is there for the rare caller driving
 * something else off the same observer (QualityPillars' lotus bloom). Under
 * reduced motion `useInView` reports in view immediately, so no CSS override
 * is needed and none exists. */
export function useReveal(
  effect: RevealEffect = "rise",
  { threshold = 0.2, ...options }: UseRevealOptions = {},
) {
  const { ref, inView } = useInView({ threshold });

  return { ref, inView, props: revealProps(effect, options, inView) };
}

/** One observer, many staggered children — the shape every infographic here
 * needs. `item(index)` returns the same props `useReveal` would, staggered by
 * position, all driven off the single `inView`. */
export function useRevealGroup(
  effect: RevealEffect = "pop",
  { threshold = 0.2, offsetMs = 0 }: UseRevealOptions = {},
) {
  const { ref, inView } = useInView({ threshold });

  return {
    ref,
    inView,
    item: (index: number, itemOffsetMs = offsetMs) =>
      revealProps(effect, { index, offsetMs: itemOffsetMs }, inView),
  };
}
