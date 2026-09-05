"use client";

import { useReveal } from "@/hooks/use-reveal";
import { Container } from "@/components/layout";
import { Blob } from "@/components/blob";
import { QuoteCard } from "./QuoteCard";
import type { QuoteEntry } from "@/data/testimonial";

interface TestimonialPairProps {
  testimonials: [QuoteEntry, QuoteEntry];
}

/** Purple variant of QuoteSection: no intro column, two quotes side by
 * side. Same band mechanics (full-bleed, Blob corner, .reveal stagger),
 * different tone. */
export function TestimonialPair({ testimonials }: TestimonialPairProps) {
  const { ref: firstRef, props: firstProps } = useReveal();
  const { ref: secondRef, props: secondProps } = useReveal();

  return (
    <section className="relative overflow-hidden bg-purple-600 py-16 md:py-20 lg:py-24">
      {/* Same purple-600 fill as the band itself — mix-blend-multiply is
          what makes it read as a darker patch instead of vanishing into an
          identical background (Blob's fixed teal-500/purple-600 palette has
          no separate "darker purple" stop to reach for instead). */}
      <Blob
        color="purple"
        variant={2}
        opacity={0.4}
        className="absolute -top-16 -left-16 w-60 h-60 rotate-[-18deg] mix-blend-multiply"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {testimonials.map((t, i) => (
            <div key={t.name} ref={i === 1 ? secondRef : firstRef} {...(i === 1 ? secondProps : firstProps)}>
              <QuoteCard quote={t.quote} name={t.name} date={t.date} tone="purple" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
