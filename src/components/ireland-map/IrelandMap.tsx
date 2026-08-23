import { COUNTY_PATHS, IRELAND_MAP_VIEWBOX } from "./county-paths";

interface IrelandMapProps {
  /** County names (must match the keys in `COUNTY_PATHS`) to render in the
   * highlight colour. Case-sensitive, exact county name. */
  highlightedCounties: string[];
  className?: string;
}

/**
 * Decorative brand-coloured map of Ireland's 32 counties. Counties named in
 * `highlightedCounties` render in the accent colour; every other county
 * renders in the muted base colour. No pins/labels — the coloured county
 * fill itself is the marker.
 */
export function IrelandMap({ highlightedCounties, className = "" }: IrelandMapProps) {
  const highlighted = new Set(highlightedCounties);

  return (
    <svg
      viewBox={IRELAND_MAP_VIEWBOX}
      className={className}
      role="img"
      aria-label={`Map of Ireland highlighting counties with Lotus Care homes: ${highlightedCounties.join(", ")}`}
    >
      {Object.entries(COUNTY_PATHS).map(([name, d]) => (
        <path
          key={name}
          d={d}
          fill={highlighted.has(name) ? "var(--color-teal-400)" : "var(--color-teal-800)"}
          stroke="white"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}
