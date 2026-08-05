import { LOTUS_FACETS, LOTUS_VIEWBOX } from "./lotus-geometry";

interface LotusMarkProps {
  className?: string;
  /** "mono" (default) renders every facet in `currentColor` — the
   * decorative-watermark use (e.g. CareersHero's low-opacity background
   * motif). "color" renders the real per-facet brand hexes. */
  tone?: "mono" | "color";
}

const petalGroups = Array.from(new Set(LOTUS_FACETS.map((f) => f.petal)));

export function LotusMark({ className, tone = "mono" }: LotusMarkProps) {
  return (
    <svg
      viewBox={LOTUS_VIEWBOX}
      className={className}
      fill={tone === "mono" ? "currentColor" : undefined}
      aria-hidden="true"
    >
      {petalGroups.map((petal) => (
        <g key={petal} data-petal={petal}>
          {LOTUS_FACETS.filter((f) => f.petal === petal).map((facet, i) => (
            <path key={i} d={facet.d} fill={tone === "color" ? facet.color : undefined} />
          ))}
        </g>
      ))}
    </svg>
  );
}
