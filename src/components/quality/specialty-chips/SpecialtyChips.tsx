"use client";

import { Chip, type ChipTone } from "@/components/chip";
import { useInView } from "@/hooks/use-in-view";

const STAGGER_MS = 90;

interface SpecialtyChipsProps {
  items: string[];
  tone?: ChipTone;
}

/** A Chip row with the same staggered pop-in CircularCycle/Timeline already
 * use — Chip itself has no hover transition, so no wrapper-split is needed
 * here (unlike KeywordCards/PrincipleCards/PrincipleTags). */
export function SpecialtyChips({ items, tone = "purple" }: SpecialtyChipsProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-2.5">
      {items.map((item, i) => (
        <div
          key={item}
          className={`pop-item ${inView ? "in-view" : ""}`}
          style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
        >
          <Chip tone={tone} size="sm">
            {item}
          </Chip>
        </div>
      ))}
    </div>
  );
}
