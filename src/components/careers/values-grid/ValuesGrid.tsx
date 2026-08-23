"use client";

import { useInView } from "@/hooks/use-in-view";
import { getCareersIcon } from "@/components/careers/careers-icons";
import type { CompanyValue } from "@/data/careers";

interface ValuesGridProps {
  values: CompanyValue[];
}

/** Staggered-reveal card grid — same convention as `ServiceCard`/
 * `ServicesSection`: one `useInView` on the grid, each card gets
 * `reveal-delay-{index+1}` (globals.css's existing 1-5 stagger steps) plus
 * the sitewide `card-hover` lift on interaction. */
export function ValuesGrid({ values }: ValuesGridProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {values.map((value, i) => (
        <div
          key={value.title}
          className={`card-hover reveal reveal-delay-${i + 1} ${inView ? "in-view" : ""} text-center p-8 bg-neutral-50 rounded-2xl border border-gray-100`}
        >
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 text-primary [&>svg]:w-8 [&>svg]:h-8">
            {getCareersIcon(value.icon)}
          </div>
          <h3 className="font-dm-sans font-semibold text-lg text-primary-dark mb-2">
            {value.title}
          </h3>
          <p className="text-base text-muted leading-relaxed">{value.description}</p>
        </div>
      ))}
    </div>
  );
}
