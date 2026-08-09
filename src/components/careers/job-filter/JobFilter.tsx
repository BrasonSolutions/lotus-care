"use client";

interface FilterOption {
  value: string;
  label: string;
}

interface JobFilterProps {
  filters: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

export function JobFilter({ filters, active, onChange }: JobFilterProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
              active === value
                ? "bg-primary-dark text-white"
                : "bg-white text-foreground border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Scroll fade hint on mobile */}
      <div className="sm:hidden absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-warm-bg pointer-events-none" aria-hidden="true" />
    </div>
  );
}
