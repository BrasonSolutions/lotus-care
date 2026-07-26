import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { HubAndSpoke } from "@/components/quality/hub-and-spoke";
import { ContentSection } from "@/components/quality/content-section";
import { mdtCore, mdtSpokes, mdtContent } from "@/data/quality";

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
      />

      <div className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {mdtContent.intro.map((paragraph) => (
            <p key={paragraph} className="text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Internal MDT"
            subtitle="Eight disciplines working around a single, person-centred core."
          />
          <HubAndSpoke core={mdtCore} spokes={mdtSpokes} />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContentSection {...mdtContent.approach} />
          <ContentSection {...mdtContent.partnership} />
          <ContentSection {...mdtContent.governance} />
          <ContentSection {...mdtContent.commitment} />
        </div>
      </section>
    </>
  );
}
