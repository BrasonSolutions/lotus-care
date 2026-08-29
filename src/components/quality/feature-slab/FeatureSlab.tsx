import type { ReactNode } from "react";
import Image from "next/image";
import type { ContentBlock } from "@/data/quality";

const TONE = {
  teal: {
    panel: "bg-primary-dark",
    bullet: "text-accent",
  },
  purple: {
    panel: "bg-purple-600",
    bullet: "text-purple-200",
  },
} as const;

interface FeatureSlabProps extends ContentBlock {
  image: string;
  /** Which half the photo occupies on md+. Text always comes first when
   * stacked, regardless of this — reading order beats mirroring the
   * desktop layout on a phone. */
  imagePosition?: "left" | "right";
  tone?: keyof typeof TONE;
}

/**
 * Full-bleed two-tone band: a solid brand-colour panel of copy beside a
 * photo that runs to the opposite edge (issue #63 / Figma node 60-70).
 *
 * Deliberately rendered outside `Container` — the colour and the photo
 * both bleed to the viewport edges, and only the text inside the panel is
 * inset.
 *
 * Must be placed inside `FeatureSlabGroup`. On md+ the wrapping `<section>`
 * becomes `display: contents`, so the panel and the photo are promoted into
 * the group's grid — which is what lets sibling slabs share a row height
 * instead of each sizing to its own copy (client feedback on #63). Below md
 * it is a plain flex column and `order` puts the copy first.
 */
export function FeatureSlab({
  image,
  imagePosition = "right",
  tone = "teal",
  heading,
  intro,
  body,
  bullets,
  keywords,
}: FeatureSlabProps) {
  const { panel, bullet } = TONE[tone];

  const copy = (
    <div
      className={`${panel} max-md:order-1 flex items-center justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-16`}
    >
      {/* Centred in both axes within the panel. Text stays left-aligned —
          centred bullet lists are markedly harder to scan. */}
      <div className="w-full max-w-lg lg:max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5">{heading}</h2>
        {intro && <p className="text-lg text-white/85 leading-relaxed mb-5">{intro}</p>}
        {body && <p className="text-lg text-white/85 leading-relaxed">{body}</p>}
        {keywords && keywords.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((word) => (
                <span
                  key={word}
                  className="bg-white/15 text-white border border-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
            {bullets && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-semibold text-white focus-ring-white rounded marker:text-white/70">
                  Read the full detail
                </summary>
                <ul className="mt-4 space-y-3">
                  {bullets.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-white/85 leading-relaxed">
                      <span
                        className={`${bullet} mt-2.5 h-1.5 w-1.5 shrink-0 self-start rounded-full bg-current`}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        ) : (
          bullets && (
            <ul className="mt-2 space-y-4">
              {bullets.map((item) => (
                <li key={item} className="flex gap-3 text-lg text-white/85 leading-relaxed">
                  {/* Drawn circle, not a glyph — its optical centre sits low, needs mt-3. */}
                  <span
                    className={`${bullet} mt-3 h-1.5 w-1.5 shrink-0 self-start rounded-full bg-current`}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );

  // Photo is decorative here — the panel beside it carries the meaning, so
  // an empty alt keeps it out of the accessibility tree rather than making
  // screen-reader users sit through a description of stock.
  const photo = (
    <div className="max-md:order-2 relative min-h-[260px]">
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  // DOM order is the column order on md+ (the grid places items as it reads
  // them), so the swap happens here rather than via `order` — an `order`
  // value under `display: contents` would reorder against every other
  // slab's cells, not just this row's.
  return (
    <section className="flex flex-col md:contents">
      {imagePosition === "left" ? (
        <>
          {photo}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {photo}
        </>
      )}
    </section>
  );
}

/**
 * Wraps a run of `FeatureSlab`s in the single grid they all share.
 * `auto-rows-fr` sizes every row to the tallest one, so the slabs line up
 * regardless of how much copy each carries — no fixed height to keep in
 * sync with the content.
 */
export function FeatureSlabGroup({ children }: { children: ReactNode }) {
  return <div className="md:grid md:grid-cols-2 md:auto-rows-fr">{children}</div>;
}
