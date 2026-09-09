import type { NormalizedJob } from "@/lib/occupop";
import { Button } from "@/components/button";
import { Chip, type ChipTone } from "@/components/chip";

interface OccupopJobCardProps {
  job: NormalizedJob;
}

function contractTone(type: string): ChipTone {
  const t = type.toLowerCase();
  if (t.includes("full")) return "tealSoft";
  if (t.includes("part")) return "accentSoft";
  return "neutral";
}

export function OccupopJobCard({ job }: OccupopJobCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-primary-dark leading-snug">
          {job.title}
        </h3>
        <Chip tone={contractTone(job.contractType)} className="shrink-0">
          {job.contractType}
        </Chip>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted mb-3">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Posted {job.postedDate}
        </span>
      </div>

      {job.shortDescription && (
        <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
          {job.shortDescription}
        </p>
      )}

      <Button
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        size="sm"
        fullWidth
        className="mt-auto"
      >
        View Role
      </Button>
    </div>
  );
}
