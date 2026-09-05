import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { FeatureSlab, FeatureSlabGroup } from "@/components/quality/feature-slab";
import { TeamStrip } from "@/components/quality/team-strip";
import { Blob } from "@/components/blob";
import { Reveal } from "@/components/reveal";
import type { ContentBlock, ModelOfCareSection } from "@/data/quality";
import {
  modelOfCareSections,
  humanRightsFramework,
  humanRightsContent,
  humanRightsTeam,
} from "@/data/quality";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Model of Care",
  description:
    "How Lotus Care structures daily life, transitions, rights, and safeguarding across every service we provide.",
};

function sectionById(id: ModelOfCareSection["id"]): ModelOfCareSection {
  const section = modelOfCareSections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Missing Model of Care section: ${id}`);
  return section;
}

// Blocked on client content (issue #91) — structure and empty state only.
function PendingSection({
  section,
  decorated,
  className = "",
}: {
  section: ModelOfCareSection;
  decorated?: boolean;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 ${className}`.trim()}>
      {decorated && (
        <>
          <Blob color="teal" variant={1} className="absolute -top-24 -left-24 w-80 h-80" />
          <Blob color="purple" variant={3} className="absolute -bottom-20 -right-20 w-64 h-64" />
        </>
      )}
      <Container className="relative">
        <SectionTitle title={section.heading} subtitle={section.intro} />
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <span className="inline-block bg-primary-dark text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Coming soon
          </span>
          <p className="text-muted leading-relaxed">
            Full detail for this section is being finalised with our care team and will land here once confirmed.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default function ModelOfCarePage() {
  const curriculum = sectionById("curriculum");
  const adt = sectionById("adt");
  const humanRights = sectionById("human-rights");
  const safeguarding = sectionById("safeguarding");

  return (
    <>
      <CareersHero
        title="Model of Care"
        subtitle="Four pillars that shape everyday life at Lotus Care — our 24-hour curriculum, admissions and transitions, human rights, and safeguarding."
        compact
        image="/images/stock/dignity-activity.jpg"
      />

      <PendingSection section={curriculum} decorated />
      <PendingSection section={adt} className="bg-white" />

      {/* Blobs stay off the coloured slabs below, per the client's #63 request. */}
      <div className="relative overflow-hidden py-14 sm:py-16">
        <Blob color="teal" variant={1} className="absolute -top-24 -left-24 w-80 h-80" />
        <Blob color="purple" variant={3} className="absolute -bottom-20 -right-20 w-64 h-64" />
        <Container className="relative">
          <SectionTitle title={humanRights.heading} subtitle={humanRights.intro} />
          <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
            <div className="space-y-4 max-w-lg">
              {humanRightsContent.intro.map((paragraph) => (
                <p key={paragraph} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/stock/community-friends.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Reveal>
        </Container>
      </div>

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <SectionTitle
            title="The Human Rights Framework"
            subtitle="Five principles that guide how rights are embedded, upheld, and continuously strengthened across our services."
          />
          <Reveal>
            <CircularCycle steps={humanRightsFramework} centerLabel="Human Rights Framework" />
          </Reveal>
        </Container>
      </section>

      {/* Three-slab run (#63); purpose/approach show bubbles, champions keeps bullets. */}
      <Reveal>
        <FeatureSlabGroup>
          <FeatureSlab
            {...humanRightsContent.purpose}
            tone="purple"
            image="/images/stock/team-meeting.jpg"
            imagePosition="left"
          />
          <FeatureSlab
            {...humanRightsContent.approach}
            tone="teal"
            image="/images/stock/dignity-activity.jpg"
            imagePosition="right"
          />
          <FeatureSlab
            {...humanRightsContent.champions}
            tone="purple"
            image="/images/stock/community-friends.jpg"
            imagePosition="left"
          />
        </FeatureSlabGroup>
      </Reveal>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <Blob color="purple" variant={2} className="absolute -top-16 -right-24 w-72 h-72" />
        <Blob color="teal" variant={3} className="absolute -bottom-24 -left-20 w-72 h-72" />
        <Container className="relative">
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-0 relative">
            {/* Teal-to-plum divider echoing the slabs; hidden once cards stack. */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary-dark to-purple-600"
            />
            {([humanRightsContent.governance, humanRightsContent.culture] as ContentBlock[]).map((block, i) => (
              <div
                key={block.heading}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 text-center ${
                  i === 0 ? "md:mr-8" : "md:ml-8"
                }`}
              >
                <h2 className="text-xl font-bold text-primary-dark mb-4">{block.heading}</h2>
                {block.intro && <p className="text-muted leading-relaxed">{block.intro}</p>}
                {block.body && <p className="text-muted leading-relaxed">{block.body}</p>}
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <TeamStrip
              heading="Our Quality & Compliance Team"
              intro="Real people at Lotus Care working to embed these standards day to day."
              members={humanRightsTeam}
            />
          </Reveal>
        </Container>
      </section>

      <PendingSection section={safeguarding} decorated />
    </>
  );
}
