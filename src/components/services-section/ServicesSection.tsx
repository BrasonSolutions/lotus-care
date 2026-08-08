"use client";

import { useInView } from "@/hooks/use-in-view";
import type { Service } from "@/data/services";
import { SectionTitle } from "@/components/section-title";
import { ServiceCard } from "@/components/service-card";
import { Container } from "@/components/layout";
import { LotusMark } from "@/components/lotus-mark";
import { Blob } from "@/components/blob";

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  services: Service[];
}

export function ServicesSection({
  title = "Our Services",
  subtitle = "Comprehensive disability support services designed around each individual's needs and aspirations.",
  services,
}: ServicesSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { ref: lotusRef, inView: lotusInView } = useInView();

  return (
    <section id="services" className="relative overflow-hidden py-20 lg:py-28 bg-warm-bg">
      <Blob color="purple" variant={2} className="absolute -top-16 -left-16 w-64 h-64" />
      <Blob color="teal" variant={1} className="absolute -bottom-14 -right-14 w-72 h-72" />

      <Container className="relative">
        {/* Lotus motif beside the heading — absolutely positioned so it never
            consumes layout width and can't push SectionTitle off page-centre.
            Out of flow entirely, so it reserves no box and can't cause CLS.
            Own IntersectionObserver (same .lotus-bloom pattern as QualityPillars),
            independent of the grid's reveal trigger below. Hidden below `lg`
            where there isn't horizontal room beside the centred heading. */}
        <div ref={lotusRef} className="relative">
          <LotusMark
            tone="color"
            className={`hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 lotus-bloom ${lotusInView ? "in-view" : ""}`}
          />
          <SectionTitle title={title} subtitle={subtitle} />
        </div>

        <div
          ref={ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </div>
      </Container>
    </section>
  );
}
