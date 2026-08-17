import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { ContentSection } from "@/components/quality/content-section";
import { FeatureSlab } from "@/components/quality/feature-slab";
import { TeamStrip } from "@/components/quality/team-strip";
import { LotusBand } from "@/components/lotus-band";
import { Reveal } from "@/components/reveal";
import type { ContentBlock } from "@/data/quality";
import { humanRightsFramework, humanRightsContent, humanRightsTeam } from "@/data/quality";
import { Container } from "@/components/layout";

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
        <Container>
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

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal className="reveal-scale">
            <ContentSection
              {...humanRightsContent.purpose}
              image="/images/stock/team-meeting.jpg"
              imagePosition="left"
              primary
            />
          </Reveal>
        </Container>
      </section>

      {/* Two-tone feature run (issue #63). The bands cap the top and bottom
          of the pair rather than separating sections, so the teal slab,
          plum slab and their patterned edges read as one block. */}
      <div aria-hidden="true">
        <LotusBand variant="teal" height={72} />
      </div>

      <Reveal>
        <FeatureSlab
          {...humanRightsContent.approach}
          tone="teal"
          image="/images/stock/dignity-activity.jpg"
          imagePosition="right"
        />
      </Reveal>

      <Reveal>
        <FeatureSlab
          {...humanRightsContent.champions}
          tone="purple"
          image="/images/stock/team-meeting.jpg"
          imagePosition="left"
        />
      </Reveal>

      {/* Mirrored so the motif rises from the bottom edge, matching the
          design's closing band. LotusBand has no flip prop and doesn't need
          one for a single call site. */}
      <div aria-hidden="true" className="-scale-y-100">
        <LotusBand variant="purple" motifColor="white" height={72} />
      </div>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-0 relative">
            {/* Teal-to-plum rule echoing the two slabs above. Sits in the
                grid gutter on md+ and is dropped when the cards stack. */}
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
    </>
  );
}
