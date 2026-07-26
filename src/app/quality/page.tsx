import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { HubNavCard } from "@/components/careers/hub-nav-card";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { Reveal } from "@/components/reveal";
import { qualityHub, hubCards, anonymizedTestimonial } from "@/data/quality";

export const metadata: Metadata = {
  title: "Overview",
  description: qualityHub.heroSubtitle,
};

export default function QualityPage() {
  return (
    <>
      <CareersHero title={qualityHub.heroTitle} subtitle={qualityHub.heroSubtitle} />

      {/* Intro */}
      <section className="py-14 sm:py-16">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-muted leading-relaxed">{qualityHub.intro}</p>
        </Reveal>
      </section>

      {/* Hub nav cards */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hubCards.map((card) => (
              <HubNavCard key={card.title} {...card} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Resident testimonial pull-quote (anonymized) */}
      <section className="py-16 sm:py-20 bg-white">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TestimonialCard testimonial={anonymizedTestimonial} />
        </Reveal>
      </section>

      <CareersCTAStrip
        heading="Have Questions About Our Standards?"
        body="Get in touch with our team to learn more about how we uphold quality and rights-based care."
        ctaLabel="Contact Us"
        ctaHref="/#contact"
        secondaryLabel="Explore Careers"
        secondaryHref="/careers"
      />
    </>
  );
}
