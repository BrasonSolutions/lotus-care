"use client";

import { useState } from "react";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { JobFilter } from "@/components/careers/job-filter";
import { JobCard } from "@/components/careers/job-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { jobs } from "@/data/jobs";
import type { JobDepartment } from "@/data/jobs";

type FilterOption = "all" | JobDepartment;

export default function OpenRolesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filtered =
    activeFilter === "all"
      ? jobs
      : jobs.filter((j) => j.department === activeFilter);

  return (
    <>
      <CareersHero
        title="Open Roles"
        subtitle="Find your next opportunity and join a team that truly cares."
        compact
      />

      <div className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CareersBreadcrumb />

          <div className="mt-8 mb-6">
            <JobFilter active={activeFilter} onChange={setActiveFilter} />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-16">
              No roles found in this category right now.
            </p>
          )}

          {/* No match fallback */}
          <div className="mt-12 text-center p-8 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-primary-dark mb-2">
              Don&apos;t see the right role?
            </h3>
            <p className="text-muted text-sm mb-4">
              We&apos;re always looking for great people. Send us your CV and
              we&apos;ll be in touch when something suitable comes up.
            </p>
            <a
              href="/careers/contact"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors focus-ring"
            >
              Register Your Interest
            </a>
          </div>
        </div>
      </div>

      <CareersCTAStrip
        ctaLabel="Contact Our Recruitment Team"
        ctaHref="/careers/contact"
        secondaryLabel="Learn How We Hire"
        secondaryHref="/careers/how-we-hire"
      />
    </>
  );
}
