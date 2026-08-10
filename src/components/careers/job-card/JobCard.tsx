import type { JobRole } from "@/data/jobs";
import { departmentLabels } from "@/data/jobs";

interface JobCardProps {
  job: JobRole;
}

const typeLabels: Record<JobRole["type"], string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  casual: "Casual",
};

const typeColors: Record<JobRole["type"], string> = {
  "full-time": "bg-primary/10 text-primary-dark",
  "part-time": "bg-accent/10 text-primary-dark",
  casual: "bg-gray-100 text-muted",
};

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 card-hover">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-primary-dark leading-snug">
          {job.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[job.type]}`}
        >
          {typeLabels[job.type]}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted mb-3">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {departmentLabels[job.department]}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
      </div>

      <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
        {job.shortDescription}
      </p>

      <a
        href={`/careers/open-roles/${job.slug}`}
        className="block text-center bg-primary-dark text-white py-2.5 rounded-full text-sm font-semibold hover:bg-teal-800 transition-colors focus-ring"
      >
        View Role
      </a>
    </div>
  );
}
