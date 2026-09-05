"use client";

import { useRevealGroup } from "@/hooks/use-reveal";

interface CircularCycleStep {
  label: string;
  description: string;
}

interface CircularCycleProps {
  steps: CircularCycleStep[];
  centerLabel?: string;
}

const RADIUS = 275;
const NODE_WIDTH = 240;
const BADGE_SIZE = 50;
const CENTER_LABEL_WIDTH = 180;
export function CircularCycle({ steps, centerLabel }: CircularCycleProps) {
  const { ref, item } = useRevealGroup();
  const count = steps.length;
  const size = RADIUS * 2 + NODE_WIDTH;

  return (
    <div ref={ref}>
      {/* Desktop: nodes arranged in a ring */}
      <div
        className="hidden lg:block relative mx-auto"
        style={{ width: size, height: size }}
      >
        <svg
          className="absolute"
          width={RADIUS * 2}
          height={RADIUS * 2}
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          aria-hidden="true"
        >
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={RADIUS - 1}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity={0.25}
            strokeWidth={2}
            strokeDasharray="8 8"
            className="cycle-ring-flow"
          />
        </svg>
        {centerLabel && (
          <div
            className="absolute left-1/2 top-1/2 text-center -translate-x-1/2 -translate-y-1/2"
            style={{ width: CENTER_LABEL_WIDTH }}
          >
            <p className="text-base font-semibold text-primary-dark leading-snug">
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
                transform: `translate(-50%, -${BADGE_SIZE / 2}px)`,
              }}
            >
              <div
                {...item(i)}
              >
                <div
                  className={`mx-auto rounded-full text-white flex items-center justify-center font-semibold text-lg mb-2 ${
                    i % 2 === 0 ? "bg-primary-dark" : "bg-purple-600"
                  }`}
                  style={{ width: BADGE_SIZE, height: BADGE_SIZE }}
                >
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold text-primary-dark mb-1">
                  {step.label}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/tablet: stacked list */}
      <ol className="lg:hidden space-y-6">
        {steps.map((step, i) => (
          <li
            key={step.label}
            {...item(i)}
            className={`flex gap-4 ${item(i).className}`}
          >
            <div
              className={`w-10 h-10 shrink-0 rounded-full text-white flex items-center justify-center font-semibold ${
                i % 2 === 0 ? "bg-primary-dark" : "bg-purple-600"
              }`}
            >
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
