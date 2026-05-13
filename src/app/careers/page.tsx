import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { HubNavCard } from "@/components/careers/hub-nav-card";
import { JobCard } from "@/components/careers/job-card";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { jobs } from "@/data/jobs";
import { testimonials, companyValues } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities at Lotus Care. Join a values-driven team making a real difference in the lives of people with disabilities.",
};

const hubCards = [
  {
    icon: "💼",
    title: "Open Roles",
    description: "Browse our current vacancies across care, nursing, clinical, and administration.",
    href: "/careers/open-roles",
  },
  {
    icon: "🌱",
    title: "Why Work With Us",
    description: "Discover our culture, values, and why our team loves working at Lotus Care.",
    href: "/careers/why-us",
  },
  {
    icon: "🎁",
    title: "Benefits",
    description: "Competitive pay, generous leave, wellbeing support, and much more.",
    href: "/careers/benefits",
  },
  {
    icon: "📚",
    title: "Training & Development",
    description: "Funded training, career progression pathways, and a commitment to your growth.",
    href: "/careers/training",
  },
  {
    icon: "🔍",
    title: "How We Hire",
    description: "Understand our recruitment process and get answers to common questions.",
    href: "/careers/how-we-hire",
  },
  {
    icon: "✉️",
    title: "Contact Recruitment",
    description: "Speak directly to our Talent Acquisition team — we'd love to hear from you.",
    href: "/careers/contact",
  },
];

const featuredJobs = jobs.filter((j) => j.featured);

const stats = [
  { value: "150+", label: "Team Members" },
  { value: "8", label: "Homes" },
  { value: "200+", label: "Lives Supported" },
  { value: "24/7", label: "Care Provided" },
];

export default function CareersPage() {
  return (
    <>
      <CareersHero
        title="Build a Career That Matters"
        subtitle="Join the Lotus Care team and make a genuine difference in the lives of people with disabilities every single day."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
      />

      {/* Impact stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dd className="text-3xl font-bold text-primary">{value}</dd>
                <dt className="text-sm text-muted mt-1">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Hub nav cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-3">
              Everything You Need to Know
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              From open roles to our hiring process — explore what a career at Lotus Care looks like.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hubCards.map((card) => (
              <HubNavCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Roles */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">
                Featured Roles
              </h2>
              <p className="text-muted">Current opportunities we&apos;re actively hiring for.</p>
            </div>
            <a
              href="/careers/open-roles"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors focus-ring rounded shrink-0"
            >
              View all roles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <a
              href="/careers/open-roles"
              className="inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors focus-ring rounded"
            >
              View all open roles →
            </a>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark text-center mb-10">
            Our Values
          </h2>
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

      {/* Staff testimonial pull-quote */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TestimonialCard testimonial={testimonials[0]} />
          <a
            href="/careers/why-us"
            className="inline-block mt-6 text-sm font-medium text-primary hover:text-primary-dark transition-colors focus-ring rounded"
          >
            Hear more from our team →
          </a>
        </div>
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
