import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CareersHero } from "@/components/careers/careers-hero";
import { SectionTitle } from "@/components/section-title";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { KeywordCards } from "@/components/quality/keyword-cards";
import { PrincipleCards } from "@/components/quality/principle-cards";
import { SpecialtyChips } from "@/components/quality/specialty-chips";
import { TestimonialGrid, type TestimonialGridItem } from "@/components/quality/testimonial-grid";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { LotusBand } from "@/components/lotus-band";
import { QualityPillars } from "@/components/quality/quality-pillars";
import { Blob } from "@/components/blob";
import { Reveal } from "@/components/reveal";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/button";
import {
  adtContent,
  curriculumContent,
  humanRightsFramework,
  humanRightsContent,
  modelOfCareSections,
} from "@/data/quality";
import { modelOfCareTestimonials } from "@/data/testimonial";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Model of Care",
  description:
    "Lotus Care's model of care — the 24-hour curriculum, transitions, and human rights that shape how we support every person.",
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

/** 24-Hour Curriculum (#119) — an intro-plus-photo block, followed by a
 * KeywordCards block for the three points, matching how the Human Rights
 * section renders its own keyword lists. */
function CurriculumSection() {
  const curriculum = section("curriculum");

  return (
    <section id="curriculum" className={`relative overflow-hidden py-16 sm:py-20 ${ANCHOR_OFFSET}`}>
      <Blob color="teal" variant={2} className="absolute -top-24 -right-24 w-80 h-80" />
      <Blob color="purple" variant={1} className="absolute -bottom-24 -left-24 w-72 h-72" />
      <Container className="relative">
        <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
          <div className="max-w-lg">
            <Eyebrow number={curriculum.number} label={curriculum.label} />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-3">{curriculum.heading}</h2>
            <p className="text-lg font-semibold text-foreground mb-4">{curriculumContent.subtitle}</p>
            <div className="space-y-4">
              {curriculumContent.intro.map((paragraph) => (
                <p key={paragraph} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src={curriculum.image}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Reveal>

        <Reveal className="mt-16 sm:mt-20">
          <KeywordCards items={curriculumContent.keywords} tone="teal" />
        </Reveal>
      </Container>
    </section>
  );
}

/** Admissions, Discharges & Transitions (#121) — same intro-plus-photo
 * rhythm as CurriculumSection (image on the left, per the section's existing
 * `imagePosition="left"`), followed by a horizontal Timeline for the 4-step
 * flow, the 7 clinical specialties as wrapped Chip pills (no per-item
 * description exists to fill a KeywordCards item), and a "Make a Referral"
 * CTA. */
function ADTSection() {
  const adt = section("adt");

  return (
    <section id="adt" className={`relative overflow-hidden py-16 sm:py-20 ${ANCHOR_OFFSET}`}>
      <Blob color="teal" variant={2} className="absolute -top-24 -right-24 w-80 h-80" />
      <Blob color="purple" variant={1} className="absolute -bottom-24 -left-24 w-72 h-72" />
      <Container className="relative">
        <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center reveal-scale">
          <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:order-1">
            <Image
              src={adt.image}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="max-w-lg md:order-2">
            <Eyebrow number={adt.number} label={adt.label} />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-3">{adt.heading}</h2>
            <p className="text-lg font-semibold text-foreground mb-4">{adtContent.subtitle}</p>
            <p className="text-muted leading-relaxed">{adtContent.intro}</p>
          </div>
        </Reveal>

        <Reveal className="mt-16 sm:mt-20">
          <Timeline steps={adtContent.steps} orientation="horizontal" circleVariant="solid" />
        </Reveal>

        <Reveal className="mt-16 sm:mt-20 text-center">
          <h3 className="text-xl font-bold text-primary-dark mb-5">Clinical Specialties We Support</h3>
          <SpecialtyChips items={adtContent.specialties} tone="purple" />
        </Reveal>

        <Reveal className="mt-12 text-center">
          <Button href="/referrals" variant="primary" size="lg">
            Make a Referral
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

// Teal only, per standing rule for this page — no purple divider band.
function Divider() {
  return (
    <div aria-hidden="true">
      <LotusBand variant="teal" height={72} />
    </div>
  );
}

/** The three parts of the model, as the page's signature infographic — every
 * other Quality page opens with one (QualityPillars, HubAndSpoke,
 * CircularCycle). Doubles as the section nav, so there is no separate row of
 * jump links repeating the same three words. */
function ModelPillars() {
  return (
    <nav aria-label="Model of Care sections">
      <QualityPillars
        heading="Three Parts, One Model"
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
  const [johnTestimonial, ...otherTestimonials] = modelOfCareTestimonials;
  const testimonialItems: TestimonialGridItem[] = [
    {
      testimonial: johnTestimonial,
      clampQuote: true,
      action: (
        <Link
          href="/testimonials/jw"
          aria-label={`Read the full testimonial from ${johnTestimonial.name}, ${johnTestimonial.role}`}
          className="inline-block bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-800 transition-colors focus-ring"
        >
          Read more
        </Link>
      ),
    },
    ...otherTestimonials.map((testimonial) => ({ testimonial, clampQuote: true })),
  ];

  return (
    <>
      <CareersHero
        title="Model of Care"
        subtitle="How we support every person day to day — a 24-hour curriculum, considered transitions, and a rights-based approach."
        compact
        image="/images/stock/caring-embrace.jpg"
      />

      <section className="py-14 sm:py-16">
        <Container>
          <ModelPillars />
        </Container>
      </section>

      <Divider />

      <CurriculumSection />

      <Divider />

      <ADTSection />

      <Divider />

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
                <p className="text-lg font-semibold text-foreground">{humanRightsContent.subtitle}</p>
                {humanRightsContent.intro.map((paragraph) => (
                  <p key={paragraph} className="text-muted leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/stock/guided-choice.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Reveal>
          </Container>
        </div>

        {/* Framework + Approach used to be two more full SectionTitle blocks
            in a row — reading as two more peer sections after "Human Rights"
            itself, rather than two parts of it. One warm-bg panel now holds
            both, with demoted (h3, not SectionTitle) sub-headings and a
            hairline divider between them instead of a full section break. */}
        <div className="py-16 sm:py-20">
          <Container>
            {/* This whole page sits on the /quality route group's `bg-warm-bg`
                ambient (quality/layout.tsx) — bg-white here is what actually
                makes this read as a distinct panel, not bg-warm-bg (which
                would be invisible against its own background). */}
            <div className="rounded-3xl bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
              <div>
                <h3 className="text-xl font-bold text-primary-dark mb-2 text-center">
                  The Framework
                </h3>
                <p className="text-sm text-muted max-w-lg mx-auto mb-10 text-center">
                  Five principles that guide how rights are embedded, upheld, and continuously
                  strengthened across our services.
                </p>
                <Reveal>
                  <CircularCycle steps={humanRightsFramework} centerLabel="Human Rights Framework" />
                </Reveal>
              </div>

              <div className="mt-14 pt-14 border-t border-black/5">
                <h3 className="text-xl font-bold text-purple-700 mb-2 text-center">
                  {humanRightsContent.approach.heading}
                </h3>
                <p className="text-sm text-muted max-w-lg mx-auto mb-10 text-center">
                  {humanRightsContent.approach.intro}
                </p>
                {/* Outer Reveal (block fade+slide) plus PrincipleCards' own
                    per-item pop-in stagger — same double-layer convention
                    Timeline/CircularCycle already use elsewhere on this page. */}
                <Reveal>
                  <PrincipleCards items={humanRightsContent.approachKeywords} tone="purple" />
                </Reveal>
              </div>
            </div>
          </Container>
        </div>

      </section>

      <Divider />

      <section id="testimonials" className={ANCHOR_OFFSET}>
        <div className="py-14 sm:py-16">
          <Container>
            <SectionTitle
              title="Testimonials"
              subtitle="Real voices from the people we support, in their own words."
            />
            <TestimonialGrid items={testimonialItems} />
          </Container>
        </div>
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
