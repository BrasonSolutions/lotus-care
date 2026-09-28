import type { LegalDoc, LegalSection } from "@/data/legal";

interface LegalDocumentProps {
  doc: LegalDoc;
}

function SectionContent({ section }: { section: LegalSection }) {
  return (
    <>
      {section.body?.map((paragraph) => (
        <p key={paragraph} className="text-foreground leading-relaxed mb-3">
          {paragraph}
        </p>
      ))}
      {section.list && (
        <ul className="list-disc pl-5 space-y-2 text-foreground leading-relaxed mb-3">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.subsections && (
        <div className="space-y-6 mt-6 mb-6">
          {section.subsections.map((sub) => (
            <div key={sub.heading}>
              <h3 className="text-lg font-semibold text-primary-dark mb-2">{sub.heading}</h3>
              <SectionContent section={sub} />
            </div>
          ))}
        </div>
      )}
      {section.after?.map((paragraph) => (
        <p key={paragraph} className="text-foreground leading-relaxed mb-3">
          {paragraph}
        </p>
      ))}
    </>
  );
}

/** Shared layout for /privacy-policy and /terms-of-service — plain
 * typographic prose page. A doc flagged `draft` (not yet reviewed by a
 * solicitor, see data/legal.ts) carries a standing notice until that review
 * happens and the flag is removed. */
export function LegalDocument({ doc }: LegalDocumentProps) {
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto w-full px-6 sm:px-10 md:px-[15%]">
        <h1 className="font-dm-sans text-3xl sm:text-4xl font-bold text-primary-dark mb-3">{doc.title}</h1>
        <p className="text-muted mb-8">{doc.description}</p>

        {doc.draft && (
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
        )}

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
              <SectionContent section={section} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
