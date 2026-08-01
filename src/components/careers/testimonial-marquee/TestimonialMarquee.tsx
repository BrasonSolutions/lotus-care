"use client";

import type { Testimonial } from "@/data/careers";
import { TestimonialCard } from "@/components/careers/testimonial-card";

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
}

export function TestimonialMarquee({ testimonials }: TestimonialMarqueeProps) {
  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
    >
      <div className="testimonial-marquee-track flex gap-5 w-max">
        {testimonials.map((t, i) => (
          <div key={`a-${i}-${t.name}`} className="w-[320px] shrink-0">
            <TestimonialCard testimonial={t} clampQuote />
          </div>
        ))}
        {testimonials.map((t, i) => (
          <div key={`b-${i}-${t.name}`} className="w-[320px] shrink-0" aria-hidden="true">
            <TestimonialCard testimonial={t} clampQuote />
          </div>
        ))}
      </div>
    </div>
  );
}
