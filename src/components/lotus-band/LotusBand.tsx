"use client";

import { useId, type ReactNode } from "react";
import { LotusMarkAlt } from "@/components/lotus-mark";

type LotusBandVariant = "teal" | "purple" | "neutral";
type LotusBandMotifColor = "white" | "black" | "teal" | "purple";

// LotusMarkAlt's own viewBox is "0 0 148.47 141.48" (see LotusMarkAlt.tsx) —
// hardcoded here (not imported) so this component only touches lotus-mark's
// public component export, never its internal geometry file.
const ALT_ASPECT_RATIO = 141.48 / 148.47;

// Tile pitch, pixel-measured (ImageMagick pixel dumps + windowed
// autocorrelation) against the user's reference crop and
// docs/brand-assets/Logo/screenshot-2/3.png — not eyeballed. Independently
// re-verified twice now (2.01 avg over 4 row samples, then 1.96 via a
// second, separate autocorrelation pass on the user's crop) — both cluster
// tightly around 2, so this is settled. Expressed as a `height`-relative
// ratio (not a fixed pixel default) so `tileSize` stays correct for
// whatever `height` a caller passes — see the `height` prop doc.
const TILE_TO_HEIGHT_RATIO = 2;

// Motif size, pixel-measured the same way (4-connected blob analysis) —
// the reference's motifs render at almost exactly their own tile-pitch
// width, with only a hairline (~3%) gap between neighbours. Do not scale
// this up: the user confirmed the flower stays this size even under the
// bottom-edge-midline crop below (an earlier "motif height = 2x band
// height" instruction was withdrawn — the visible fraction is a crop
// position change only, not a re-scale).
const MOTIF_TO_TILE_RATIO = 0.972;

// Extra downward drop of the midline anchor below "flush with the band's
// bottom edge" (which is what a 1x multiplier on `height` would give — see
// `motifY` below). User-confirmed: +8px at height=72. 8/72 = 1/9, so the
// multiplier on `height` becomes 1 + 1/9 = 10/9. Expressed as a ratio (not
// the literal 8px) so it scales proportionally at any `height`, same
// reasoning as `TILE_TO_HEIGHT_RATIO`.
const MIDLINE_Y_TO_HEIGHT_RATIO = 10 / 9;

// "75° counter-clockwise" (was 30°, then briefly 90°, settled at 75° — same
// confirmed direction, "to the left"). SVG's y-axis points down, so a
// POSITIVE `rotate()` angle turns clockwise on screen — the sign here is
// therefore negative. Direction confirmed visually with an isolated
// dot-rotation test (a point at 12 o'clock moved toward 11/10 o'clock under
// a negative angle), not just trusted from the sign convention.
const ROTATION_DEG = -75;

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
  /** Rendered width (px) of one `LotusMarkAlt` copy in the pattern. Defaults
   * to `tileSize * MOTIF_TO_TILE_RATIO` (reference-measured) when omitted,
   * so it stays correct for whatever `tileSize`/`height` end up being used
   * instead of a fixed number tuned for one specific height. */
  motifSize?: number;
  /** Horizontal repeat distance (px). Defaults to `height *
   * TILE_TO_HEIGHT_RATIO` (reference-measured) when omitted — a fixed pixel
   * default would only be correct for the one `height` it was tuned
   * against, and every real caller in this repo passes its own `height`. */
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
 * Crop position: only the motif's TOP HALF is shown — its own horizontal
 * midline is aligned `MIDLINE_Y_TO_HEIGHT_RATIO * height` down from the
 * band's top edge (i.e. below the band's own bottom edge, not flush with
 * it), so the bottom half is clipped away below the band and the flower
 * reads as rising out of / hiding behind the strip. The motif is NOT
 * rescaled to fit — at the reference size (`MOTIF_TO_TILE_RATIO`), its
 * half-height is a little less than most `height`s in use, so there's a
 * clear gap between the band's top edge and the topmost petal tip; that gap
 * is intentional, not a bug.
 *
 * Rotation: each motif copy is rotated `ROTATION_DEG` about its OWN centre
 * (a `<g transform="rotate(angle cx cy)">` wrapper per copy, cx/cy computed
 * from that copy's own x/y/size) — never the tiled field as a whole, which
 * would turn the band itself off-axis. Rotating in place keeps every tile
 * bit-for-bit identical to its neighbour (just shifted by `tileSize`), so
 * periodicity is unaffected by the rotation.
 *
 * `motifSize`/`tileSize` default to `height`-relative ratios
 * (`TILE_TO_HEIGHT_RATIO`, `MOTIF_TO_TILE_RATIO`), not fixed pixel numbers —
 * see those constants' doc comment for the reference measurement they come
 * from. Rounding them to the nearest px is cosmetic (sub-pixel `tileSize`
 * would still tile correctly); it's done for readable devtools output, not
 * because the math needs it.
 */
export function LotusBand({
  variant = "teal",
  motifColor,
  height = 96,
  motifSize,
  tileSize,
  className = "",
  children,
}: LotusBandProps) {
  const patternId = `lotus-band-${useId().replace(/:/g, "")}`;
  const { bg, text } = BAND_STYLE[variant];
  const motif = variant === "neutral" ? undefined : MOTIF_COLOR[motifColor ?? DEFAULT_MOTIF[variant]];
  const resolvedTileSize = tileSize ?? Math.round(height * TILE_TO_HEIGHT_RATIO);
  const resolvedMotifSize = motifSize ?? Math.round(resolvedTileSize * MOTIF_TO_TILE_RATIO);
  const motifHeight = resolvedMotifSize * ALT_ASPECT_RATIO;
  // Motif's own vertical midline lands below the band's bottom edge — see
  // the "Crop position" doc above.
  const motifY = height * MIDLINE_Y_TO_HEIGHT_RATIO - motifHeight / 2;
  const motifCy = motifY + motifHeight / 2; // = height * MIDLINE_Y_TO_HEIGHT_RATIO, same for both copies

  // Renders one motif copy at local x=`xOffset`, rotated about its own
  // centre — factored out so the two copies (this cell's motif, and the
  // previous cell's tail, per the class doc's "Overlap/interlocking look")
  // can't drift out of sync with each other.
  const renderMotif = (xOffset: number) => {
    const cx = xOffset + resolvedMotifSize / 2;
    return (
      <g key={xOffset} transform={`rotate(${ROTATION_DEG} ${cx} ${motifCy})`}>
        <svg x={xOffset} y={motifY} width={resolvedMotifSize} height={motifHeight} style={{ color: motif }}>
          <LotusMarkAlt className="h-full w-full" />
        </svg>
      </g>
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`.trim()}
      style={{ height, backgroundColor: bg }}
    >
      {motif && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <pattern id={patternId} patternUnits="userSpaceOnUse" width={resolvedTileSize} height={height}>
            {renderMotif(0)}
            {renderMotif(-resolvedTileSize)}
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      )}
      {children && <div className={`relative ${text}`}>{children}</div>}
    </div>
  );
}
