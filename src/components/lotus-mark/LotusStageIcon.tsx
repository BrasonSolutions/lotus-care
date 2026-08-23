import { LOTUS_FACETS, LOTUS_VIEWBOX, type LotusPetalId } from "./lotus-geometry";

// Same reveal order as globals.css's .lotus-bloom animation delays (center
// first, then bottom, left/right, upper-left/upper-right) — reused here as
// a discrete 6-step sequence instead of a timed animation.
const BLOOM_ORDER: (LotusPetalId | "center")[] = [
  "center",
  "bottom",
  "left",
  "right",
  "upper-left",
  "upper-right",
];

interface LotusStageIconProps {
  /** 1-based. Reveals this many petal-groups (in BLOOM_ORDER) at full
   * opacity; the rest stay faint — "how much of the lotus has bloomed"
   * doubles as "how far along this career stage is". */
  stage: number;
  className?: string;
}

/** White-on-dark variant of the lotus mark, for the career-pathway
 * timeline's stage circles (solid teal background). Not a `LotusMark`
 * prop, a separate component — this progressive reveal is specific to
 * this one use, and keeps `LotusMark` itself untouched for every other
 * caller. */
export function LotusStageIcon({ stage, className = "" }: LotusStageIconProps) {
  const revealed = new Set(BLOOM_ORDER.slice(0, stage));

  return (
    <svg viewBox={LOTUS_VIEWBOX} className={className} fill="white" aria-hidden="true">
      {LOTUS_FACETS.map((facet, i) => (
        <path key={i} d={facet.d} opacity={revealed.has(facet.petal) ? 1 : 0.25} />
      ))}
    </svg>
  );
}
