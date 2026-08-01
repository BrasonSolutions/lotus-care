import { BLOB_PATHS, BLOB_VIEWBOX } from "./blob-geometry";

const COLOR_VAR = {
  teal: "var(--color-teal-500)",
  purple: "var(--color-purple-600)",
} as const;

interface BlobProps {
  /** Brand token to render in — never an arbitrary hex, keeps blobs on-palette. */
  color?: keyof typeof COLOR_VAR;
  /** Which of the 3 static organic shapes. */
  variant?: 1 | 2 | 3;
  /** 0-1. Default (0.12) matches this codebase's existing safe precedent
   * for decorative shapes behind content (e.g. bg-accent/10, bg-primary/10). */
  opacity?: number;
  /** Subtle drift animation. Reduced-motion is handled for free by the
   * existing global `prefers-reduced-motion` rule in globals.css, which
   * collapses all animation-durations — no extra JS needed here. */
  animate?: boolean;
  /** Size + position — Tailwind utilities on the root <svg>, same
   * convention as WideContainer/LotusMark (not bespoke numeric props). */
  className?: string;
}

/**
 * Soft organic decorative background shape. Always aria-hidden and
 * pointer-events-none (it's never anything but decoration) — callers still
 * need `relative`/`overflow-hidden` on the containing section, same as the
 * site's existing ad hoc decorative circles.
 */
export function Blob({ color = "teal", variant = 1, opacity = 0.12, animate = false, className = "" }: BlobProps) {
  return (
    <svg
      viewBox={BLOB_VIEWBOX}
      className={`pointer-events-none ${animate ? "blob-drift" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      <path d={BLOB_PATHS[variant - 1]} fill={COLOR_VAR[color]} opacity={opacity} />
    </svg>
  );
}
