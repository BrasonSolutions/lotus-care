"use client";

import { useInView } from "@/hooks/use-in-view";
import { getCareersIcon } from "@/components/careers/careers-icons";
import type { CompanyValue } from "@/data/careers";

interface ValuesGridProps {
  values: CompanyValue[];
}

/** Matches the homepage's "Join Our Team" cards (`JobCard`/
 * `RecruitmentSection`) exactly, not `ServiceCard`'s per-card stagger —
 * that's the actual sibling pattern here (the other careers-flavoured
 * card grid), and this repo already has two different reveal conventions;
 * picking the one from the more directly comparable section instead of
 * inventing a third. One `reveal` on the grid as a whole (no per-card
 * delay), each card carries only the hover treatment
 * (`hover:shadow-md hover:-translate-y-0.5`, `JobCard`'s exact hover
 * classes) — cards don't animate independently, only the whole grid does,
 * same as "Join Our Team". */
export function ValuesGrid({ values }: ValuesGridProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className={`reveal ${inView ? "in-view" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
      {values.map((value) => (
        <div
          key={value.title}
          className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
