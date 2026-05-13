import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { SectionTitle } from "@/components/section-title";
import { testimonials, companyValues } from "@/data/careers";

export const metadata: Metadata = {
  title: "Why Work With Us",
  description:
    "Discover why over 150 people choose to build their career at Lotus Care — culture, values, and a team that truly supports one another.",
};

export default function WhyUsPage() {
  return (
    <>
      <CareersHero
        title="A Career With Purpose"
        subtitle="At Lotus Care, we believe great care starts with great people. Here's what makes us different."
        compact
      />

      <div className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CareersBreadcrumb />
        </div>
      </div>

      {/* Values */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="What We Stand For" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {companyValues.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <span className="text-4xl mb-4 block" aria-hidden="true">
                  {value.icon}
                </span>
                <h3 className="font-semibold text-primary-dark mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture narrative */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-6">
                A Culture Built on Respect
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  We know that the wellbeing of our staff directly impacts the quality of
                  care our residents receive. That&apos;s why we&apos;ve invested heavily in
                  building a culture where every team member feels valued, supported, and
                  heard.
                </p>
                <p>
                  From structured supervision and peer mentoring to an open-door management
                  policy, we make it easy to raise concerns, share ideas, and get the
                  support you need to thrive in your role.
                </p>
                <p>
                  We&apos;re proud of the diversity of our team — people from different
                  backgrounds, disciplines, and life experiences who share a common
                  commitment to making a positive difference.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Staff retention rate", value: "87%" },
                { label: "Internal promotions per year", value: "40%" },
                { label: "Average tenure", value: "4+ yrs" },
                { label: "Staff recommend Lotus Care", value: "9/10" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-warm-bg rounded-2xl p-6 text-center"
                >
                  <p className="text-3xl font-bold text-primary mb-1">{value}</p>
                  <p className="text-sm text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Hear From Our Team" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <CareersCTAStrip
        heading="Join a Team That Cares"
        body="Explore our open roles and find where you fit at Lotus Care."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryLabel="Our Benefits"
        secondaryHref="/careers/benefits"
      />
    </>
  );
}
