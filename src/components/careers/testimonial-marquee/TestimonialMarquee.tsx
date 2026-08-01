"use client";

import type { Testimonial } from "@/data/careers";
import { TestimonialCard } from "@/components/careers/testimonial-card";

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
}

export function TestimonialMarquee({ testimonials }: TestimonialMarqueeProps) {
  return (
    <div
      className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
    >
      <div className="testimonial-marquee-track flex gap-5 w-max px-4 sm:px-6 lg:px-8">
        {testimonials.map((t, i) => (
          <div key={`a-${i}-${t.name}`} className="w-[320px] shrink-0">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
        {testimonials.map((t, i) => (
          <div key={`b-${i}-${t.name}`} className="w-[320px] shrink-0" aria-hidden="true">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
