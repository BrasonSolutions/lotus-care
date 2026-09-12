import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { QuoteSection, TestimonialPair } from "@/components/quote-section";
import { VideoTestimonialCard } from "@/components/careers/video-testimonial-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { SectionTitle } from "@/components/section-title";
import { Timeline } from "@/components/timeline";
import { Reveal } from "@/components/reveal";
import { LotusStageIcon } from "@/components/lotus-mark";
import { ValuesGrid } from "@/components/careers/values-grid";
import { getCareersIcon } from "@/components/careers/careers-icons";
import { Container } from "@/components/layout";
import { whyUsValues, videoTestimonials } from "@/data/careers";
import { careersHearQuote, teamTestimonials } from "@/data/testimonial";

export const metadata: Metadata = {
  title: "Why Work With Us",
  description:
    "Discover what makes a career at Lotus Care different — clear progression, real support, and a team that means it.",
};

// Formerly the training page's "Career Progression Pathway" (4 stages) —
// expanded to 5 and moved here as part of merging Training into this page.
const pathway = [
  {
    title: "Social Care Assistant/Worker",
    description: "Day-to-day support, shadowed and mentored.",
  },
  {
    title: "Deputy Team Lead",
    description: "Leads shifts, mentors new starters, first step into rostering.",
  },
  {
    title: "Team Lead",
    description: "Owns compliance and HIQA standards on shift; formal supervision training.",
  },
  {
    title: "Person in Charge",
    description: "People management, budgets, and HIQA inspection readiness.",
  },
  {
    title: "Senior Services Manager",
    description: "Full HIQA registration, service leadership, budget ownership.",
  },
];

const featuredVideo = videoTestimonials.find((t) => t.name === "James O.") ?? videoTestimonials[0];

export default function WhyUsPage() {
  return (
    <>
      <CareersHero
        title="Where care becomes a"
        titleHighlight="career."
        subtitle="At Lotus Care, we believe your role should be more than just a job, it should be the beginning of a rewarding career."
        compact
        image="/images/stock/hero-why-work-with-us.jpg"
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryCtaLabel="Our Benefits"
        secondaryCtaHref="/careers/benefits"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />
        </Container>
      </div>

      {/* Career pathway */}
      <section className="py-16 sm:py-20 bg-teal-50">
        <Container>
          <SectionTitle
            dmSans
            title="A career that blooms in stages"
            subtitle="At Lotus Care, learning never stops and your career has room to grow. We'll give you the support, skills and experience you need to develop and progress, helping you reach your full potential."
          />
          <Timeline
            orientation="horizontal"
            circleVariant="outline"
            titleClassName="font-dm-sans"
            steps={pathway.map((step, i) => ({
              number: <LotusStageIcon stage={i + 1} className="w-10 h-10 md:w-14 md:h-14" />,
              title: step.title,
              description: step.description,
            }))}
          />
          <Reveal className="mt-12">
            <div className="flex items-start gap-4 bg-white border border-dashed border-teal-300 rounded-2xl p-6">
              <span className="shrink-0 text-primary-dark mt-0.5">{getCareersIcon("clock")}</span>
              <p className="text-foreground leading-relaxed">
                Progression isn&apos;t always vertical. Your journey is yours to shape. Your career
                can grow in many directions, and you may choose to explore new opportunities
                across areas such as multidisciplinary teams, training, or other specialist
                roles.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <QuoteSection quote={careersHearQuote} />
      <TestimonialPair testimonials={teamTestimonials} />

      {/* Vision & Values */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <SectionTitle dmSans title="Our Vision & Values" />
          <ValuesGrid values={whyUsValues} />
        </Container>
      </section>

      {/* Featured video */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <SectionTitle dmSans title="Lotus Stories" />
          <Reveal className="max-w-3xl mx-auto">
            <VideoTestimonialCard
              testimonial={featuredVideo}
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </Reveal>
        </Container>
      </section>

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
