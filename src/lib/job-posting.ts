import type { NormalizedJob } from "./occupop";

export type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };
type Salary = NonNullable<NormalizedJob["salary"]>;

const BULLET = "• ";
const WHOLE_EUR = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const CENT_EUR = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

// Whole euros without decimals, otherwise two; avoids trailingZeroDisplay.
const eur = (n: number) => (Number.isInteger(n) ? WHOLE_EUR : CENT_EUR).format(n);

// Groups consecutive bullet blocks into one list.
export function groupBlocks(blocks: readonly string[]): Block[] {
  return blocks.reduce<Block[]>((acc, block) => {
    if (!block.startsWith(BULLET)) return [...acc, { kind: "p", text: block }];
    const item = block.slice(BULLET.length);
    const last = acc.at(-1);
    if (last?.kind === "ul") return [...acc.slice(0, -1), { kind: "ul", items: [...last.items, item] }];
    return [...acc, { kind: "ul", items: [item] }];
  }, []);
}

export function formatSalary(salary: NormalizedJob["salary"]): string | null {
  if (salary === null) return null;
  const per = salary.unit === "YEAR" ? "per year" : "per hour";
  return `${eur(salary.min)} – ${eur(salary.max)} ${per}`;
}

function postalAddress(address: NormalizedJob["address"]) {
  return {
    "@type": "PostalAddress",
    ...(address.locality !== null && { addressLocality: address.locality }),
    ...(address.region !== null && { addressRegion: address.region }),
    addressCountry: address.country,
  };
}

function baseSalary(salary: Salary) {
  return {
    "@type": "MonetaryAmount",
    currency: "EUR",
    value: { "@type": "QuantitativeValue", minValue: salary.min, maxValue: salary.max, unitText: salary.unit },
  };
}

// Google requires description and datePosted; skip the schema without them.
export function jobPostingJsonLd(job: NormalizedJob, siteUrl: string) {
  if (!job.descriptionHtml || !job.datePosted) return null;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.descriptionHtml,
    datePosted: job.datePosted,
    ...(job.validThrough !== null && { validThrough: job.validThrough }),
    ...(job.employmentType !== null && { employmentType: job.employmentType }),
    hiringOrganization: { "@type": "Organization", name: "Lotus Care", sameAs: siteUrl, logo: `${siteUrl}/images/logo.png` },
    jobLocation: { "@type": "Place", address: postalAddress(job.address) },
    ...(job.salary !== null && { baseSalary: baseSalary(job.salary) }),
    identifier: { "@type": "PropertyValue", name: "Occupop", value: job.uuid },
    directApply: false,
    url: `${siteUrl}/careers/jobs/${job.slug}`,
  };
}
