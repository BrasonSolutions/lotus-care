"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

export interface TimelineStep {
  /** Usually a number/string badge; accepts any ReactNode (e.g. an icon)
   * for callers that want something other than a plain numeral. */
  number: ReactNode;
  title: string;
  description: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  /** "solid" (default, every existing caller's look) is a filled dark-teal
   * circle with white content. "outline" is a white circle with a
   * dark-teal ring, for callers whose `number` is a coloured icon that
   * needs a light background to read against. */
  circleVariant?: "solid" | "outline";
  /** Extra classes appended to each step's `h3` title — e.g. `font-dm-sans`
   * for a caller that wants the brand display font, without changing it
   * for every other `Timeline` consumer. */
  titleClassName?: string;
}

const STAGGER_MS = 90;

// Sizes live here, not in the markup, because the outline variant carries an
// icon that needs room to read; the solid variant is a numeral and does not.
const CIRCLE_VARIANT = {
  solid: {
    color: "bg-primary-dark text-white",
    horizontal: "w-16 h-16",
    horizontalRail: "top-8",
    vertical: "w-8 h-8 -left-4",
    verticalPad: "pl-8",
    verticalRail: "ml-4",
  },
  outline: {
    color: "bg-white border-2 border-primary-dark text-primary-dark",
    horizontal: "w-20 h-20",
    horizontalRail: "top-10",
    vertical: "w-12 h-12 -left-6",
    verticalPad: "pl-10",
    verticalRail: "ml-6",
  },
} as const;

export function Timeline({
  steps,
  orientation = "vertical",
  className = "",
  circleVariant = "solid",
  titleClassName = "",
}: TimelineProps) {
  const { ref, inView } = useInView();
  const circle = CIRCLE_VARIANT[circleVariant];

  const verticalList = (
    <ol className={`relative border-l-2 border-primary/30 space-y-8 ${circle.verticalRail}`}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`relative pop-item ${circle.verticalPad} ${inView ? "in-view" : ""}`}
          style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
        >
          <span
            className={`absolute flex items-center justify-center rounded-full font-bold text-sm ${circle.vertical} ${circle.color}`}
          >
            {step.number}
          </span>
          <h3 className={`font-semibold text-primary-dark mb-1 ${titleClassName}`}>{step.title}</h3>
          <p className="text-sm text-muted leading-relaxed">{step.description}</p>
        </li>
      ))}
    </ol>
  );

  if (orientation === "vertical") {
    return (
      <div ref={ref} className={className}>
        {verticalList}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <div className="hidden md:block relative">
        <div
          className={`absolute left-0 right-0 h-0.5 bg-primary/20 ${circle.horizontalRail}`}
          aria-hidden="true"
        />
        <ol
          className="relative grid gap-8"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`flex flex-col items-center text-center pop-item ${inView ? "in-view" : ""}`}
              style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
            >
              <div
                className={`relative z-10 flex items-center justify-center shrink-0 rounded-full font-bold text-xl shadow-md ${circle.horizontal} ${circle.color}`}
              >
                {step.number}
              </div>
              <div className="mt-4">
                <h3 className={`font-semibold text-primary-dark mb-1 ${titleClassName}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-foreground leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="md:hidden">{verticalList}</div>
    </div>
  );
}
