import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { ContentSection } from "@/components/quality/content-section";
import { TeamStrip } from "@/components/quality/team-strip";
import { LotusBand } from "@/components/lotus-band";
import { Reveal } from "@/components/reveal";
import { qualitySafetyCycle, qualitySafetyContent, safetyImprovementTeam } from "@/data/quality";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Quality, Safety & Continuous Improvement",
  description:
    "The governance and continuous-improvement culture that keeps quality and safety standards high across every Lotus Care home.",
};

export default function SafetyImprovementPage() {
  return (
    <>
      <CareersHero
        title="Quality, Safety & Continuous Improvement"
        subtitle="Quality and safety are the foundation of our culture — the standard by which we measure ourselves every day."
        compact
        image="/images/stock/team-meeting.jpg"
      />

      <div className="py-14 sm:py-16">
        <Container>
          <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
            <div className="space-y-4 max-w-lg">
              {qualitySafetyContent.intro.map((paragraph) => (
                <p key={paragraph} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/stock/dignity-activity.jpg"
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
            title="Our Continuous Improvement Cycle"
            subtitle="How standards, delivery, insight, and learning connect to keep raising the bar."
          />
          <Reveal>
            <CircularCycle steps={qualitySafetyCycle} centerLabel="Continuous Improvement" />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <ContentSection {...qualitySafetyContent.commitment} primary />
          </Reveal>
        </Container>
      </section>

      <div aria-hidden="true">
        <LotusBand variant="teal" height={72} />
      </div>

      <section className="py-16 sm:py-20">
        <Container className="space-y-16">
          <Reveal className="reveal-scale">
            <ContentSection {...qualitySafetyContent.governance} image="/images/stock/team-meeting.jpg" imagePosition="right" />
          </Reveal>
          <Reveal className="reveal-scale">
            <ContentSection {...qualitySafetyContent.improvement} image="/images/stock/clinical-consultation.jpg" imagePosition="left" />
          </Reveal>
        </Container>
      </section>

      <div aria-hidden="true">
        <LotusBand variant="purple" height={72} />
      </div>

      <section className="py-16 sm:py-20">
        <Container className="space-y-16">
          <Reveal><ContentSection {...qualitySafetyContent.broaderView} /></Reveal>
          <Reveal><ContentSection {...qualitySafetyContent.culture} /></Reveal>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <TeamStrip
              heading="Governance in Practice"
              intro="Real people at Lotus Care overseeing quality and safety day to day."
              members={safetyImprovementTeam}
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
