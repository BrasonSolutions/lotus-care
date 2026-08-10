"use client";

import { useInView } from "@/hooks/use-in-view";

interface Spoke {
  label: string;
  description: string;
}

interface HubAndSpokeProps {
  core: { label: string; subtext?: string };
  spokes: Spoke[];
}

const RADIUS = 325;
const NODE_WIDTH = 220;
const HUB_SIZE = NODE_WIDTH;
const CORE_POP_MS = 300;
const STAGGER_MS = 90;

export function HubAndSpoke({ core, spokes }: HubAndSpokeProps) {
  const { ref, inView } = useInView();
  const count = spokes.length;
  const size = RADIUS * 2 + NODE_WIDTH;

  return (
    <div ref={ref}>
      {/* Desktop: core + radiating spokes */}
      <div
        className="hidden lg:block relative mx-auto"
        style={{ width: size, height: size }}
      >
        {spokes.map((spoke, i) => {
          const angleDeg = (360 / count) * i - 90;
          return (
            <div
              key={`line-${spoke.label}`}
              className="absolute spoke-line-flow"
              style={{
                left: "50%",
                top: "50%",
                width: RADIUS,
                height: 2,
                transformOrigin: "0 0",
                transform: `rotate(${angleDeg}deg)`,
              }}
              aria-hidden="true"
            />
          );
        })}

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ width: HUB_SIZE, height: HUB_SIZE }}
        >
          <div
            className={`pop-item w-full h-full rounded-full bg-primary-dark text-white flex flex-col items-center justify-center text-center p-5 shadow-md ${
              inView ? "in-view" : ""
            }`}
          >
            <p className="text-base font-semibold leading-snug">{core.label}</p>
            {core.subtext && (
              <p className="text-sm text-white/80 mt-2 leading-snug">
                {core.subtext}
              </p>
            )}
          </div>
        </div>

        {spokes.map((spoke, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);
          return (
            <div
              key={spoke.label}
              className="absolute text-center z-10"
              style={{
                width: NODE_WIDTH,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`pop-item bg-white rounded-xl border border-gray-100 border-l-4 shadow-sm p-4 ${
                  i % 2 === 0 ? "border-l-primary-dark" : "border-l-purple-600"
                } ${inView ? "in-view" : ""}`}
                style={{ transitionDelay: `${CORE_POP_MS + i * STAGGER_MS}ms` }}
              >
                <h3 className="text-base font-semibold text-primary-dark mb-1">
                  {spoke.label}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {spoke.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/tablet: core banner + stacked list */}
      <div className="lg:hidden">
        <div className="text-center mb-6">
          <div
            className={`inline-block bg-primary-dark text-white rounded-2xl px-6 py-4 pop-item ${
              inView ? "in-view" : ""
            }`}
          >
            <p className="font-semibold">{core.label}</p>
            {core.subtext && (
              <p className="text-xs text-white/80 mt-1">{core.subtext}</p>
            )}
          </div>
        </div>
        <ul className="space-y-4">
          {spokes.map((spoke, i) => (
            <li
              key={spoke.label}
              className={`bg-white rounded-xl border border-gray-100 border-l-4 shadow-sm p-4 pop-item ${
                i % 2 === 0 ? "border-l-primary-dark" : "border-l-purple-600"
              } ${inView ? "in-view" : ""}`}
              style={{ transitionDelay: `${CORE_POP_MS + i * STAGGER_MS}ms` }}
            >
              <h3 className="text-sm font-semibold text-primary-dark mb-1">
                {spoke.label}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {spoke.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
