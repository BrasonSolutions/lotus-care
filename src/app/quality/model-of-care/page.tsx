import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { FeatureSlab, FeatureSlabGroup } from "@/components/quality/feature-slab";
import { KeywordCards } from "@/components/quality/keyword-cards";
import { TeamStrip } from "@/components/quality/team-strip";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { LotusBand } from "@/components/lotus-band";
import { QualityPillars } from "@/components/quality/quality-pillars";
import { Blob } from "@/components/blob";
import { Reveal } from "@/components/reveal";
import type { ContentBlock } from "@/data/quality";
import {
  humanRightsFramework,
  humanRightsContent,
  humanRightsTeam,
  modelOfCareSections,
} from "@/data/quality";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Model of Care",
  description:
    "Lotus Care's model of care — the 24-hour curriculum, transitions, human rights, and safeguarding that shape how we support every person.",
};

// Clears the fixed navbar (and the subnav above the nav breakpoint) when a
// jump link scrolls a section to the top of the viewport.
const ANCHOR_OFFSET = "scroll-mt-24 nav:scroll-mt-36";

function section(id: string) {
  const index = modelOfCareSections.findIndex((s) => s.id === id);
  if (index === -1) throw new Error(`Unknown Model of Care section: ${id}`);
  return { ...modelOfCareSections[index], number: String(index + 1).padStart(2, "0") };
}

function Eyebrow({ number, label }: { number: string; label: string }) {
  return (
    <p className="font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-purple-600 mb-3">
      {number} — {label}
    </p>
  );
}

/** A section whose copy has not arrived yet. Carries the same 50/50 text-and-
 * photo treatment every other Quality page opens with, so it reads as a real
 * section rather than an empty shell — the client already rejected "too white,
 * too basic" once (docs/feedback.md). */
