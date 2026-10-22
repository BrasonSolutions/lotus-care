/** Placeholder grid shown while live Occupop roles stream in. Mirrors
 * OccupopJobCard's shell (padding, radius, border, title/chip row, two meta
 * lines, three description lines, sm pill) so the real cards replace it without
 * a layout shift. The min-heights are measured from real Occupop cards (270px
 * in a 3-up row; 269–313px single-column, where description length varies).
 * `animate-pulse` is stopped by the global reduced-motion rule. */
interface JobCardSkeletonsProps {
  count: number;
  /** Grid classes — match the grid the real cards render into. */
  className?: string;
}

const bar = "rounded-full bg-gray-100";

export function JobCardSkeletons({
  count,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
}: JobCardSkeletonsProps) {
  return (
    <div className={className} aria-busy="true">
      <span className="sr-only" role="status">
        Loading roles…
      </span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col animate-pulse min-h-[290px] md:min-h-[270px]"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={`${bar} h-5 w-2/3`} />
            <div className={`${bar} h-6 w-16 shrink-0`} />
          </div>
          <div className="space-y-2 mb-3">
            <div className={`${bar} h-4 w-3/4`} />
            <div className={`${bar} h-4 w-1/2`} />
          </div>
          <div className="space-y-2 flex-1 mb-5">
            <div className={`${bar} h-3.5 w-full`} />
            <div className={`${bar} h-3.5 w-full`} />
            <div className={`${bar} h-3.5 w-4/5`} />
          </div>
          <div className={`${bar} h-10 w-full mt-auto`} />
        </div>
      ))}
    </div>
  );
}
