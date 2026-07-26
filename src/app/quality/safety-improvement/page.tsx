import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { ContentSection } from "@/components/quality/content-section";
import { MediaFrame } from "@/components/quality/media-frame";
import { qualitySafetyCycle, qualitySafetyContent } from "@/data/quality";

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
      />

      <div className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {qualitySafetyContent.intro.map((paragraph) => (
            <p key={paragraph} className="text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Continuous Improvement Cycle"
            subtitle="How standards, delivery, insight, and learning connect to keep raising the bar."
          />
          <CircularCycle steps={qualitySafetyCycle} centerLabel="Continuous Improvement" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContentSection {...qualitySafetyContent.commitment} />
          <ContentSection {...qualitySafetyContent.governance} />
          <ContentSection {...qualitySafetyContent.improvement} />
          <ContentSection {...qualitySafetyContent.broaderView} />
          <ContentSection {...qualitySafetyContent.culture} />
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <MediaFrame caption="See our quality and safety culture in action." />
        </div>
      </section>
    </>
  );
}
