"use client";

import type { Keyword } from "@/data/quality";
import { Chip, type ChipTone } from "@/components/chip";
import { useInView } from "@/hooks/use-in-view";

const STAGGER_MS = 90;

// text-muted on purple-50 measures 3.75:1 and fails AA, so the body copy is
// text-foreground here (9.97:1 on purple-50, 11.82:1 on teal-50).
const TONE = {
  teal: {
    card: "bg-teal-50 border-teal-200",
    pill: "solid" as ChipTone,
  },
  purple: {
    card: "bg-purple-50 border-purple-200",
    pill: "solidPurple" as ChipTone,
  },
} as const;

interface KeywordCardsProps {
  items: Keyword[];
  tone?: keyof typeof TONE;
}

/** A bullet list rendered as cards, each led by its key word in a pill — the
 * client asked for "Dignity" to read as a bubble, not a line of prose (#91). */
export function KeywordCards({ items, tone = "teal" }: KeywordCardsProps) {
  const { card, pill } = TONE[tone];
  const { ref, inView } = useInView();

  return (
    // useInView's ref types as HTMLDivElement, so it lives on this wrapper
    // rather than directly on the <ul>.
    <div ref={ref}>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ term, description }, i) => (
          <li
            key={term}
            className={`pop-item ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
          >
            {/* Reveal (opacity/transform/delay) lives on the <li>; hover's own
                transform/shadow transition lives here, on a separate element,
                so the two transitions never fight over the same property. */}
            <div
              className={`h-full rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${card}`}
            >
              <Chip tone={pill} size="md">
                {term}
              </Chip>
              <p className="mt-4 text-foreground leading-relaxed">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
