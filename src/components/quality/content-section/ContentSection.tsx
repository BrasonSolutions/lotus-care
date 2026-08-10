import Image from "next/image";
import type { ContentBlock } from "@/data/quality";

interface ContentSectionProps extends ContentBlock {
  image?: string;
  imagePosition?: "left" | "right";
  /** Larger heading scale for a section's lead block (Option A's
   * divider-segmented groups — CR3). Defaults to the original scale. */
  primary?: boolean;
}

function Text({ heading, intro, body, bullets, primary }: ContentBlock & { primary?: boolean }) {
  return (
    <div>
      <h2
        className={`font-bold text-primary-dark mb-4 ${
          primary ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
        }`}
      >
        {heading}
      </h2>
      {intro && <p className="text-muted leading-relaxed mb-4">{intro}</p>}
      {body && <p className="text-muted leading-relaxed">{body}</p>}
      {bullets && (
        <ul className="mt-2 space-y-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-muted leading-relaxed">
              <span className="text-primary mt-1" aria-hidden="true">
                &bull;
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ContentSection({
  image,
  imagePosition = "right",
  primary,
  ...content
}: ContentSectionProps) {
  if (!image) {
    // max-w-lg (32rem/512px), not max-w-prose (65ch ≈ 656px at 16px Inter —
    // "ch" is the "0" glyph's width, which measurably overshoots this
    // font's real average character width; 656px rendered 85-91 real
    // characters/line, verified in-browser). 512px lands ~65-70 real
    // characters — see CR3 PR notes for the measured px-per-char ratio.
    return (
      <div className="max-w-lg mx-auto">
        <Text {...content} primary={primary} />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={`max-w-lg ${imagePosition === "left" ? "md:order-2" : ""}`}>
        <Text {...content} primary={primary} />
      </div>
      <div
        className={`group relative rounded-2xl overflow-hidden aspect-[4/3] ${
          imagePosition === "left" ? "md:order-1" : ""
        }`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
}
