"use client";

import { useId, type ReactNode } from "react";
import { LotusMarkAlt } from "@/components/lotus-mark";

type LotusBandVariant = "teal" | "purple" | "neutral";
type LotusBandMotifColor = "white" | "black" | "teal" | "purple";

// LotusMarkAlt's own viewBox is "0 0 148.47 141.48" (see LotusMarkAlt.tsx) —
// hardcoded here (not imported) so this component only touches lotus-mark's
// public component export, never its internal geometry file.
const ALT_ASPECT_RATIO = 141.48 / 148.47;

// Contrast (WCAG relative luminance, verified against the real token
// hexes): white on teal-700 (#0d6a70) ≈ 6.34:1; white on purple-600
// (#761948) ≈ 10.48:1; foreground on warm-bg (#f8f6f3) ≈ 11.76:1 — all
// clear AA. White on teal-500 (#1badb2) is only 2.74:1 (fails AA), which is
// why the teal band uses teal-700, not teal-500. Assumption: contrast is
// measured against the band background only — the outline motif is
// decorative and low-coverage (thin strokes, not a fill), same convention
// already used for `Blob`/`BenefitCard` in this repo. This is a stated
// decision, not an oversight.
const BAND_STYLE: Record<LotusBandVariant, { bg: string; text: string }> = {
  teal: { bg: "var(--color-teal-700)", text: "text-white" },
  purple: { bg: "var(--color-purple-600)", text: "text-white" },
  neutral: { bg: "var(--color-warm-bg)", text: "text-foreground" },
};

// Reference-art colourways (F5's "6 dividers" = 2 band colours × 3 motif
// colours each), pixel-sampled from docs/brand-assets/Logo/screenshot-2.png
// (teal band) and screenshot-3.png (purple band) rather than eyeballed —
// see the F5 plan for the sample values. "black" samples as pure #000000;
// the nearest defined token is --color-neutral-900 (#111827), not
// --color-foreground (#2d3436) or raw #000.
const MOTIF_COLOR: Record<LotusBandMotifColor, string> = {
  white: "var(--color-background)",
  black: "var(--color-neutral-900)",
  teal: "var(--color-teal-700)",
  purple: "var(--color-purple-600)",
};

// Each band's reference default motif when `motifColor` is omitted —
// matches screenshot-2/3's first row.
const DEFAULT_MOTIF: Record<"teal" | "purple", LotusBandMotifColor> = {
  teal: "white",
  purple: "teal",
};

export interface LotusBandProps {
  /** Band colour + default overlay-text treatment. "neutral" is a plain
   * spacer strip with no motif (Plan 2.0's "neutral spacer"). Default "teal". */
  variant?: LotusBandVariant;
  /** Motif outline colour — independent of `variant`'s band colour, so all
   * 6 F5 divider combinations (2 bands × 3 motifs) are reachable. Defaults
   * to each band's reference default (teal band → white, purple band →
   * teal) when omitted. Ignored when `variant="neutral"` (no motif ever
   * renders there). Must differ from `variant`'s own hue — same-colour
   * pairs are invisible (e.g. `variant="teal"` + `motifColor="teal"`); this
   * is a compile-time developer choice, not user input, so it's documented
   * here rather than runtime-validated. All 4 values are tokens, never a
   * raw hex — see `MOTIF_COLOR` above for the "black" → neutral-900 note. */
  motifColor?: LotusBandMotifColor;
  /** Band height in px. Also drives the tiling/crop math below, so it's a
   * numeric prop rather than a Tailwind height class on `className` — this
   * repo has no tailwind-merge, so two height utilities on one element
   * would race unpredictably. Default 96. */
  height?: number;
  /** Rendered width (px) of one `LotusMarkAlt` copy in the pattern. Default 160. */
  motifSize?: number;
  /** Horizontal repeat distance (px). Must be less than `motifSize` for the
   * interlocking look (see the overlap note below). Exact density can't be
   * judged without rendering — tune per use if needed. Default 112. */
  tileSize?: number;
  /** Width/margin/etc. on the root — not height (see `height` above). */
  className?: string;
  /** Optional content rendered above the pattern (`relative`, painted after
   * the pattern `<svg>` so it's on top — see the AA note above). */
  children?: ReactNode;
}

/**
 * Full-width, full-bleed lotus-pattern band (F6) / divider (F5) — a
 * recurring section device tiling `LotusMarkAlt` in brand colours. All 6
 * `variant`×`motifColor` divider combinations carry white overlay text
 * safely (contrast is checked against the band background only, per the
 * assumption noted above) — none needs to be avoided.
 *
 * Seamless tiling: the inner `<svg>` has no `viewBox`, so 1 user unit = 1
 * real CSS px of its own rendered box (SVG spec) — a `userSpaceOnUse`
 * `<pattern>` then repeats pixel-exact at any width, with zero distortion
 * and no `ResizeObserver`.
 *
 * Overlap/interlocking look: `<pattern>` clips each tile to its own box by
 * default, so a single motif wider than `tileSize` would just lose its
 * clipped tail, not overlap the next tile. Each tile therefore draws TWO
 * copies of `LotusMarkAlt` — one at local x=0 (this cell's motif) and one
 * at local x=-tileSize (the visible remainder of the previous cell's
 * motif) — so the interlocking look is real, undistorted geometry, not a
 * clipped illusion.
 *
 * Top/bottom crop: the motif is rendered taller than the band
 * (`motifSize * (141.48/148.47)` vs `height`) and vertically centred via
 * `y`, so the pattern's own clip crops it symmetrically top and bottom —
 * matching the reference screenshots' bleed-off-edge look.
 */
export function LotusBand({
  variant = "teal",
  motifColor,
  height = 96,
  motifSize = 160,
  tileSize = 112,
  className = "",
  children,
}: LotusBandProps) {
  const patternId = `lotus-band-${useId().replace(/:/g, "")}`;
  const { bg, text } = BAND_STYLE[variant];
  const motif = variant === "neutral" ? undefined : MOTIF_COLOR[motifColor ?? DEFAULT_MOTIF[variant]];
  const motifHeight = motifSize * ALT_ASPECT_RATIO;
  const motifY = -(motifHeight - height) / 2;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`.trim()}
      style={{ height, backgroundColor: bg }}
    >
      {motif && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <pattern id={patternId} patternUnits="userSpaceOnUse" width={tileSize} height={height}>
            <svg x={0} y={motifY} width={motifSize} height={motifHeight} style={{ color: motif }}>
              <LotusMarkAlt className="h-full w-full" />
            </svg>
            <svg x={-tileSize} y={motifY} width={motifSize} height={motifHeight} style={{ color: motif }}>
              <LotusMarkAlt className="h-full w-full" />
            </svg>
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      )}
      {children && <div className={`relative ${text}`}>{children}</div>}
    </div>
  );
}