function ProvisionalSection({ id, imagePosition = "right" }: { id: string; imagePosition?: "left" | "right" }) {
  const { heading, intro, image, label, number } = section(id);
  return (
    <section id={id} className={`relative overflow-hidden py-16 sm:py-20 ${ANCHOR_OFFSET}`}>
      <Blob color="teal" variant={2} className="absolute -top-24 -right-24 w-80 h-80" />
      <Blob color="purple" variant={1} className="absolute -bottom-24 -left-24 w-72 h-72" />
      <Container className="relative">
        <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
          <div className={`max-w-lg ${imagePosition === "left" ? "md:order-2" : ""}`}>
            <Eyebrow number={number} label={label} />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4">{heading}</h2>
            <p className="text-muted leading-relaxed">{intro}</p>
            <span className="mt-5 inline-block rounded-full bg-primary-dark px-3 py-1 text-xs font-semibold text-white">
              Full detail coming soon
            </span>
          </div>
          <div
            className={`group relative rounded-2xl overflow-hidden aspect-[4/3] ${
              imagePosition === "left" ? "md:order-1" : ""
            }`}
          >
            <Image
              src={image}
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

function Divider({ variant }: { variant: "teal" | "purple" }) {
  return (
    <div aria-hidden="true">
      <LotusBand variant={variant} height={72} />
    </div>
  );
}

/** The four parts of the model, as the page's signature infographic — every
 * other Quality page opens with one (QualityPillars, HubAndSpoke,
 * CircularCycle). Doubles as the section nav, so there is no separate row of
 * jump links repeating the same four words. */
function ModelPillars() {
  return (
    <nav aria-label="Model of Care sections">
      <QualityPillars
        heading="Four Parts, One Model"
        subtitle="How support is planned, delivered, and safeguarded around each person."
        pillars={modelOfCareSections.map(({ id, icon, label, summary }) => ({
          icon,
          title: label,
          description: summary,
          href: `#${id}`,
        }))}
        foundation={modelOfCareSections.map((s) => s.label)}
        cta="Jump to section"
      />
    </nav>
  );
}

export default function ModelOfCarePage() {
  const humanRights = section("human-rights");

  return (
    <>
      <CareersHero
        title="Model of Care"
        subtitle="How we support every person day to day — a 24-hour curriculum, considered transitions, a rights-based approach, and safeguarding throughout."
        compact
        image="/images/stock/dignity-activity.jpg"
      />

      <section className="py-14 sm:py-16">
        <Container>
          <ModelPillars />
        </Container>
      </section>

      <Divider variant="teal" />

      <ProvisionalSection id="curriculum" />

      <Divider variant="purple" />

      <ProvisionalSection id="adt" imagePosition="left" />

      <Divider variant="teal" />

      <section id="human-rights" className={ANCHOR_OFFSET}>
        {/* Blobs live only on the light sections — the client asked for them
            on #63 but explicitly not inside the coloured slabs. */}
        <div className="relative overflow-hidden py-14 sm:py-16">
          <Blob color="teal" variant={1} className="absolute -top-24 -left-24 w-80 h-80" />
          <Blob color="purple" variant={3} className="absolute -bottom-20 -right-20 w-64 h-64" />
          <Container className="relative">
            <div className="text-center">
              <Eyebrow number={humanRights.number} label={humanRights.label} />
            </div>
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

        <div className="py-16 sm:py-20 bg-white">
          <Container>
            <SectionTitle
              title="The Human Rights Framework"
              subtitle="Five principles that guide how rights are embedded, upheld, and continuously strengthened across our services."
            />
            <Reveal>
              <CircularCycle steps={humanRightsFramework} centerLabel="Human Rights Framework" />
            </Reveal>
          </Container>
        </div>

        <div className="py-16 sm:py-20">
          <Container>
            <SectionTitle
              title={humanRightsContent.purpose.heading}
              subtitle={humanRightsContent.purpose.intro}
            />
            <Reveal>
              <KeywordCards items={humanRightsContent.purposeKeywords} />
            </Reveal>
          </Container>
        </div>

        <div className="py-16 sm:py-20 bg-white">
          <Container>
            <SectionTitle
              title={humanRightsContent.approach.heading}
              subtitle={humanRightsContent.approach.intro}
            />
            <Reveal>
              <KeywordCards items={humanRightsContent.approachKeywords} tone="purple" />
            </Reveal>
          </Container>
        </div>

        <Reveal>
          <FeatureSlabGroup>
            <FeatureSlab
              {...humanRightsContent.champions}
              tone="purple"
              image="/images/stock/community-friends.jpg"
              imagePosition="left"
            />
          </FeatureSlabGroup>
        </Reveal>

        <div className="relative overflow-hidden py-16 sm:py-20">
          <Blob color="purple" variant={2} className="absolute -top-16 -right-24 w-72 h-72" />
          <Blob color="teal" variant={3} className="absolute -bottom-24 -left-20 w-72 h-72" />
          <Container className="relative">
            <Reveal className="grid md:grid-cols-2 gap-8 md:gap-0 relative">
              {/* Teal-to-plum rule echoing the slabs above. Sits in the grid
                  gutter on md+ and is dropped when the cards stack. */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary-dark to-purple-600"
              />
              {([humanRightsContent.governance, humanRightsContent.culture] as ContentBlock[]).map(
                (block, i) => (
                  <div
                    key={block.heading}
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 text-center ${
                      i === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-primary-dark mb-4">{block.heading}</h3>
                    {block.intro && <p className="text-muted leading-relaxed">{block.intro}</p>}
                    {block.body && <p className="text-muted leading-relaxed">{block.body}</p>}
                  </div>
                ),
              )}
            </Reveal>
          </Container>
        </div>
      </section>

      <Divider variant="purple" />

      <ProvisionalSection id="safeguarding" imagePosition="left" />

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

      <CareersCTAStrip
        heading="Want to Know More About Our Model of Care?"
        body="Talk to our team about how we plan, deliver, and safeguard support for every person."
        ctaLabel="Contact Us"
        ctaHref="/#contact"
        secondaryLabel="Make a Referral"
        secondaryHref="/referrals"
        tone="purple"
      />
    </>
  );
}
