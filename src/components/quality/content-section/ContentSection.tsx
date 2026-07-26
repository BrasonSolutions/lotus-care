import type { ContentBlock } from "@/data/quality";

export function ContentSection({ heading, intro, body, bullets }: ContentBlock) {
  return (
    <div className="mb-12 last:mb-0">
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
