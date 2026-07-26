import { LOTUS_PETAL_PATH, LOTUS_PETAL_COUNT, LOTUS_VIEWBOX } from "./lotus-path";

interface LotusMarkProps {
  className?: string;
}

export function LotusMark({ className }: LotusMarkProps) {
  const petals = Array.from({ length: LOTUS_PETAL_COUNT }, (_, i) => (360 / LOTUS_PETAL_COUNT) * i);

  return (
    <svg
      viewBox={LOTUS_VIEWBOX}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <g>
        {petals.map((angle) => (
          <path key={angle} d={LOTUS_PETAL_PATH} transform={`rotate(${angle})`} />
        ))}
      </g>
    </svg>
  );
}
