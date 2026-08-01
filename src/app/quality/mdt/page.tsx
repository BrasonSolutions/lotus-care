import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { HubAndSpoke } from "@/components/quality/hub-and-spoke";
import { ContentSection } from "@/components/quality/content-section";
import { TeamStrip } from "@/components/quality/team-strip";
import { Reveal } from "@/components/reveal";
import { mdtCore, mdtSpokes, mdtContent, mdtTeam } from "@/data/quality";
import { WideContainer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Multidisciplinary Team",
  description:
    "The clinical and therapeutic experts working alongside frontline staff to deliver holistic, coordinated care at Lotus Care.",
};

export default function MdtPage() {
  return (
    <>
      <CareersHero
        title="Multidisciplinary Team"
        subtitle="A collaborative, holistic approach bringing together clinical and therapeutic expertise for every person we support."
        compact
        image="/images/stock/clinical-consultation.jpg"
      />

      <div className="py-14 sm:py-16">
        <WideContainer>
          <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
            <div className="space-y-4">
              {mdtContent.intro.map((paragraph) => (
                <p key={paragraph} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/stock/team-meeting.jpg"
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
            title="Our Internal MDT"
            subtitle="Eight disciplines working around a single, person-centred core."
          />
          <Reveal>
            <HubAndSpoke core={mdtCore} spokes={mdtSpokes} />
          </Reveal>
        </WideContainer>
      </section>

      <section className="py-16 sm:py-20">
        <WideContainer className="space-y-16">
          <Reveal className="reveal-scale">
            <ContentSection {...mdtContent.approach} image="/images/stock/clinical-consultation.jpg" imagePosition="right" />
          </Reveal>
          <Reveal className="reveal-scale">
            <ContentSection {...mdtContent.partnership} image="/images/stock/community-friends.jpg" imagePosition="left" />
          </Reveal>
          <Reveal><ContentSection {...mdtContent.governance} /></Reveal>
          <Reveal><ContentSection {...mdtContent.commitment} /></Reveal>
        </WideContainer>
      </section>

      <section className="pb-16 sm:pb-20">
        <WideContainer>
          <Reveal>
            <TeamStrip
              heading="Some of Our MDT"
              intro="A few of the clinical and therapeutic specialists behind this model of care."
              members={mdtTeam}
            />
          </Reveal>
        </WideContainer>
      </section>
    </>
  );
}
