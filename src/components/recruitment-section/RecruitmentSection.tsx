"use client";

import { useInView } from "@/hooks/use-in-view";
import Link from "next/link";
import { OccupopJobCard } from "@/components/careers/job-card/OccupopJobCard";
import type { NormalizedJob } from "@/lib/occupop";
import { Container } from "@/components/layout";
import { Button } from "@/components/button";

interface RecruitmentSectionProps {
  title?: string;
  description: string[];
  note?: string;
  /** Live Occupop roles; `null` when the fetch failed (or no API token). */
  jobs: NormalizedJob[] | null;
  ctas?: Array<{ label: string; href: string; variant: "primary" | "outline" }>;
}

export function RecruitmentSection({
  title = "Join Our Team",
  description,
  note,
  jobs,
  ctas = [
    { label: "Explore All Roles", href: "/careers/open-roles", variant: "primary" },
    { label: "Life at Lotus Care", href: "/careers/why-us", variant: "outline" },
  ],
}: RecruitmentSectionProps) {
  const { ref, inView } = useInView();

  const featuredJobs = jobs?.slice(0, 3) ?? [];

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

          {/* Live roles from Occupop — same card and fallback copy as /careers/open-roles */}
          {jobs === null ? (
            <p className="text-muted text-center mb-10">
              We&apos;re having trouble loading roles right now. Please check back soon.
            </p>
          ) : featuredJobs.length === 0 ? (
            <p className="text-muted text-center mb-10">
              There are no open roles right now, but we&apos;re always looking for great people.{" "}
              <Link href="/careers/contact" className="text-primary-dark font-semibold underline focus-ring rounded">
                Register your interest
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {featuredJobs.map((job) => (
                <OccupopJobCard key={job.uuid} job={job} />
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctas.map((cta) => (
              <Button key={cta.label} href={cta.href} variant={cta.variant} size="lg">
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
