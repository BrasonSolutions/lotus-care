"use client";

import { useReveal } from "@/hooks/use-reveal";
import { Container } from "@/components/layout";
import { Blob } from "@/components/blob";
import { QuoteCard } from "./QuoteCard";
import type { HomeQuote } from "@/data/testimonial";

interface QuoteSectionProps {
  quote: HomeQuote;
  /** Optional CTA below the intro copy — rendered only when both are passed. */
  ctaHref?: string;
  ctaLabel?: string;
}

export function QuoteSection({ quote, ctaHref, ctaLabel }: QuoteSectionProps) {
  const { ref, props } = useReveal();
  const { ref: secondRef, props: secondProps } = useReveal("rise", { index: 2 });

  return (
    <section className="relative overflow-hidden bg-teal-700 py-16 md:py-20 lg:py-24">
      <Blob
        color="teal"
        variant={2}
        opacity={0.12}
        className="absolute -top-20 -left-14 w-64 h-64 rotate-[-18deg]"
      />

      <Container className="relative">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          <div ref={ref} {...props} className={props.className}>
            <p className="font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-blossom">
              {quote.eyebrow}
            </p>
            <h2 className="font-dm-sans font-bold text-3xl lg:text-4xl leading-tight text-teal-50 mt-4">
              {quote.heading}
            </h2>
            <p className="text-base text-teal-100 mt-4 max-w-md">
              {quote.subtext}
            </p>
            {ctaHref && ctaLabel && (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blossom hover:text-white transition-colors focus-ring rounded mt-6"
              >
                {ctaLabel}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          <div ref={secondRef} {...secondProps}>
            <QuoteCard quote={quote.quote} name={quote.name} date={quote.date} tone="teal" />
          </div>
        </div>
      </Container>
    </section>
  );
}
