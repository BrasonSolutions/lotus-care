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
 * inset. Panels stretch to a shared height so the colour block and the
 * photo always end on the same line.
 */
export function FeatureSlab({
  image,
  imagePosition = "right",
  tone = "teal",
  heading,
  intro,
  body,
  bullets,
}: FeatureSlabProps) {
  const { panel, bullet } = TONE[tone];

  return (
    <section className="grid md:grid-cols-2 items-stretch">
      <div
        className={`${panel} flex items-center justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-16 ${
          imagePosition === "left" ? "md:order-2" : ""
        }`}
      >
        {/* Centred in both axes within the panel. Text stays left-aligned —
            centred bullet lists are markedly harder to scan. */}
        <div className="w-full max-w-lg lg:max-w-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{heading}</h2>
          {intro && <p className="text-white/85 leading-relaxed mb-4">{intro}</p>}
          {body && <p className="text-white/85 leading-relaxed">{body}</p>}
          {bullets && (
            <ul className="mt-2 space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex gap-3 text-white/85 leading-relaxed">
                  <span className={`${bullet} mt-1`} aria-hidden="true">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Photo is decorative here — the panel beside it carries the meaning,
          so an empty alt keeps it out of the accessibility tree rather than
          making screen-reader users sit through a description of stock. */}
      <div
        className={`relative min-h-[260px] md:min-h-full ${
          imagePosition === "left" ? "md:order-1" : ""
        }`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
