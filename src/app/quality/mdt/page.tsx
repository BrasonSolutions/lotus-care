import type { Metadata } from "next";
import Image from "next/image";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { HubAndSpoke } from "@/components/quality/hub-and-spoke";
import { PrincipleTags } from "@/components/quality/principle-cards";
import { TeamStrip } from "@/components/quality/team-strip";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { LotusBand } from "@/components/lotus-band";
import { Blob } from "@/components/blob";
import { Reveal } from "@/components/reveal";
import { Chip } from "@/components/chip";
import { mdtCore, mdtSpokes, mdtContent, mdtTeam } from "@/data/quality";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Multidisciplinary Team",
  description:
    "The clinical and therapeutic experts working alongside frontline staff to deliver holistic, coordinated care at Lotus Care.",
};

// Teal only, per the same standing rule as /quality/model-of-care — no
// purple divider band.
function Divider() {
  return (
    <div aria-hidden="true">
      <LotusBand variant="teal" height={72} />
    </div>
  );
}

/** #92 asked for an intro video; no asset exists (nothing in the client's
 * Drive folder, nothing attached to the issue). A clearly-marked
 * placeholder, not a real embed — reuses the exact play-triangle icon and
 * "Coming soon" badge convention already established in
 * VideoTestimonialCard, rather than inventing a new one. Nothing here loads
 * or references any media file. */
function VideoPlaceholder() {
  return (
    <div className="py-14 sm:py-16">
      <Container>
        <Reveal className="reveal-scale">
          <div className="aspect-video max-w-3xl mx-auto rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div
              className="w-14 h-14 rounded-full bg-primary-dark/10 flex items-center justify-center"
              aria-hidden="true"
            >
              <svg className="w-5 h-5 text-primary-dark translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <Chip tone="solid" size="sm">
              Coming soon
            </Chip>
            <p className="text-sm text-muted">An introduction to our Multidisciplinary Team</p>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}

/** Intro — same 2-column intro-plus-photo rhythm as Model of Care's
 * CurriculumSection/ADTSection. No card grid below: the 2 intro paragraphs
 * don't split into discrete points the way Curriculum's did. */
function IntroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <Blob color="teal" variant={2} className="absolute -top-24 -right-24 w-80 h-80" />
      <Blob color="purple" variant={1} className="absolute -bottom-24 -left-24 w-72 h-72" />
      <Container className="relative">
        <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
          <div className="space-y-4 max-w-lg">
            {mdtContent.intro.map((paragraph) => (
              <p key={paragraph} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/images/stock/everyday-connection.jpg"
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

/** "Our Internal MDT" — mirrors Model of Care's Human Rights panel exactly:
 * one bounded bg-white panel (bg-white, not bg-warm-bg — this route's own
 * ambient from quality/layout.tsx is bg-warm-bg, so bg-white is what
 * actually reads as a distinct panel) holding two sub-blocks split by a
 * hairline. HubAndSpoke itself — component and invocation — is completely
 * unchanged, only re-housed; only its spokes' description text changed. */
function InternalMdtSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          title="Our Internal MDT"
          subtitle="Eight disciplines working around a single, person-centred core."
        />
        <div className="rounded-3xl bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
          <div>
            <h3 className="text-xl font-bold text-primary-dark mb-8 text-center">The Team</h3>
            <Reveal>
              <HubAndSpoke core={mdtCore} spokes={mdtSpokes} />
            </Reveal>
          </div>

          <div className="mt-14 pt-14 border-t border-black/5">
            <h3 className="text-xl font-bold text-teal-800 mb-8 text-center">
              {mdtContent.approach.heading}
            </h3>
            <Reveal>
              <PrincipleTags items={mdtContent.approach.bullets} tone="teal" />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Working in Partnership + Governance — mirrors ADTSection's shape:
 * intro-plus-photo, then a supporting tile grid. */
function PartnershipSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <Blob color="teal" variant={2} className="absolute -top-24 -right-24 w-80 h-80" />
      <Blob color="purple" variant={1} className="absolute -bottom-24 -left-24 w-72 h-72" />
      <Container className="relative">
        <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
          <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:order-1">
            <Image
              src="/images/stock/helping-child-write.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              // Source is a tall portrait photo; default object-center cropped
              // out both people's faces, object-top cropped out the actual
              // hands-on activity below them (measured via screenshots, not
              // guessed). This position keeps the carer's face, the boy, and
              // the craft activity all in frame together.
              className="object-cover object-[50%_35%] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="max-w-lg md:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-3">
              {mdtContent.partnership.heading}
            </h2>
            <p className="text-muted leading-relaxed">{mdtContent.partnership.body}</p>
          </div>
        </Reveal>

        <Reveal className="mt-16 sm:mt-20 text-center">
          <h3 className="text-xl font-bold text-purple-700 mb-2">{mdtContent.governance.heading}</h3>
          <p className="text-sm text-muted max-w-lg mx-auto mb-8">{mdtContent.governance.intro}</p>
          <PrincipleTags items={mdtContent.governance.bullets} tone="purple" />
        </Reveal>
      </Container>
    </section>
  );
}

export default function MdtPage() {
  return (
    <>
      <CareersHero
        title="Multidisciplinary Team"
        subtitle="A collaborative, holistic approach bringing together clinical and therapeutic expertise for every person we support."
        compact
        image="/images/stock/hands-on-support.jpg"
      />

      <VideoPlaceholder />

      <Divider />

      <IntroSection />

      <Divider />

      <InternalMdtSection />

      <Divider />

      <PartnershipSection />

      <Divider />

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <TeamStrip
              heading="Our Multidisciplinary Team"
              intro="A few of the clinical and therapeutic specialists behind this model of care."
              members={mdtTeam}
            />
          </Reveal>
        </Container>
      </section>

      <CareersCTAStrip
        heading="Want to Know More About Our Multidisciplinary Team?"
        body="Integrated, person-centred, proactive, coordinated, and responsive care — talk to our team about how our MDT supports every person we care for."
        ctaLabel="Contact Us"
        ctaHref="/#contact"
        secondaryLabel="Make a Referral"
        secondaryHref="/referrals"
        tone="purple"
      />
    </>
  );
}
