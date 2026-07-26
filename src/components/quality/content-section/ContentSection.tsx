import Image from "next/image";
import type { ContentBlock } from "@/data/quality";

interface ContentSectionProps extends ContentBlock {
  image?: string;
  imagePosition?: "left" | "right";
}

function Text({ heading, intro, body, bullets }: ContentBlock) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4">
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

export function ContentSection({ image, imagePosition = "right", ...content }: ContentSectionProps) {
  if (!image) {
    return (
      <div className="max-w-4xl mx-auto">
        <Text {...content} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={imagePosition === "left" ? "md:order-2" : ""}>
        <Text {...content} />
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
