"use client";

import { useReveal, useRevealGroup } from "@/hooks/use-reveal";
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

// The foundation line lands after the pillars have all risen.
const FOUNDATION_DELAY_MS = 750;

export function QualityPillars({
  pillars,
  foundation,
  heading = "A Culture of Quality & Safety",
  subtitle = "Not a function — the foundation.",
}: QualityPillarsProps) {
  const { ref, inView, item } = useRevealGroup("rise");
  const { ref: foundationRef, props: foundationProps } = useReveal("fade", { offsetMs: FOUNDATION_DELAY_MS });

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
            {...item(i)}
          >
            <HubNavCard {...pillar} accent={i % 2 === 0 ? "teal" : "purple"} />
          </div>
        ))}
      </div>

      <div
        ref={foundationRef}
        {...foundationProps}
        className={`border-t border-dashed border-gray-300 pt-4 ${foundationProps.className}`}
      >
        <p className="text-sm text-muted">{foundation.join(" · ")}</p>
      </div>
    </div>
  );
}
