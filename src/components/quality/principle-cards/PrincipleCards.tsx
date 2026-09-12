"use client";

import { useInView } from "@/hooks/use-in-view";

export interface PrincipleItem {
  term?: string;
  description: string;
}

const STAGGER_MS = 90;

const TONE = {
  teal: {
    heading: "text-teal-800",
    number: "text-teal-100 group-hover:text-teal-200",
    hoverBorder: "hover:border-primary/30",
  },
  purple: {
    heading: "text-purple-700",
    number: "text-purple-100 group-hover:text-purple-200",
    hoverBorder: "hover:border-purple-600/30",
  },
} as const;

interface PrincipleCardsProps {
  items: PrincipleItem[];
  tone?: keyof typeof TONE;
}

function Card({
  item,
  index,
  bookend,
  tone,
  inView,
}: {
  item: PrincipleItem;
  index: number;
  bookend: boolean;
  tone: keyof typeof TONE;
  inView: boolean;
}) {
  const t = TONE[tone];

  return (
    // Reveal (opacity/transform/delay) lives on this outer element; the
    // inner card owns its own independent hover transform/shadow transition
    // (`card-hover`) so the two transitions never fight over `transform`.
    <div
      className={`pop-item ${inView ? "in-view" : ""} ${bookend ? "sm:col-span-2" : ""}`}
      style={{ transitionDelay: `${index * STAGGER_MS}ms` }}
    >
      <div
        className={`group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm card-hover transition-colors duration-200 ${
          t.hoverBorder
        } ${bookend ? "p-6 sm:p-8" : "p-6"}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-2 right-4 font-bold leading-none transition-colors duration-200 ${t.number} ${
            bookend ? "text-5xl sm:text-6xl" : "text-3xl"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {item.term && (
          <h3 className={`font-bold pr-10 ${t.heading} ${bookend ? "text-lg sm:text-xl" : "text-base"}`}>
            {item.term}
          </h3>
        )}
        <p
          className={`text-foreground leading-relaxed ${item.term ? "mt-1.5" : "pr-10"} ${
            bookend ? "text-sm sm:text-base sm:max-w-[70%]" : "text-sm"
          } ${bookend && !item.term ? "pr-16 sm:pr-0" : ""}`}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

/**
 * Numbered "bento" card grid for Human Rights' Purpose/Approach/Champions-
 * Responsibilities lists — a large ghost numeral replaces KeywordCards' pill
 * badge as the card's visual anchor. The first item always renders full-width
 * ("opener"); when the remainder is odd, the last item also renders full-width
 * ("closer") so the grid never leaves a half-empty row. Used only for Human
 * Rights — Curriculum keeps KeywordCards untouched (deliberate, per user).
 */
export function PrincipleCards({ items, tone = "teal" }: PrincipleCardsProps) {
  const { ref, inView } = useInView();
  if (items.length === 0) return null;

  const [opener, ...rest] = items;
  const hasCloser = rest.length % 2 === 1;
  const pairs = hasCloser ? rest.slice(0, -1) : rest;
  const closer = hasCloser ? rest[rest.length - 1] : null;

  return (
    <div ref={ref} className="space-y-6">
      <Card item={opener} index={0} bookend tone={tone} inView={inView} />
      {pairs.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-6">
          {pairs.map((item, i) => (
            <Card
              key={item.term ?? item.description}
              item={item}
              index={i + 1}
              bookend={false}
              tone={tone}
              inView={inView}
            />
          ))}
        </div>
      )}
      {closer && (
        <Card
          key={closer.term ?? closer.description}
          item={closer}
          index={items.length - 1}
          bookend
          tone={tone}
          inView={inView}
        />
      )}
    </div>
  );
}
