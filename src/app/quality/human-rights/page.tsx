import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { ContentSection } from "@/components/quality/content-section";
import { TeamStrip } from "@/components/quality/team-strip";
import { Reveal } from "@/components/reveal";
import { humanRightsFramework, humanRightsContent, humanRightsTeam } from "@/data/quality";
import { WideContainer } from "@/components/layout";

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
        <WideContainer>
          <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
            <div className="space-y-4">
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
        </WideContainer>
      </div>

      <section className="py-16 sm:py-20 bg-white">
        <WideContainer>
          <SectionTitle
            title="The Human Rights Framework"
            subtitle="Five principles that guide how rights are embedded, upheld, and continuously strengthened across our services."
          />
          <Reveal>
            <CircularCycle steps={humanRightsFramework} centerLabel="Human Rights Framework" />
          </Reveal>
        </WideContainer>
      </section>

      <section className="py-16 sm:py-20">
        <WideContainer className="space-y-16">
          <Reveal className="reveal-scale">
            <ContentSection {...humanRightsContent.purpose} image="/images/stock/team-meeting.jpg" imagePosition="left" />
          </Reveal>
          <Reveal><ContentSection {...humanRightsContent.approach} /></Reveal>
          <Reveal className="reveal-scale">
            <ContentSection {...humanRightsContent.champions} image="/images/stock/dignity-activity.jpg" imagePosition="right" />
          </Reveal>
          <Reveal><ContentSection {...humanRightsContent.governance} /></Reveal>
          <Reveal><ContentSection {...humanRightsContent.culture} /></Reveal>
        </WideContainer>
      </section>

      <section className="pb-16 sm:pb-20">
        <WideContainer>
          <Reveal>
            <TeamStrip
              heading="Our Quality & Compliance Team"
              intro="Real people at Lotus Care working to embed these standards day to day."
              members={humanRightsTeam}
            />
          </Reveal>
        </WideContainer>
      </section>
    </>
  );
}
