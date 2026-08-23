import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { BenefitCard } from "@/components/careers/benefit-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { benefits } from "@/data/careers";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Benefits",
  description:
    "Discover the full range of benefits available to Lotus Care employees — competitive pay, generous leave, wellbeing support, and more.",
};

export default function BenefitsPage() {
  return (
    <>
      <CareersHero
        title="Your Wellbeing Matters"
        subtitle="We invest in our people — because happy, supported staff deliver the best care."
        compact
        image="/images/stock/warm-home.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />

          <div className="mt-8">
            <p className="text-foreground leading-relaxed max-w-2xl mb-10">
              At Lotus Care, we recognise that great care starts with great people. Our
              benefits package is designed to support your financial wellbeing, your
              career growth, and your life outside of work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  benefit={benefit}
                  accent={index % 2 === 0 ? "teal" : "purple"}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>

      <CareersCTAStrip
        heading="Sounds Good?"
        body="Explore our open roles and start your journey with Lotus Care."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryLabel="Career Growth"
        secondaryHref="/careers/why-us"
      />
    </>
  );
}
