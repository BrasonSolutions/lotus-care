const BASE_URL = "https://api.occupop.com";

interface OccupopJob {
  uuid: string;
  title: string;
  description: string | null;
  location: string | null;
  contract: string | null;
  created_at: string;
  close_date: string | null;
  apply_url: string;
}

interface OccupopResponse {
  data: OccupopJob[];
}

export interface NormalizedJob {
  uuid: string;
  title: string;
  location: string;
  contractType: string;
  shortDescription: string;
  postedDate: string;
  applyUrl: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalise(job: OccupopJob): NormalizedJob {
  const raw = job.description ? stripHtml(job.description) : "";
  const shortDescription =
    raw.length > 160 ? raw.slice(0, 157).trimEnd() + "…" : raw;

  return {
    uuid: job.uuid,
    title: job.title,
    location: job.location ?? "Ireland",
    contractType: job.contract ?? "Permanent",
    shortDescription,
    postedDate: formatDate(job.created_at),
    applyUrl: job.apply_url,
  };
}

export async function fetchLiveJobs(): Promise<NormalizedJob[]> {
  const token = process.env.OCCUPOP_API_TOKEN;
  if (!token) throw new Error("OCCUPOP_API_TOKEN is not set");

  const res = await fetch(`${BASE_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Occupop API error: ${res.status}`);
  }

  const json: OccupopResponse = await res.json();
  return (json.data ?? []).map(normalise);
}
