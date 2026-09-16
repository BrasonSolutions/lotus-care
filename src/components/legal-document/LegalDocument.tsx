import { Container } from "@/components/layout";
import type { LegalDoc } from "@/data/legal";

interface LegalDocumentProps {
  doc: LegalDoc;
}

/** Shared layout for /privacy-policy and /terms-of-service — plain
 * typographic prose page plus a standing draft notice. Both documents were
 * drafted against Lotus Care's real, known facts (see data/legal.ts) but
 * have not been reviewed by a solicitor, so every rendering of either page
 * carries this notice until that review happens and it's removed. */
export function LegalDocument({ doc }: LegalDocumentProps) {
  return (
    <div className="py-16 sm:py-20">
      <Container width="reading" padded>
        <h1 className="font-dm-sans text-3xl sm:text-4xl font-bold text-primary-dark mb-3">{doc.title}</h1>
        <p className="text-muted mb-8">{doc.description}</p>

        <div
          role="note"
          className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm leading-relaxed p-4 sm:p-5 mb-10"
        >
          <p className="font-semibold mb-1">Draft — pending legal review</p>
          <p>
            This page is a working draft, not final legal copy. Bracketed notes below mark facts
            Lotus Care still needs to confirm. Please have a solicitor review this page before
            relying on it.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {doc.intro.map((paragraph) => (
            <p key={paragraph} className="text-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-primary-dark mb-3">{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="text-foreground leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="list-disc pl-5 space-y-2 text-foreground leading-relaxed">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
