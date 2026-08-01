"use client";

import { useInView } from "@/hooks/use-in-view";
import { JobCard } from "@/components/careers/job-card";
import type { JobRole as Job } from "@/data/jobs";
import { Container } from "@/components/layout";

interface RecruitmentSectionProps {
  title?: string;
  description: string[];
  note?: string;
  jobs: Job[];
  ctas?: Array<{ label: string; href: string; variant: "primary" | "outline" }>;
}

export function RecruitmentSection({
  title = "Join Our Team",
  description,
  note,
  jobs,
  ctas = [
    { label: "Explore All Roles", href: "/careers", variant: "primary" },
    { label: "Life at Lotus Care", href: "/careers/why-us", variant: "outline" },
  ],
}: RecruitmentSectionProps) {
  const { ref, inView } = useInView();

  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 3);

  return (
    <section id="careers" className="py-20 lg:py-28 bg-accent/10">
      <Container>
        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""}`}
        >
          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
              {title}
            </h2>
            {description.map((p, i) => (
              <p key={i} className="text-lg text-foreground leading-relaxed mb-3 last:mb-0">
                {p}
              </p>
            ))}
            {note && (
              <p className="text-muted mt-3">{note}</p>
            )}
          </div>

          {/* Featured roles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {featuredJobs.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctas.map((cta) =>
              cta.variant === "primary" ? (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="inline-block bg-primary text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-primary-dark transition-colors focus-ring text-center"
                >
                  {cta.label}
                </a>
              ) : (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="inline-block border-2 border-primary text-primary px-8 py-4 rounded-full text-base font-semibold hover:bg-primary hover:text-white transition-colors focus-ring text-center"
                >
                  {cta.label}
                </a>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
