import { LOTUS_ALT_PATH, LOTUS_ALT_VIEWBOX } from "./lotus-geometry";

interface LotusMarkAltProps {
  className?: string;
}

/**
 * The outlined "Alternative Logomark" — a distinct asset from `LotusMark`
 * (single path, its own viewBox), not a second copy of the primary mark.
 * Same convention as `LotusMark`'s mono mode: `currentColor` fill,
 * `aria-hidden`, and position/scale/opacity/colour left entirely to the
 * caller's `className` (e.g. `text-primary-dark opacity-5 absolute …`).
 */
export function LotusMarkAlt({ className }: LotusMarkAltProps) {
  return (
    <svg viewBox={LOTUS_ALT_VIEWBOX} className={className} fill="currentColor" aria-hidden="true">
      <path d={LOTUS_ALT_PATH} />
    </svg>
  );
}
