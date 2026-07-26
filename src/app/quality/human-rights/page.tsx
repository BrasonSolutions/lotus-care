import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { ContentSection } from "@/components/quality/content-section";
import { TeamStrip } from "@/components/quality/team-strip";
import { Reveal } from "@/components/reveal";
import { humanRightsFramework, humanRightsContent, humanRightsTeam } from "@/data/quality";

export const metadata: Metadata = {
  title: "Human Rights Committee",
  description:
    "How Lotus Care's Human Rights Committee embeds dignity, choice, and a rights-based approach across every service we provide.",
};

export default function HumanRightsPage() {
  return (
    <>
      <CareersHero
        title="Human Rights Committee"
        subtitle="A rights-based approach where dignity, respect, equality, and autonomy are central to every aspect of care."
        compact
        image="/images/stock/dignity-activity.jpg"
      />

      <div className="py-14 sm:py-16">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {humanRightsContent.intro.map((paragraph) => (
            <p key={paragraph} className="text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="The Human Rights Framework"
            subtitle="Five principles that guide how rights are embedded, upheld, and continuously strengthened across our services."
          />
          <Reveal>
            <CircularCycle steps={humanRightsFramework} centerLabel="Human Rights Framework" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Reveal><ContentSection {...humanRightsContent.purpose} /></Reveal>
          <Reveal><ContentSection {...humanRightsContent.approach} /></Reveal>
          <Reveal><ContentSection {...humanRightsContent.champions} /></Reveal>
          <Reveal><ContentSection {...humanRightsContent.governance} /></Reveal>
          <Reveal><ContentSection {...humanRightsContent.culture} /></Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamStrip
            heading="Our Quality & Compliance Team"
            intro="Real people at Lotus Care working to embed these standards day to day."
            members={humanRightsTeam}
          />
        </Reveal>
      </section>
    </>
  );
}
