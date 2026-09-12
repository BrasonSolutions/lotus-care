"use client";

import type { ContentBlock } from "@/data/quality";
import { useInView } from "@/hooks/use-in-view";

const STAGGER_MS = 90;

interface SplitCardsProps {
  blocks: [ContentBlock, ContentBlock];
}

/** The Governance/Culture two-card split, unchanged visually from the
 * original inline JSX (grid, centre teal-to-plum divider rule, `md:mr-8`/
 * `md:ml-8` gutter) — extracted only so it can drive its own useInView for
 * the staggered pop-in every other card grid on this page already has. No
 * hover transition on these cards in the original design, so (unlike
 * KeywordCards/PrincipleCards/PrincipleTags) no wrapper-split is needed. */
export function SplitCards({ blocks }: SplitCardsProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-0 relative">
      <div
        aria-hidden="true"
        className="hidden md:block absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary-dark to-purple-600"
      />
      {blocks.map((block, i) => (
        <div
          key={block.heading}
          className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 text-center pop-item ${
            inView ? "in-view" : ""
          } ${i === 0 ? "md:mr-8" : "md:ml-8"}`}
          style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
        >
          <h3 className="text-xl font-bold text-primary-dark mb-4">{block.heading}</h3>
          {block.intro && <p className="text-muted leading-relaxed">{block.intro}</p>}
          {block.body && <p className="text-muted leading-relaxed">{block.body}</p>}
        </div>
      ))}
    </div>
  );
}
