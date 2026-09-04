/** The four reveal effects. Each names a CSS class of the same name prefixed
 * `reveal-`; the class carries the transform and duration. */
export type RevealEffect = "rise" | "scale" | "pop" | "fade";

/** Gap between consecutive staggered items. One unit for the whole site. */
export const STAGGER_MS = 90;

export interface RevealOptions {
  /** Position in a staggered group. Multiplied by `STAGGER_MS`. */
  index?: number;
  /** Flat delay added on top of the stagger. */
  offsetMs?: number;
}

export interface RevealProps {
  className: string;
  style: { transitionDelay?: string };
  "data-reveal-effect": RevealEffect;
}

/** Pure: everything `useReveal` returns except the ref. Separated so the class
 * and delay contract can be tested without a DOM. */
export function revealProps(
  effect: RevealEffect,
  { index = 0, offsetMs = 0 }: RevealOptions = {},
  inView = false,
): RevealProps {
  const delay = index * STAGGER_MS + offsetMs;

  return {
    className: `reveal-${effect}${inView ? " in-view" : ""}`,
    style: delay > 0 ? { transitionDelay: `${delay}ms` } : {},
    "data-reveal-effect": effect,
  };
}
