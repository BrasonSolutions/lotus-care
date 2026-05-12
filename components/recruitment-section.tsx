"use client";

import { useInView } from "@/hooks/use-in-view";
import JobCard from "./careers/job-card";
import { jobs } from "@/data/jobs";

const featuredJobs = jobs.filter((j) => j.featured).slice(0, 3);

export default function RecruitmentSection() {
  const { ref, inView } = useInView();

  return (
    <section id="careers" className="py-20 lg:py-28 bg-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""}`}
        >
          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
              Join Our Team
            </h2>
            <p className="text-lg text-foreground leading-relaxed mb-3">
              Are you passionate about making a real difference in people&apos;s
              lives? Lotus Care is always looking for compassionate, dedicated
              professionals to join our growing team.
            </p>
            <p className="text-muted">
              Competitive salaries, funded training, genuine career progression,
              and a culture built on respect and inclusion.
            </p>
          </div>

          {/* Featured roles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {featuredJobs.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/careers"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-primary-dark transition-colors focus-ring text-center"
            >
              Explore All Roles
            </a>
            <a
              href="/careers/why-us"
              className="inline-block border-2 border-primary text-primary px-8 py-4 rounded-full text-base font-semibold hover:bg-primary hover:text-white transition-colors focus-ring text-center"
            >
              Life at Lotus Care
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
