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
 */
export function PrincipleTags({ items, tone = "teal" }: PrincipleTagsProps) {
  const { ref, inView } = useInView();
  const t = TONE[tone];

  return (
    // useInView's ref types as HTMLDivElement, so it lives on this wrapper
    // rather than directly on the <ul>.
    <div ref={ref}>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((term, i) => (
          <li
            key={term}
            className={`pop-item ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
          >
            {/* Reveal lives on the <li>; hover's transform/shadow transition
                lives here, so the two never fight over the same property. */}
            <div
              className={`flex items-baseline gap-3 rounded-xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${t.card}`}
            >
              <span aria-hidden="true" className={`text-lg font-bold shrink-0 ${t.number}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-semibold ${t.term}`}>{term}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
