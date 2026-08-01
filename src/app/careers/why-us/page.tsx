import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { CultureGallery } from "@/components/careers/culture-gallery";
import { VideoTestimonialCard } from "@/components/careers/video-testimonial-card";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { SectionTitle } from "@/components/section-title";
import { testimonials, employerStats, cultureGalleryImages, videoTestimonials } from "@/data/careers";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Why Work With Us",
  description:
    "Discover why over 150 people choose to build their career at Lotus Care — culture, values, and a team that truly supports one another.",
};

export default function WhyUsPage() {
  return (
    <>
      <CareersHero
        title="A Career With Purpose"
        subtitle="At Lotus Care, we believe great care starts with great people. Here's what makes us different."
        compact
        image="/images/stock/community-friends.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />
        </Container>
      </div>

      <CultureGallery images={cultureGalleryImages} />

      {/* Culture narrative */}
      <section className="py-16 sm:py-20 bg-primary-dark">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                A Culture Built on Respect
              </h2>
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p>
                  We know that the wellbeing of our staff directly impacts the quality of
                  care our residents receive. That&apos;s why we&apos;ve invested heavily in
                  building a culture where every team member feels valued, supported, and
                  heard.
                </p>
                <p>
                  From structured supervision and peer mentoring to an open-door management
                  policy, we make it easy to raise concerns, share ideas, and get the
                  support you need to thrive in your role.
                </p>
                <p>
                  We&apos;re proud of the diversity of our team — people from different
                  backgrounds, disciplines, and life experiences who share a common
                  commitment to making a positive difference.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {employerStats.map(({ label, value }, i) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                >
                  <p className={`text-3xl font-bold mb-1 ${i % 2 === 0 ? "text-accent" : "text-purple-100"}`}>
                    {value}
                  </p>
                  <p className="text-sm text-white/80">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle title="Hear From Our Team" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </Container>
      </section>

      {/* Video testimonials */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <SectionTitle
            title="In Their Own Words"
            subtitle="Video stories from the people who make Lotus Care what it is."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTestimonials.map((t, i) => (
              <VideoTestimonialCard key={t.name} testimonial={t} accent={i % 2 === 0 ? "teal" : "purple"} />
            ))}
          </div>
        </Container>
      </section>

      <CareersCTAStrip
        heading="Join a Team That Cares"
        body="Explore our open roles and find where you fit at Lotus Care."
        ctaLabel="View Open Roles"
        ctaHref="/careers/open-roles"
        secondaryLabel="Our Benefits"
        secondaryHref="/careers/benefits"
      />
    </>
  );
}
