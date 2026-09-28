import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/layout";
import { fetchLiveJob, type NormalizedJob } from "@/lib/occupop";
import { formatSalary, groupBlocks, jobPostingJsonLd } from "@/lib/job-posting";
import { SITE_URL } from "@/lib/site";

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = await fetchLiveJob(slug).catch(() => null);
  if (!job) return {};
  return { title: job.title, description: job.shortDescription };
}

function JsonLd({ job }: { job: NormalizedJob }) {
  const jsonLd = jobPostingJsonLd(job, SITE_URL);
  if (!jsonLd) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function JobHeader({ job }: { job: NormalizedJob }) {
  const salary = formatSalary(job.salary);
  const chips = [
    job.location,
    job.contractType,
    ...(job.postedDate ? [`Posted ${job.postedDate}`] : []),
    ...(salary ? [salary] : []),
  ];
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-accent/80 py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {chips.map((chip) => (
              <span key={chip} className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {chip}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{job.title}</h1>
          {job.shortDescription && <p className="text-white/80 text-lg">{job.shortDescription}</p>}
        </div>
      </Container>
    </section>
  );
}

function Description({ blocks }: { blocks: readonly string[] }) {
  return (
    <section className="space-y-4 text-foreground leading-relaxed">
      <h2 className="text-xl font-bold text-primary-dark mb-4">About the Role</h2>
      {groupBlocks(blocks).map((block, i) =>
        block.kind === "p" ? (
          <p key={i}>{block.text}</p>
        ) : (
          <ul key={i} className="list-disc pl-5 space-y-2 text-sm">
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </section>
  );
}

function ApplyPanel({ applyUrl }: { applyUrl: string }) {
  return (
    <aside>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-32">
        <h3 className="font-bold text-primary-dark text-lg mb-4">Apply for This Role</h3>
        <Button href={applyUrl} target="_blank" rel="noopener noreferrer" fullWidth>
          Apply on Occupop
        </Button>
        <p className="text-xs text-muted mt-3">Applications are handled securely by Occupop, our recruitment partner.</p>
      </div>
    </aside>
  );
}

function LoadError() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <p className="text-muted text-center py-16">
          We&apos;re having trouble loading roles right now. Please check back soon.
        </p>
      </Container>
    </div>
  );
}

export default async function LiveJobPage({ params }: Params) {
  const { slug } = await params;
  const job = await fetchLiveJob(slug).catch(() => undefined);
  if (job === undefined) return <LoadError />;
  if (job === null) notFound();

  return (
    <>
      <JsonLd job={job} />
      <JobHeader job={job} />
      <div className="py-10 sm:py-14">
        <Container>
          <Link href="/careers/open-roles" className="text-sm text-primary-dark hover:text-teal-800 transition-colors focus-ring rounded font-medium">
            ← Back to Open Roles
          </Link>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Description blocks={job.descriptionBlocks} />
            </div>
            <ApplyPanel applyUrl={job.applyUrl} />
          </div>
        </Container>
      </div>
    </>
  );
}
