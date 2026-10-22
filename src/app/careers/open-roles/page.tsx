import { Suspense } from "react";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { CareersCTAStrip } from "@/components/careers/careers-cta-strip";
import { OpenRolesClient } from "./OpenRolesClient";
import { fetchLiveJobs } from "@/lib/occupop";
import { Container } from "@/components/layout";
import { JobCardSkeletons } from "@/components/careers/job-card/JobCardSkeletons";

export const dynamic = "force-dynamic";

// Occupop is slow on a cold cache, so the roles stream in behind placeholder
// cards while the rest of the page renders immediately.
async function LiveRoles() {
  const jobs = await fetchLiveJobs().catch(() => null);

  if (jobs === null) {
    return (
      <p className="text-muted text-center py-16">
        We&apos;re having trouble loading roles right now. Please check back soon.
      </p>
    );
  }
  return <OpenRolesClient jobs={jobs} />;
}

// Same vertical rhythm as OpenRolesClient (filter row, then grid) so the
// placeholders hand over to real content without shifting the page.
function RolesFallback() {
  return (
    <>
      <div className="mt-8 mb-6 flex gap-2 pb-2" aria-hidden="true">
        {[96, 88, 104].map((w) => (
          <div key={w} className="h-[38px] rounded-full bg-gray-100 animate-pulse" style={{ width: w }} />
        ))}
      </div>
      <JobCardSkeletons count={6} />
    </>
  );
}

export default function OpenRolesPage() {
  return (
    <>
      <CareersHero
        title="Open Roles"
        subtitle="Find your next opportunity and join a team that truly cares."
        compact
        image="/images/heroes/open-roles-hero.webp"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />

          <Suspense fallback={<RolesFallback />}>
            <LiveRoles />
          </Suspense>

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
              className="inline-block bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-800 transition-colors focus-ring"
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
