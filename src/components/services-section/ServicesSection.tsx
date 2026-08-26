"use client";

import { useInView } from "@/hooks/use-in-view";
import type { Service } from "@/data/services";
import { SectionTitle } from "@/components/section-title";
import { ServiceCard } from "@/components/service-card";
import { Container } from "@/components/layout";
import { LotusMark } from "@/components/lotus-mark";
import { Blob } from "@/components/blob";

export interface ServiceGroup {
  /** Anchor id for this group's heading, so the navbar can link to it. */
  id?: string;
  title: string;
  subtitle: string;
  services: Service[];
}

interface ServicesSectionProps {
  id?: string;
  groups: ServiceGroup[];
}

/** One `<section>` holding every service group (issue #90). Rendering a
    section per group meant a second set of corner blobs, and the seam
    between the two sliced both sets in half — the blobs are meant to bleed
    off the page edge, not to be cut across the middle of it. One section,
    one set of decorations, groups stacked inside it. */
export function ServicesSection({ id = "services", groups }: ServicesSectionProps) {
  return (
    <section id={id} className="relative overflow-hidden py-20 lg:py-28 bg-warm-bg">
      <Blob color="purple" variant={2} className="absolute -top-16 -left-16 w-64 h-64" />
      <Blob color="teal" variant={1} className="absolute -bottom-14 -right-14 w-72 h-72" />

      <Container className="relative">
        {groups.map((group, i) => (
          <ServiceGroupBlock
            key={group.title}
            group={group}
            withLotus={i === 0}
            className={i > 0 ? "mt-20 lg:mt-28" : ""}
          />
        ))}
      </Container>
    </section>
  );
}

/** Its own component so each group gets its own IntersectionObserver — a
    shared one would reveal the lower grid while it is still off-screen. */
function ServiceGroupBlock({
  group,
  withLotus,
  className,
}: {
  group: ServiceGroup;
  withLotus: boolean;
  className: string;
}) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { ref: lotusRef, inView: lotusInView } = useInView();

  return (
    <div id={group.id} className={className}>
      {/* Lotus motif beside the heading — absolutely positioned so it never
          consumes layout width and can't push SectionTitle off page-centre.
          Out of flow entirely, so it reserves no box and can't cause CLS.
          Own IntersectionObserver (same .lotus-bloom pattern as QualityPillars),
          independent of the grid's reveal trigger below. Hidden below `lg`
          where there isn't horizontal room beside the centred heading.
          Only the first group shows it — one section, one motif. */}
      <div ref={lotusRef} className="relative">
        {withLotus && (
          <LotusMark
            tone="color"
            className={`hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 lotus-bloom ${lotusInView ? "in-view" : ""}`}
          />
        )}
        <SectionTitle title={group.title} subtitle={group.subtitle} />
      </div>

      <div
        ref={ref}
        className={`grid sm:grid-cols-2 gap-4 sm:gap-6 mt-8 ${
          group.services.length > 2 ? "lg:grid-cols-3" : ""
        }`}
      >
        {group.services.map((service, i) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={i}
            inView={inView}
            accent={i % 2 === 0 ? "teal" : "purple"}
          />
        ))}
      </div>
    </div>
  );
}
