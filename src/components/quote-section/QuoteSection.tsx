"use client";

import { useInView } from "@/hooks/use-in-view";
import { Container } from "@/components/layout";
import { Blob } from "@/components/blob";
import { QuoteCard } from "./QuoteCard";
import type { HomeQuote } from "@/data/testimonial";

interface QuoteSectionProps {
  quote: HomeQuote;
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  const { ref, inView } = useInView();

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
          <div className={`reveal ${inView ? "in-view" : ""}`}>
            <p className="font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-blossom">
              {quote.eyebrow}
            </p>
            <h2 className="font-dm-sans font-bold text-3xl lg:text-4xl leading-tight text-teal-50 mt-4">
              {quote.heading}
            </h2>
            <p className="text-base text-teal-100 mt-4 max-w-md">
              {quote.subtext}
            </p>
          </div>

          <QuoteCard
            quote={quote.quote}
            name={quote.name}
            date={quote.date}
            tone="teal"
            className={`reveal reveal-delay-2 ${inView ? "in-view" : ""}`}
          />
        </div>
      </Container>
    </section>
  );
}
