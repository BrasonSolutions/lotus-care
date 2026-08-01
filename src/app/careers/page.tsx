import type { Metadata } from "next";
import Link from "next/link";
import { CareersHero } from "@/components/careers/careers-hero";
import { HubNavCard } from "@/components/careers/hub-nav-card";
import { JobCard } from "@/components/careers/job-card";
import { TestimonialMarquee } from "@/components/careers/testimonial-marquee";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { SectionTitle } from "@/components/section-title";
import { getCareersIcon } from "@/components/careers/careers-icons";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/layout";
import { jobs } from "@/data/jobs";
import { testimonials, companyValues, type Testimonial } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities at Lotus Care. Join a values-driven team making a real difference in the lives of people with disabilities.",
};

const hubCards = [
  {
    icon: "briefcase",
    title: "Open Roles",
    description: "Browse our current vacancies across care, nursing, clinical, and administration.",
    href: "/careers/open-roles",
  },
  {
    icon: "sparkles",
    title: "Why Work With Us",
    description: "Discover our culture, values, and why our team loves working at Lotus Care.",
    href: "/careers/why-us",
  },
  {
    icon: "gift",
    title: "Benefits",
    description: "Competitive pay, generous leave, wellbeing support, and much more.",
    href: "/careers/benefits",
  },
  {
    icon: "academic-cap",
    title: "Training & Development",
    description: "Funded training, career progression pathways, and a commitment to your growth.",
    href: "/careers/training",
  },
  {
    icon: "clipboard-list",
    title: "How We Hire",
    description: "Understand our recruitment process and get answers to common questions.",
    href: "/careers/how-we-hire",
  },
  {
    icon: "envelope",
    title: "Contact Recruitment",
    description: "Speak directly to our Talent Acquisition team — we'd love to hear from you.",
    href: "/careers/contact",
  },
];

const featuredJobs = jobs.filter((j) => j.featured);

// Placeholder — replace once more real testimonials are collected.
const placeholderTestimonials: Testimonial[] = [
  {
    name: "Lorem Ipsum",
    role: "Placeholder Role",
    initials: "LI",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Dolor Sit",
    role: "Sample Testimonial",
    initials: "DS",
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export default function CareersPage() {
  return (
    <>
      <CareersHero
        title="Build a Career That Matters"
        subtitle="Join the Lotus Care team and make a genuine difference in the lives of people with disabilities every single day."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        image="/images/stock/dignity-activity.jpg"
      />

      {/* Team testimonials */}
      <section className="bg-white py-16 sm:py-20 border-b border-gray-100">
        <Container>
          <SectionTitle
            title="Hear From Our Team"
            subtitle="Real stories from the people who make Lotus Care what it is."
          />
        </Container>
        <TestimonialMarquee testimonials={[...testimonials, ...placeholderTestimonials]} />
      </section>

      {/* Hub nav cards */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle
            title="Everything You Need to Know"
            subtitle="From open roles to our hiring process — explore what a career at Lotus Care looks like."
          />
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hubCards.map((card, i) => (
              <HubNavCard key={card.title} {...card} accent={i % 2 === 0 ? "teal" : "purple"} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Featured Roles */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">
                Featured Roles
              </h2>
              <p className="text-muted">Current opportunities we&apos;re actively hiring for.</p>
            </div>
            <Link
              href="/careers/open-roles"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors focus-ring rounded shrink-0"
            >
              View all roles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </Reveal>
          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/careers/open-roles"
              className="inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors focus-ring rounded"
            >
              View all open roles →
            </Link>
          </div>
        </Container>
      </section>

      {/* Company Values */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle title="Our Values" />
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {companyValues.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {getCareersIcon(value.icon)}
                </div>
                <h3 className="font-semibold text-primary-dark mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <CareersCTAStrip
        heading="Ready to Take the Next Step?"
        body="Explore our open roles and find your place in the Lotus Care team."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryLabel="Contact Recruitment"
        secondaryHref="/careers/contact"
      />
    </>
  );
}
