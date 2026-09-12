"use client";

import { useInView } from "@/hooks/use-in-view";

const STAGGER_MS = 90;

const TONE = {
  teal: {
    card: "bg-teal-50 border-teal-100",
    number: "text-teal-200",
    term: "text-teal-800",
  },
  purple: {
    card: "bg-purple-50 border-purple-100",
    number: "text-purple-200",
    term: "text-purple-700",
  },
} as const;

interface PrincipleTagsProps {
  items: string[];
  tone?: keyof typeof TONE;
}

/**
 * Compact numbered tile grid for lists that are tags only, with no
 * per-item description in the data (e.g. Champions' Focus Areas) — no
 * description is invented to force these into full PrincipleCards. Uniform
 * grid, not bento: these items are peers, not one featured item plus rest.
 *
 * Two fixes measured, not guessed: (1) a fixed 3-column grid left a
 * half-empty dangling row for any count that isn't a multiple of 3 (5 items
 * → 3+2, 4 items → 3+1) — capped at 2 columns instead, and when the count is
 * odd the last tile spans both columns as a closing "bookend" instead of
 * leaving a gap (same fix already applied to PrincipleCards' bento grid).
 * (2) tiles had inconsistent heights row-to-row because the bordered/padded
 * visual box was the *inner* div, one level below the actual CSS grid item
 * (the <li>) — grid's default row-stretch was sizing the <li> correctly but
 * the inner box never filled it. `h-full` on the inner box fixes this.
 */
export function PrincipleTags({ items, tone = "teal" }: PrincipleTagsProps) {
  const { ref, inView } = useInView();
  const t = TONE[tone];
  const lastIsOdd = items.length % 2 === 1;

  return (
    // useInView's ref types as HTMLDivElement, so it lives on this wrapper
    // rather than directly on the <ul>.
    <div ref={ref}>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((term, i) => {
          const isCloser = lastIsOdd && i === items.length - 1;
          return (
            <li
              key={term}
              className={`pop-item ${inView ? "in-view" : ""} ${isCloser ? "sm:col-span-2" : ""}`}
              style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
            >
              {/* Reveal lives on the <li>; hover's transform/shadow transition
                  lives here, so the two never fight over the same property. */}
              <div
                className={`h-full flex items-baseline gap-3 rounded-xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${t.card} ${
                  isCloser ? "sm:justify-center sm:text-center" : ""
                }`}
              >
                <span aria-hidden="true" className={`text-lg font-bold shrink-0 ${t.number}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-sm font-semibold ${t.term}`}>{term}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
