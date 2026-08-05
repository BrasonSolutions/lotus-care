import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { Timeline } from "@/components/timeline";
import { FaqAccordion } from "@/components/careers/faq-accordion";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { processSteps, faqs } from "@/data/careers";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "How We Hire",
  description:
    "Learn about Lotus Care's recruitment process — from application to your first day. Clear, straightforward, and candidate-friendly.",
};

export default function HowWeHirePage() {
  return (
    <>
      <CareersHero
        title="Our Hiring Process"
        subtitle="We keep things simple, transparent, and respectful of your time."
        compact
        image="/images/stock/team-meeting.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />

          {/* Process timeline */}
          <section className="mt-8 mb-16">
            <h2 className="text-2xl font-bold text-primary-dark mb-8">
              From Application to First Day
            </h2>
            <Timeline
              orientation="horizontal"
              steps={processSteps.map((s) => ({
                number: s.step,
                title: s.title,
                description: s.description,
              }))}
            />
          </section>

          {/* Compliance note */}
          <section className="mb-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-primary-dark mb-4">
              Pre-employment Checks
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              All roles at Lotus Care require the following checks before commencement. We will
              guide you through each step once an offer has been made.
            </p>
            <ul className="space-y-3">
              {[
                "Garda Vetting (National Vetting Bureau — we process on your behalf)",
                "Two professional references (at least one from a recent employer)",
                "Occupational health clearance",
                "Proof of qualifications and NMBI/CORU registration (where applicable)",
                "Right to work in Ireland",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary-dark mb-8">
              Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
          </section>

          {/* Contact prompt */}
          <div className="text-center py-8">
            <p className="text-muted mb-4">Still have questions?</p>
            <a
              href="/careers/contact"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors focus-ring"
            >
              Contact Our Recruitment Team
            </a>
          </div>
        </Container>
      </div>

      <CareersCTAStrip
        heading="Ready to Apply?"
        body="Browse our current vacancies and take the next step in your career."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryLabel="Contact Recruitment"
        secondaryHref="/careers/contact"
      />
    </>
  );
}
