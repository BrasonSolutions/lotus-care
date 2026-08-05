"use client";

import { useInView } from "@/hooks/use-in-view";
import { HubNavCard } from "@/components/careers/hub-nav-card";
import { LotusMark } from "@/components/lotus-mark";

interface Pillar {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface QualityPillarsProps {
  pillars: Pillar[];
  foundation: string[];
  heading?: string;
  subtitle?: string;
}

const PILLAR_STAGGER_MS = 90;
const FOUNDATION_DELAY_MS = 750;

export function QualityPillars({
  pillars,
  foundation,
  heading = "A Culture of Quality & Safety",
  subtitle = "Not a function — the foundation.",
}: QualityPillarsProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className="text-center">
      <LotusMark
        tone="color"
        className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 lotus-bloom ${inView ? "in-view" : ""}`}
      />

      <h3 className="text-2xl sm:text-3xl font-bold text-primary-dark">{heading}</h3>
      <p className="text-muted mt-2 mb-10">{subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-left">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.title}
            className={`pillar-rise ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: `${i * PILLAR_STAGGER_MS}ms` }}
          >
            <HubNavCard {...pillar} accent={i % 2 === 0 ? "teal" : "purple"} />
          </div>
        ))}
      </div>

      <div
        className={`border-t border-dashed border-gray-300 pt-4 foundation-fade ${inView ? "in-view" : ""}`}
        style={{ transitionDelay: `${FOUNDATION_DELAY_MS}ms` }}
      >
        <p className="text-sm text-muted">{foundation.join(" · ")}</p>
      </div>
    </div>
  );
}
