"use client";

import { useInView } from "@/hooks/use-in-view";

export interface TimelineStep {
  number: number | string;
  title: string;
  description: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const STAGGER_MS = 90;

export function Timeline({ steps, orientation = "vertical", className = "" }: TimelineProps) {
  const { ref, inView } = useInView();

  const verticalList = (
    <ol className="relative border-l-2 border-primary/30 ml-4 space-y-8">
      {steps.map((step, i) => (
        <li
          key={step.number}
          className={`relative pl-8 pop-item ${inView ? "in-view" : ""}`}
          style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
        >
          <span className="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
            {step.number}
          </span>
          <h3 className="font-semibold text-primary-dark mb-1">{step.title}</h3>
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
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200" aria-hidden="true" />
        <ol
          className="relative grid gap-8"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => (
            <li
              key={step.number}
              className={`flex flex-col items-center text-center pop-item ${inView ? "in-view" : ""}`}
              style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
            >
              <div className="relative z-10 flex items-center justify-center w-16 h-16 shrink-0 rounded-full bg-primary text-white font-bold text-xl shadow-md">
                {step.number}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-primary-dark mb-1">{step.title}</h3>
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
