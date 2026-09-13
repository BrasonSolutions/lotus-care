import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { PrincipleTags } from "@/components/quality/principle-cards";
import { IconCards } from "@/components/quality/icon-cards";
import { TeamStrip } from "@/components/quality/team-strip";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { LotusBand } from "@/components/lotus-band";
import { Blob } from "@/components/blob";
import { Reveal } from "@/components/reveal";
import { qualitySafetyCycle, qualitySafetyContent, safetyImprovementTeam } from "@/data/quality";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Quality, Safety & Continuous Improvement",
  description:
    "The governance and continuous-improvement culture that keeps quality and safety standards high across every Lotus Care home.",
};

// Teal only, per the same standing rule as /quality/model-of-care and
// /quality/mdt — no purple divider band.
function Divider() {
  return (
    <div aria-hidden="true">
      <LotusBand variant="teal" height={72} />
    </div>
  );
}

/** Intro — same 2-column intro-plus-photo rhythm as Model of Care/MDT's own
 * intro sections. */
function IntroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <Blob color="teal" variant={2} className="absolute -top-24 -right-24 w-80 h-80" />
      <Blob color="purple" variant={1} className="absolute -bottom-24 -left-24 w-72 h-72" />
      <Container className="relative">
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
              src="/images/stock/team-review.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Cycle + Commitment — mirrors MDT's "Our Internal MDT" panel / Model of
 * Care's Human Rights panel exactly: one bg-white bounded panel holding two
 * stacked sub-blocks split by a hairline, rather than two separate
 * full-width sections. These two topics are paired the same way HubAndSpoke
 * pairs with Approach on MDT — a framework diagram, then how it's put into
 * practice day to day. */
function CycleAndCommitmentSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          title="Our Continuous Improvement Cycle"
          subtitle="How standards, delivery, insight, and learning connect to keep raising the bar."
        />
        <div className="rounded-3xl bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
          <div>
            <Reveal>
              <CircularCycle steps={qualitySafetyCycle} centerLabel="Continuous Improvement" />
            </Reveal>
          </div>

          <div className="mt-14 pt-14 border-t border-black/5">
            <h3 className="text-xl font-bold text-primary-dark mb-2 text-center">
              {qualitySafetyContent.commitment.heading}
            </h3>
            <p className="text-sm text-muted max-w-lg mx-auto mb-8 text-center">
              {qualitySafetyContent.commitment.intro}
            </p>
            <Reveal>
              <PrincipleTags items={qualitySafetyContent.commitment.bullets} tone="teal" />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Governance, Improvement, Broader View & Culture — 4 short heading+paragraph
 * blocks with no bullets and only one having a photo. Rendering them as one
 * equal-weight icon-card grid (instead of splitting them across a photo+text
 * section and a separate 2-card split) avoids 3 different visual treatments
 * for 4 sibling ideas. The card style deliberately echoes the homepage's own
 * enhanceServices icon-cards (one of which links to this very page) rather
 * than inventing a new one — see IconCards. The governance photo becomes a
 * wide banner above the grid instead of competing 50/50 with just one of the
 * four topics. */
function PrinciplesSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal className="reveal-scale">
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-12">
            <Image
              src="/images/stock/governance-review.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <IconCards
          items={[
            {
              icon: "shield-check",
              heading: qualitySafetyContent.governance.heading,
              body: qualitySafetyContent.governance.body,
            },
            {
              icon: "chart-bar",
              heading: qualitySafetyContent.improvement.heading,
              body: qualitySafetyContent.improvement.body,
            },
            {
              icon: "globe",
              heading: qualitySafetyContent.broaderView.heading,
              body: qualitySafetyContent.broaderView.body,
            },
            {
              icon: "users",
              heading: qualitySafetyContent.culture.heading,
              body: qualitySafetyContent.culture.body,
            },
          ]}
        />
      </Container>
    </section>
  );
}

export default function SafetyImprovementPage() {
  return (
    <>
      <CareersHero
        title="Quality, Safety & Continuous Improvement"
        subtitle="Quality and safety are the foundation of our culture — the standard by which we measure ourselves every day."
        compact
        image="/images/stock/team-meeting.jpg"
      />

      <IntroSection />

      <Divider />

      <CycleAndCommitmentSection />

      <Divider />

      <PrinciplesSection />

      <section className="py-16 sm:py-20">
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

      <CareersCTAStrip
        heading="Want to Know More About Our Quality & Safety Standards?"
        body="Talk to our team about the governance, oversight, and continuous-improvement culture behind every home we run."
        ctaLabel="Contact Us"
        ctaHref="/#contact"
        secondaryLabel="Make a Referral"
        secondaryHref="/referrals"
        tone="purple"
      />
    </>
  );
}
