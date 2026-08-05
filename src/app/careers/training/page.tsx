import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { SectionTitle } from "@/components/section-title";
import { Timeline } from "@/components/timeline";
import { trainingPrograms } from "@/data/careers";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Training & Development",
  description:
    "Lotus Care is committed to your professional growth — from day one induction through to leadership development and further education support.",
};

const typeConfig = {
  mandatory: { label: "Mandatory", color: "bg-primary/10 text-primary" },
  professional: { label: "Professional Development", color: "bg-accent/10 text-accent" },
  leadership: { label: "Leadership", color: "bg-yellow-100 text-yellow-700" },
};

const pathway = [
  { level: "1", title: "Support Worker", description: "Entry-level direct care with full induction and mandatory training." },
  { level: "2", title: "Senior Support Worker", description: "Increased responsibility, mentoring junior staff, specialised training pathways." },
  { level: "3", title: "Social Care Leader / PIC", description: "Leading a home, managing a team, regulatory compliance responsibility." },
  { level: "4", title: "Senior Services Manager", description: "Oversight of multiple homes, strategic planning, operational leadership." },
];

export default function TrainingPage() {
  return (
    <>
      <CareersHero
        title="Grow With Us"
        subtitle="We're committed to your professional development at every stage of your career."
        compact
        image="/images/stock/clinical-consultation.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />

          <div className="mt-8 max-w-2xl mb-12">
            <p className="text-foreground leading-relaxed">
              At Lotus Care, learning never stops. From your first day, you&apos;ll receive
              comprehensive induction training and ongoing support. As you grow, we fund
              your qualifications, provide access to specialist development programmes,
              and actively promote from within.
            </p>
          </div>

          {/* Career progression pathway */}
          <section className="mb-16">
            <SectionTitle
              title="Career Progression Pathway"
              subtitle="From Support Worker to Senior Services Manager — a clear path forward."
            />
            <Timeline
              orientation="horizontal"
              steps={pathway.map((step) => ({
                number: step.level,
                title: step.title,
                description: step.description,
              }))}
            />
          </section>

          {/* Training programmes grouped by type */}
          {(["mandatory", "professional", "leadership"] as const).map((type) => {
            const programs = trainingPrograms.filter((p) => p.type === type);
            const config = typeConfig[type];
            return (
              <section key={type} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${config.color}`}>
                    {config.label}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((program) => (
                    <div
                      key={program.title}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                    >
                      <h3 className="font-semibold text-primary-dark mb-1">{program.title}</h3>
                      <p className="text-sm text-foreground leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </Container>
      </div>

      <CareersCTAStrip
        heading="Invest in Your Future"
        body="Start your Lotus Care journey today and grow with a team that champions your development."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryLabel="Our Benefits"
        secondaryHref="/careers/benefits"
      />
    </>
  );
}
