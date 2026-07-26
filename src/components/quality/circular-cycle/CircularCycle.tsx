interface CircularCycleStep {
  label: string;
  description: string;
}

interface CircularCycleProps {
  steps: CircularCycleStep[];
  centerLabel?: string;
}

const RADIUS = 220;
const NODE_WIDTH = 192;

export function CircularCycle({ steps, centerLabel }: CircularCycleProps) {
  const count = steps.length;
  const size = RADIUS * 2 + NODE_WIDTH;

  return (
    <div>
      {/* Desktop: nodes arranged in a ring */}
      <div
        className="hidden lg:block relative mx-auto"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute rounded-full border-2 border-dashed border-primary/20"
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        />
        {centerLabel && (
          <div className="absolute left-1/2 top-1/2 w-36 text-center -translate-x-1/2 -translate-y-1/2">
            <p className="text-sm font-semibold text-primary-dark leading-snug">
              {centerLabel}
            </p>
          </div>
        )}
        {steps.map((step, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);
          return (
            <div
              key={step.label}
              className="absolute text-center"
              style={{
                width: NODE_WIDTH,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-semibold mb-2">
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-primary-dark mb-1">
                {step.label}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile/tablet: stacked list */}
      <ol className="lg:hidden space-y-6">
        {steps.map((step, i) => (
          <li key={step.label} className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {i + 1}
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary-dark mb-1">
                {step.label}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
