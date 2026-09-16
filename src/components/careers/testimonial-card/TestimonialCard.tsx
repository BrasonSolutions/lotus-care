import type { ReactNode } from "react";
import Image from "next/image";
import type { Testimonial } from "@/data/careers";

// Two presets: the default used across careers, and a roomier listing card.
const SIZES = {
  default: { pad: "p-6", avatar: "w-10 h-10 text-sm", icon: "w-5 h-5", name: "text-sm", role: "text-xs" },
  large: { pad: "p-8 sm:p-10", avatar: "w-16 h-16 text-lg", icon: "w-8 h-8", name: "text-lg", role: "text-sm" },
} as const;

// Plain outline "person" bust (Heroicons-style, matches the stroke weight
// ServiceCard/QualityPillars use elsewhere) — the no-photo avatar fallback.
// Replaces showing raw initials, which read like a real person's initials
// even for anonymised quotes with no name behind them.
function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  // Clamps to 4 lines and fixes height so side-by-side cards align.
  clampQuote?: boolean;
  // Sits at the foot's right edge, opposite the attribution.
  action?: ReactNode;
  size?: keyof typeof SIZES;
}

export function TestimonialCard({
  testimonial,
  clampQuote = false,
  action,
  size = "default",
}: TestimonialCardProps) {
  const s = SIZES[size];

  return (
    <figure
      className={`card-hover bg-white rounded-2xl ${s.pad} shadow-sm border border-gray-100 hover:border-primary/30 transition-colors flex flex-col ${clampQuote ? "h-80 md:h-64" : ""}`}
    >
      {testimonial.quote && (
        // Narrower single-column cards need more wrapped lines for the same
        // text than the 2-up desktop grid does — measured at real breakpoints
        // (not guessed): a ~230-char quote needs 6 lines at 308px card width,
        // only 3 at 626px. A flat line-clamp-4 cut the longer quotes off
        // mid-word on mobile while barely being needed on desktop. `h-64`
        // already has headroom for 6 lines regardless of width.
        <blockquote
          className={`text-foreground leading-relaxed italic flex-1 mb-6 ${clampQuote ? "line-clamp-6 md:line-clamp-4" : ""}`}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      )}
      <figcaption className="flex items-center gap-3">
        <div
          className={`${s.avatar} relative rounded-full overflow-hidden bg-primary-dark flex items-center justify-center text-white font-bold shrink-0`}
        >
          {testimonial.image ? (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="64px"
              className="object-cover object-top"
            />
          ) : (
            <PersonIcon className={s.icon} />
          )}
        </div>
        <div className="min-w-0">
          {testimonial.anonymized ? (
            <p className={`font-semibold text-primary-dark ${s.name}`}>{testimonial.role}</p>
          ) : (
            <>
              <p className={`font-semibold text-primary-dark ${s.name}`}>{testimonial.name}</p>
              <p className={`${s.role} text-muted`}>
                {testimonial.role}
                {testimonial.yearsAtCompany && ` · ${testimonial.yearsAtCompany} year${testimonial.yearsAtCompany > 1 ? "s" : ""} at Lotus Care`}
              </p>
            </>
          )}
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </figcaption>
    </figure>
  );
}
