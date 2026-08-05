import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { SectionTitle } from "@/components/section-title";
import { Reveal } from "@/components/reveal";
import { QualityPillars } from "@/components/quality/quality-pillars";
import { qualityHub, hubCards, qualityFoundationPrinciples, anonymizedTestimonial } from "@/data/quality";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Overview",
  description: qualityHub.heroSubtitle,
};

export default function QualityPage() {
  return (
    <>
      <CareersHero
        title={qualityHub.heroTitle}
        subtitle={qualityHub.heroSubtitle}
        image="/images/stock/warm-home.jpg"
      />

      {/* Intro */}
      <section className="py-14 sm:py-16">
        <Reveal>
          <Container width="reading" padded className="text-center">
            <p className="text-lg text-muted leading-relaxed">{qualityHub.intro}</p>
          </Container>
        </Reveal>
      </section>

      {/* Quality pillars infographic */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <QualityPillars pillars={hubCards} foundation={qualityFoundationPrinciples} />
        </Container>
      </section>

      {/* Resident testimonial pull-quote (anonymized) */}
      <section className="py-16 sm:py-20 bg-white">
        <Reveal>
          <Container width="reading" padded className="text-center">
            <SectionTitle
              title="In Their Own Words"
              subtitle="What the people we support say about life at Lotus Care."
            />
            <TestimonialCard testimonial={anonymizedTestimonial} />
          </Container>
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
