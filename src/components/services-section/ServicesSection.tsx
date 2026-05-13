"use client";

import { useInView } from "@/hooks/use-in-view";
import type { Service } from "@/data/services";
import { SectionTitle } from "@/components/section-title";
import { ServiceCard } from "@/components/service-card";

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

  return (
    <section id="services" className="py-20 lg:py-28 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={title} subtitle={subtitle} />

        <div
          ref={ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
