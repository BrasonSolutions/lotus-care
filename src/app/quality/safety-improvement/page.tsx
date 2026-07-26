import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { ContentSection } from "@/components/quality/content-section";
import { TeamStrip } from "@/components/quality/team-strip";
import { Reveal } from "@/components/reveal";
import { qualitySafetyCycle, qualitySafetyContent, safetyImprovementTeam } from "@/data/quality";

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
        <Reveal className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
          <div className="space-y-4">
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
      </div>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Continuous Improvement Cycle"
            subtitle="How standards, delivery, insight, and learning connect to keep raising the bar."
          />
          <Reveal>
            <CircularCycle steps={qualitySafetyCycle} centerLabel="Continuous Improvement" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <Reveal><ContentSection {...qualitySafetyContent.commitment} /></Reveal>
          <Reveal className="reveal-scale">
            <ContentSection {...qualitySafetyContent.governance} image="/images/stock/team-meeting.jpg" imagePosition="right" />
          </Reveal>
          <Reveal className="reveal-scale">
            <ContentSection {...qualitySafetyContent.improvement} image="/images/stock/clinical-consultation.jpg" imagePosition="left" />
          </Reveal>
          <Reveal><ContentSection {...qualitySafetyContent.broaderView} /></Reveal>
          <Reveal><ContentSection {...qualitySafetyContent.culture} /></Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <Reveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamStrip
            heading="Governance in Practice"
            intro="Real people at Lotus Care overseeing quality and safety day to day."
            members={safetyImprovementTeam}
          />
        </Reveal>
      </section>
    </>
  );
}
