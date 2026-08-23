import { LOTUS_FACETS, LOTUS_VIEWBOX, type LotusPetalId } from "./lotus-geometry";

// Same reveal order as globals.css's .lotus-bloom animation delays (center
// first, then bottom, left/right, upper-left/upper-right).
const BLOOM_ORDER: (LotusPetalId | "center")[] = [
  "center",
  "bottom",
  "left",
  "right",
  "upper-left",
  "upper-right",
];

// 5 career stages, 6 petal-groups — evenly spread so stage 5 always lands
// on the full 6-group set (a genuine full bloom), not 5 of 6.
const REVEAL_COUNTS = [2, 3, 4, 5, 6];

interface LotusStageIconProps {
  /** 1-based (1-5). Reveals that stage's petal-groups (per REVEAL_COUNTS,
   * in BLOOM_ORDER) in their real designer colour; the rest render as a
   * faint grey silhouette. Stage 5 is always the full, real-colour mark. */
  stage: number;
  className?: string;
}

/** The real logomark geometry (`LOTUS_FACETS`, same colours as `LotusMark
 * tone="color"`), progressively revealed — "how much of the lotus has
 * coloured in" doubles as "how far along this career stage is". Separate
 * from `LotusMark` since this reveal behaviour is specific to the
 * pathway's stage circles, not a general mark variant. */
export function LotusStageIcon({ stage, className = "" }: LotusStageIconProps) {
  const revealed = new Set(BLOOM_ORDER.slice(0, REVEAL_COUNTS[stage - 1] ?? BLOOM_ORDER.length));

  return (
    <svg viewBox={LOTUS_VIEWBOX} className={className} aria-hidden="true">
      {LOTUS_FACETS.map((facet, i) => (
        <path
          key={i}
          d={facet.d}
          fill={revealed.has(facet.petal) ? facet.color : "var(--color-neutral-300)"}
          opacity={revealed.has(facet.petal) ? 1 : 0.6}
        />
      ))}
    </svg>
  );
}
