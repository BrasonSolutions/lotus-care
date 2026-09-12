"use client";

import type { ReactNode } from "react";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import type { Testimonial } from "@/data/careers";
import { useInView } from "@/hooks/use-in-view";

const STAGGER_MS = 90;

export interface TestimonialGridItem {
  testimonial: Testimonial;
  clampQuote?: boolean;
  action?: ReactNode;
}

interface TestimonialGridProps {
  items: TestimonialGridItem[];
}

/** Same staggered pop-in every other card grid on the Model of Care page
 * uses (CircularCycle/Timeline/KeywordCards/SpecialtyChips/PrincipleCards) —
 * TestimonialCard has no hover transition of its own, so (like
 * SpecialtyChips) no reveal/hover wrapper-split is needed here. */
export function TestimonialGrid({ items }: TestimonialGridProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map(({ testimonial, clampQuote, action }, i) => (
        <div
          key={`${testimonial.initials}-${testimonial.quote}`}
          className={`pop-item ${inView ? "in-view" : ""}`}
          style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
        >
          <TestimonialCard testimonial={testimonial} clampQuote={clampQuote} action={action} />
        </div>
      ))}
    </div>
  );
}
