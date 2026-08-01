import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { OpenRolesClient } from "./OpenRolesClient";
import { fetchLiveJobs } from "@/lib/occupop";
import { Container } from "@/components/layout";

export default async function OpenRolesPage() {
  const jobs = await fetchLiveJobs().catch(() => null);

  return (
    <>
      <CareersHero
        title="Open Roles"
        subtitle="Find your next opportunity and join a team that truly cares."
        compact
        image="/images/stock/team-meeting.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />

          {jobs === null ? (
            <p className="text-muted text-center py-16">
              We&apos;re having trouble loading roles right now. Please check back soon.
            </p>
          ) : (
            <OpenRolesClient jobs={jobs} />
          )}

          <div className="mt-12 text-center p-8 bg-white rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-primary-dark mb-2">
              Don&apos;t see the right role?
            </h3>
            <p className="text-muted text-sm mb-4">
              We&apos;re always looking for great people. Send us your CV and
              we&apos;ll be in touch when something suitable comes up.
            </p>
            <a
              href="/careers/contact"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors focus-ring"
            >
              Register Your Interest
            </a>
          </div>
        </Container>
      </div>

      <CareersCTAStrip
        ctaLabel="Contact Our Recruitment Team"
        ctaHref="/careers/contact"
        secondaryLabel="Learn How We Hire"
        secondaryHref="/careers/how-we-hire"
      />
    </>
  );
}
