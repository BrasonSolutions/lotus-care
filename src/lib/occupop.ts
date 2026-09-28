const BASE_URL = "https://api.occupop.com/rest";
const MAX_PAGES = 10;

interface OccupopLocation {
  city: string | null;
  state: string | null;
  country: string | null;
  cityFullName: string | null;
  countryShort?: string | null;
}

interface OccupopSalary {
  type: string;
  period: string;
  start: string | null;
  end: string | null;
  details?: string | null;
}

interface OccupopJob {
  uuid: string;
  unique_slug?: string | null;
  title: string;
  description: string | null;
  location: OccupopLocation | null;
  contract: string | null;
  period: string | null;
  created_at: string;
  close_date: string | null;
  apply_url: string;
  salary?: OccupopSalary | null;
  published?: boolean;
  closed_for_applicants?: boolean;
}

interface OccupopResponse {
  data: OccupopJob[];
  links: { next: string | null };
  meta: { last_page: number };
}

export interface NormalizedJob {
  uuid: string;
  slug: string;
  title: string;
  location: string;
  contractType: string;
  shortDescription: string;
  descriptionHtml: string;
  descriptionBlocks: string[];
  postedDate: string;
  datePosted: string;
  validThrough: string | null;
  employmentType: "FULL_TIME" | "PART_TIME" | null;
  address: { locality: string | null; region: string | null; country: string };
  salary: { min: number; max: number; unit: "YEAR" | "HOUR" } | null;
  applyUrl: string;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  nbsp: " ",
};

const SALARY_UNITS: Record<string, "YEAR" | "HOUR"> = { Annual: "YEAR", Hourly: "HOUR" };

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntity(entity: string, body: string): string {
  const named = NAMED_ENTITIES[body.toLowerCase()];
  if (named !== undefined) return named;
  const code = /^#x/i.test(body) ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
  return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
}

function decodeEntities(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|nbsp|#\d+|#x[0-9a-f]+);/gi, decodeEntity);
}

function chunkToBlock(chunk: string): string {
  const text = decodeEntities(stripHtml(chunk)).replace(/\s+/g, " ").trim();
  if (!text) return "";
  return /<li[\s>]/i.test(chunk) ? `• ${text}` : text;
}

// Splits description HTML into plain-text paragraphs; list items get a bullet.
export function htmlToBlocks(html: string): string[] {
  return html
    .split(/<\/(?:p|li|ul|ol|div|h[1-6])\s*>|<br\s*\/?>/i)
    .map(chunkToBlock)
    .filter((block) => block !== "");
}

function normalizePeriod(period: string | null): string {
  if (!period) return "Permanent";
  const p = period.toLowerCase();
  if (p.includes("full")) return "Full-time";
  if (p.includes("part")) return "Part-time";
  return period;
}

function toEmploymentType(period: string | null): NormalizedJob["employmentType"] {
  if (period && /full/i.test(period)) return "FULL_TIME";
  if (period && /part/i.test(period)) return "PART_TIME";
  return null;
}

function extractLocation(location: OccupopLocation | null): string {
  if (!location) return "Ireland";
  return location.cityFullName ?? location.city ?? "Ireland";
}

function toAddress(location: OccupopLocation | null): NormalizedJob["address"] {
  return {
    locality: location?.city ?? null,
    region: location?.state ?? null,
    country: location?.countryShort ?? "IE",
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ISO 8601 without milliseconds; "" when the date is unparseable.
function toIso(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function toAmount(value: string | null): number {
  return value === null || value.trim() === "" ? NaN : Number(value);
}

function toSalary(salary: OccupopSalary | null | undefined): NormalizedJob["salary"] {
  if (!salary || salary.type !== "Range") return null;
  const min = toAmount(salary.start);
  const max = toAmount(salary.end);
  const unit = SALARY_UNITS[salary.period];
  if (!Number.isFinite(min) || !Number.isFinite(max) || !unit) return null;
  return { min, max, unit };
}

function toShortDescription(html: string): string {
  const raw = decodeEntities(stripHtml(html));
  return raw.length > 160 ? raw.slice(0, 157).trimEnd() + "…" : raw;
}

export function normalise(job: OccupopJob): NormalizedJob {
  const html = job.description ?? "";
  return {
    uuid: job.uuid,
    slug: job.unique_slug || job.uuid,
    title: job.title,
    location: extractLocation(job.location),
    contractType: normalizePeriod(job.period),
    shortDescription: toShortDescription(html),
    descriptionHtml: html,
    descriptionBlocks: htmlToBlocks(html),
    postedDate: formatDate(job.created_at),
    datePosted: toIso(job.created_at),
    validThrough: job.close_date ? toIso(job.close_date) || null : null,
    employmentType: toEmploymentType(job.period),
    address: toAddress(job.location),
    salary: toSalary(job.salary),
    applyUrl: job.apply_url,
  };
}

// Fetched per request; a KV cache is the upgrade path.
async function fetchPage(token: string, page: number): Promise<OccupopResponse> {
  const res = await fetch(`${BASE_URL}/jobs?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Occupop API error: ${res.status}`);
  }

  const json = await res.json();
  if (!json.links || !json.meta) throw new Error("Occupop response missing links/meta");
  return json;
}

// Builds page URLs from BASE_URL; links.next is http and would leak the token.
async function fetchAllJobs(token: string, page = 1): Promise<OccupopJob[]> {
  const json = await fetchPage(token, page);
  const hasMore = json.links.next !== null || page < json.meta.last_page;
  if (!hasMore || page >= MAX_PAGES) return json.data;
  return [...json.data, ...(await fetchAllJobs(token, page + 1))];
}

function isLive(job: OccupopJob): boolean {
  return job.published !== false && job.closed_for_applicants !== true;
}

export async function fetchLiveJobs(): Promise<NormalizedJob[]> {
  const token = process.env.OCCUPOP_API_TOKEN;
  if (!token) throw new Error("OCCUPOP_API_TOKEN is not set");

  const jobs = await fetchAllJobs(token);
  return jobs.filter(isLive).map(normalise);
}

export async function fetchLiveJob(slug: string): Promise<NormalizedJob | null> {
  const jobs = await fetchLiveJobs();
  return jobs.find((job) => job.slug === slug) ?? jobs.find((job) => job.uuid === slug) ?? null;
}
