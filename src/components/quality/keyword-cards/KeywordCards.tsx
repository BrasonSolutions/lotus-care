import type { Keyword } from "@/data/quality";

// text-muted on purple-50 measures 3.75:1 and fails AA, so the body copy is
// text-foreground here (9.97:1 on purple-50, 11.82:1 on teal-50).
const TONE = {
  teal: {
    card: "bg-teal-50 border-teal-200",
    pill: "bg-primary-dark text-white",
  },
  purple: {
    card: "bg-purple-50 border-purple-200",
    pill: "bg-purple-600 text-white",
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

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(({ term, description }) => (
        <li
          key={term}
          className={`rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${card}`}
        >
          <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${pill}`}>
            {term}
          </span>
          <p className="mt-4 text-foreground leading-relaxed">{description}</p>
        </li>
      ))}
    </ul>
  );
}
