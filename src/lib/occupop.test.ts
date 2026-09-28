/**
 * Runnable check for the Occupop client:
 *   node --test src/lib/occupop.test.ts
 * Uses the real API fixture; fetch is stubbed, never hits the network.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { fetchLiveJob, fetchLiveJobs, htmlToBlocks, normalise } from "./occupop.ts";

const fixture = JSON.parse(
  readFileSync(new URL("./__fixtures__/occupop-jobs.json", import.meta.url), "utf8"),
);
const jobs = fixture.data;
const bySalary = (type: string, period: string) =>
  jobs.find((j: { salary: { type: string; period: string } }) =>
    j.salary.type === type && j.salary.period === period);

const realFetch = globalThis.fetch;
const realToken = process.env.OCCUPOP_API_TOKEN;
afterEach(() => {
  globalThis.fetch = realFetch;
  if (realToken === undefined) delete process.env.OCCUPOP_API_TOKEN;
  else process.env.OCCUPOP_API_TOKEN = realToken;
});

// Stub: serves the given pages in order, recording requested URLs.
function stubFetch(pages: object[], calls: string[]) {
  process.env.OCCUPOP_API_TOKEN = "test-token";
  globalThis.fetch = (async (url: string) => {
    calls.push(String(url));
    const body = pages[Math.min(calls.length, pages.length) - 1];
    return new Response(JSON.stringify(body), { status: 200 });
  }) as typeof fetch;
}

const page = (data: object[], next: string | null, last = 2) => ({
  data,
  links: { next },
  meta: { per_page: 15, last_page: last },
});

test("normalise maps fixture job 0 to schema-ready fields", () => {
  const job = normalise(jobs[0]);
  assert.equal(job.slug, "team-leader-843d4");
  assert.equal(job.datePosted, "2026-09-28T07:51:38Z");
  assert.equal(job.validThrough, null);
  assert.equal(job.employmentType, "FULL_TIME");
  assert.deepEqual(job.address, {
    locality: "Borris-in-Ossory",
    region: "County Laois",
    country: "IE",
  });
  assert.equal(job.descriptionHtml, jobs[0].description);
  assert.ok(job.descriptionBlocks.length > 1);
  assert.equal(job.descriptionBlocks.some((b) => /<|&amp;|&nbsp;/.test(b)), false);
});

test("normalise keeps the existing display fields", () => {
  const job = normalise(jobs[0]);
  assert.equal(job.uuid, jobs[0].uuid);
  assert.equal(job.contractType, "Full-time");
  assert.equal(job.applyUrl, jobs[0].apply_url);
  assert.ok(job.shortDescription.length <= 160);
});

test("normalise falls back to uuid when unique_slug is missing", () => {
  assert.equal(normalise({ ...jobs[0], unique_slug: undefined }).slug, jobs[0].uuid);
});

test("normalise maps close_date to ISO validThrough", () => {
  const job = normalise({ ...jobs[0], close_date: "2026-10-31T23:59:59.000000Z" });
  assert.equal(job.validThrough, "2026-10-31T23:59:59Z");
});

test("normalise returns empty datePosted for an invalid created_at", () => {
  assert.equal(normalise({ ...jobs[0], created_at: "not a date" }).datePosted, "");
});

test("normalise maps part-time and unknown periods", () => {
  assert.equal(normalise({ ...jobs[0], period: "Part time" }).employmentType, "PART_TIME");
  assert.equal(normalise({ ...jobs[0], period: "Casual" }).employmentType, null);
  assert.equal(normalise({ ...jobs[0], period: null }).employmentType, null);
});

test("salary is null for a Competitive job", () => {
  assert.equal(normalise(bySalary("Competitive", "Annual")).salary, null);
});

test("salary maps a Range Annual job to YEAR", () => {
  assert.deepEqual(normalise(bySalary("Range", "Annual")).salary, {
    min: 35000,
    max: 50000,
    unit: "YEAR",
  });
});

test("salary maps a Range Hourly job to HOUR", () => {
  assert.deepEqual(normalise(bySalary("Range", "Hourly")).salary, {
    min: 350,
    max: 500,
    unit: "HOUR",
  });
});

test("salary is null for a Range with a missing bound", () => {
  const job = bySalary("Range", "Annual");
  assert.equal(normalise({ ...job, salary: { ...job.salary, end: null } }).salary, null);
});

test("htmlToBlocks splits paragraphs, list items and breaks", () => {
  const html =
    "<p>Care &amp; support</p><ul><li><strong>Nights</strong></li><li>Days&nbsp;off</li></ul>" +
    "<p>Line one<br>Line&#39;s two &#8364;5</p><div>  </div>";
  assert.deepEqual(htmlToBlocks(html), [
    "Care & support",
    "• Nights",
    "• Days off",
    "Line one",
    "Line's two €5",
  ]);
});

test("htmlToBlocks returns [] for empty input", () => {
  assert.deepEqual(htmlToBlocks(""), []);
});

test("fetchLiveJobs follows pagination and stops at the last page", async () => {
  const calls: string[] = [];
  stubFetch([page([jobs[0]], "http://api.occupop.com/rest/jobs?page=2"), page([jobs[1]], null)], calls);
  const result = await fetchLiveJobs();
  assert.deepEqual(result.map((j) => j.slug), [jobs[0].unique_slug, jobs[1].unique_slug]);
  assert.equal(calls.length, 2);
  assert.equal(calls[1], "https://api.occupop.com/rest/jobs?page=2");
});

test("fetchLiveJobs caps pagination at 10 pages", async () => {
  const calls: string[] = [];
  stubFetch([page([jobs[0]], "next", 99)], calls);
  const result = await fetchLiveJobs();
  assert.deepEqual(
    calls,
    Array.from({ length: 10 }, (_, i) => `https://api.occupop.com/rest/jobs?page=${i + 1}`),
  );
  assert.equal(result.length, 10);
});

test("fetchLiveJobs throws when a page response lacks meta", async () => {
  const calls: string[] = [];
  stubFetch([{ data: [jobs[0]], links: { next: null } }], calls);
  await assert.rejects(fetchLiveJobs(), { message: "Occupop response missing links/meta" });
});

test("normalise decodes entities in shortDescription", () => {
  const job = normalise({ ...jobs[0], description: "<p>Care &amp; support</p>" });
  assert.equal(job.shortDescription, "Care & support");
});

test("fetchLiveJobs excludes closed and unpublished jobs", async () => {
  const calls: string[] = [];
  const unpublished = { ...jobs[1], published: false };
  stubFetch([page([jobs[0], jobs[6], unpublished], null, 1)], calls);
  const result = await fetchLiveJobs();
  assert.deepEqual(result.map((j) => j.slug), [jobs[0].unique_slug]);
});

test("fetchLiveJobs throws on a non-ok response", async () => {
  process.env.OCCUPOP_API_TOKEN = "test-token";
  globalThis.fetch = (async () => new Response("", { status: 500 })) as typeof fetch;
  await assert.rejects(fetchLiveJobs(), /Occupop API error: 500/);
});

test("fetchLiveJob finds by slug, by uuid, or returns null", async () => {
  const calls: string[] = [];
  stubFetch([page([jobs[0], jobs[1]], null, 1)], calls);
  assert.equal((await fetchLiveJob("social-care-assistant-e3b36"))?.uuid, jobs[1].uuid);
  assert.equal((await fetchLiveJob(jobs[0].uuid))?.slug, "team-leader-843d4");
  assert.equal(await fetchLiveJob("no-such-role"), null);
});
