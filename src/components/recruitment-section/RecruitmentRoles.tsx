import Link from "next/link";
import { OccupopJobCard } from "@/components/careers/job-card/OccupopJobCard";
import type { NormalizedJob } from "@/lib/occupop";

interface RecruitmentRolesProps {
  /** Live Occupop roles; `null` when the fetch failed (or no API token). */
  jobs: NormalizedJob[] | null;
}

/** The homepage "Join Our Team" roles: first 3 live roles, or the same
 * fallback copy as /careers/open-roles. */
export function RecruitmentRoles({ jobs }: RecruitmentRolesProps) {
  if (jobs === null) {
    return (
      <p className="text-muted text-center">
        We&apos;re having trouble loading roles right now. Please check back soon.
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="text-muted text-center">
        There are no open roles right now, but we&apos;re always looking for great people.{" "}
        <Link href="/careers/contact" className="text-primary-dark font-semibold underline focus-ring rounded">
          Register your interest
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {jobs.slice(0, 3).map((job) => (
        <OccupopJobCard key={job.uuid} job={job} />
      ))}
    </div>
  );
}
