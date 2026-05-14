"use client";

import { useState, useMemo } from "react";
import { JobFilter } from "@/components/careers/job-filter";
import { OccupopJobCard } from "@/components/careers/job-card/OccupopJobCard";
import type { NormalizedJob } from "@/lib/occupop";

interface OpenRolesClientProps {
  jobs: NormalizedJob[];
}

export function OpenRolesClient({ jobs }: OpenRolesClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = useMemo(() => {
    const types = Array.from(new Set(jobs.map((j) => j.contractType))).sort();
    return [
      { value: "all", label: "All Roles" },
      ...types.map((t) => ({ value: t, label: t })),
    ];
  }, [jobs]);

  const filtered =
    activeFilter === "all"
      ? jobs
      : jobs.filter((j) => j.contractType === activeFilter);

  return (
    <>
      <div className="mt-8 mb-6">
        <JobFilter filters={filters} active={activeFilter} onChange={setActiveFilter} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job) => (
            <OccupopJobCard key={job.uuid} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-16">
          No roles found in this category right now.
        </p>
      )}
    </>
  );
}
