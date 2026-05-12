import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CareersBreadcrumb from "@/components/careers/careers-breadcrumb";
import JobCard from "@/components/careers/job-card";
import CareersCTAStrip from "@/components/careers/careers-cta-strip";
import { jobs, departmentLabels } from "@/data/jobs";
import { benefits } from "@/data/careers";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) return {};
  return {
    title: job.title,
    description: job.shortDescription,
  };
}

const typeLabels = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  casual: "Casual",
};

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();

  const related = jobs
    .filter((j) => j.slug !== slug && j.department === job.department)
    .slice(0, 2);

  const highlightBenefits = benefits.slice(0, 4);

  return (
    <>
      {/* Job header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-accent/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {departmentLabels[job.department]}
              </span>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {typeLabels[job.type]}
              </span>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {job.location}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{job.title}</h1>
            <p className="text-white/80 text-lg">{job.shortDescription}</p>
          </div>
        </div>
      </section>

      <div className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CareersBreadcrumb />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-xl font-bold text-primary-dark mb-4">About the Role</h2>
                <p className="text-foreground leading-relaxed">{job.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary-dark mb-4">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-foreground text-sm">
                      <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-primary-dark mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-foreground text-sm">
                      <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* What we offer */}
              <section>
                <h2 className="text-xl font-bold text-primary-dark mb-4">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlightBenefits.map((b) => (
                    <div key={b.title} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100">
                      <span className="text-2xl shrink-0" aria-hidden="true">{b.icon}</span>
                      <div>
                        <p className="font-medium text-primary-dark text-sm">{b.title}</p>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/careers/benefits" className="mt-4 inline-block text-sm text-primary hover:text-primary-dark transition-colors focus-ring rounded font-medium">
                  View all benefits →
                </a>
              </section>
            </div>

            {/* Apply sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-32">
                <h3 className="font-bold text-primary-dark text-lg mb-4">Apply for This Role</h3>
                <p className="text-sm text-muted mb-6">
                  Ready to join us? Get in touch with our recruitment team and we&apos;ll guide you through the next steps.
                </p>
                <a
                  href={`/careers/contact?role=${encodeURIComponent(job.title)}`}
                  className="block text-center bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors focus-ring mb-3"
                >
                  Apply Now
                </a>
                <a
                  href="/careers/how-we-hire"
                  className="block text-center border border-gray-200 text-foreground py-3 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors focus-ring"
                >
                  How We Hire
                </a>
              </div>
            </aside>
          </div>

          {/* Related Roles */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Related Roles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map((j) => (
                  <JobCard key={j.slug} job={j} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <CareersCTAStrip
        heading="Interested in joining us?"
        body="Take the next step and get in touch with our recruitment team."
        ctaLabel="Apply Now"
        ctaHref="/careers/contact"
        secondaryLabel="View All Roles"
        secondaryHref="/careers/open-roles"
      />
    </>
  );
}
