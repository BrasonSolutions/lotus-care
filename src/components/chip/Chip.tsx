import type { ReactNode } from "react";

export type ChipTone =
  | "teal"
  | "purple"
  | "tealSoft"
  | "accentSoft"
  | "neutral"
  | "solid"
  | "solidPurple"
  | "onDark";
export type ChipSize = "sm" | "md";

interface ChipProps {
  tone?: ChipTone;
  size?: ChipSize;
  className?: string;
  children: ReactNode;
}

// Tones verified against real chip-shaped usage found in the audit:
// tealSoft/accentSoft/neutral = JobCard/OccupopJobCard's job-type badge,
// teal/purple = TeamCard's department badge, solid/solidPurple =
// KeywordCards' term pill and VideoTestimonialCard's "Coming soon" badge.
// onDark has no exact existing call site (HeroChips/FeatureSlab's
// translucent variants don't match any of these 8 tones and were left
// hand-rolled — see the consolidation report) but is included per the
// design skill's spec.
const TONE_CLASSES: Record<ChipTone, string> = {
  teal: "bg-primary/15 text-primary font-medium",
  purple: "bg-purple-600/15 text-purple-600 font-medium",
  tealSoft: "bg-primary/10 text-primary-dark font-medium",
  accentSoft: "bg-accent/10 text-primary-dark font-medium",
  neutral: "bg-gray-100 text-muted font-medium",
  solid: "bg-primary-dark text-white font-semibold",
  solidPurple: "bg-purple-600 text-white font-semibold",
  onDark: "bg-white text-primary-dark font-medium",
};

const SIZE_CLASSES: Record<ChipSize, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

/**
 * Pill label for metadata — never an action (design skill section 7).
 * Renders a `<span>`, never a link or button, so it never accepts
 * `onClick`/`href`.
 */
export function Chip({ tone = "neutral", size = "sm", className = "", children }: ChipProps) {
  const classes = [
    "inline-block rounded-full whitespace-nowrap",
    TONE_CLASSES[tone],
    SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
