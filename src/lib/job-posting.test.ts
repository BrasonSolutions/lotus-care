/**
 * Runnable check for JobPosting helpers:
 *   node --test src/lib/job-posting.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { normalise } from "./occupop.ts";
import { formatSalary, groupBlocks, jobPostingJsonLd } from "./job-posting.ts";

const fixture = JSON.parse(
  readFileSync(new URL("./__fixtures__/occupop-jobs.json", import.meta.url), "utf8"),
);
const SITE = "https://example.ie";
const job0 = normalise(fixture.data[0]);

test("jobPostingJsonLd maps fixture job 0 to a JobPosting", () => {
  const ld = jobPostingJsonLd(job0, SITE)!;
  assert.equal(ld["@type"], "JobPosting");
  assert.equal(ld.datePosted, "2026-09-28T07:51:38Z");
  assert.equal(ld.employmentType, "FULL_TIME");
  assert.equal(ld.hiringOrganization.sameAs, SITE);
  assert.equal(ld.jobLocation.address.addressCountry, "IE");
  assert.equal(ld.jobLocation.address.addressLocality, "Borris-in-Ossory");
  assert.equal(ld.directApply, false);
  assert.equal(ld.url, `${SITE}/careers/jobs/team-leader-843d4`);
  assert.equal("validThrough" in ld, false);
  assert.equal("baseSalary" in ld, false);
});

test("jobPostingJsonLd includes validThrough when set", () => {
  const ld = jobPostingJsonLd({ ...job0, validThrough: "2026-12-31T00:00:00Z" }, SITE)!;
  assert.equal(ld.validThrough, "2026-12-31T00:00:00Z");
});

test("jobPostingJsonLd adds baseSalary for Range jobs", () => {
  const annual = jobPostingJsonLd(normalise(fixture.data[10]), SITE)!;
  assert.equal(annual.baseSalary?.currency, "EUR");
  assert.deepEqual(annual.baseSalary?.value, {
    "@type": "QuantitativeValue", minValue: 35000, maxValue: 50000, unitText: "YEAR",
  });
  const hourly = jobPostingJsonLd(normalise(fixture.data[11]), SITE)!;
  assert.equal(hourly.baseSalary?.value.unitText, "HOUR");
});

test("jobPostingJsonLd omits addressLocality when locality is null", () => {
  const ld = jobPostingJsonLd({ ...job0, address: { ...job0.address, locality: null } }, SITE)!;
  assert.equal("addressLocality" in ld.jobLocation.address, false);
  assert.equal(ld.jobLocation.address.addressRegion, "County Laois");
});

test("jobPostingJsonLd returns null without description or datePosted", () => {
  assert.equal(jobPostingJsonLd({ ...job0, descriptionHtml: "" }, SITE), null);
  assert.equal(jobPostingJsonLd({ ...job0, datePosted: "" }, SITE), null);
});

test("formatSalary formats ranges and passes null through", () => {
  assert.equal(formatSalary(null), null);
  assert.equal(formatSalary({ min: 35000, max: 50000, unit: "YEAR" }), "€35,000 – €50,000 per year");
  assert.equal(formatSalary({ min: 13.5, max: 15, unit: "HOUR" }), "€13.50 – €15 per hour");
});

test("groupBlocks merges consecutive bullets and keeps paragraphs separate", () => {
  assert.deepEqual(groupBlocks(["Intro", "Second", "• a", "• b", "Outro", "• c"]), [
    { kind: "p", text: "Intro" },
    { kind: "p", text: "Second" },
    { kind: "ul", items: ["a", "b"] },
    { kind: "p", text: "Outro" },
    { kind: "ul", items: ["c"] },
  ]);
});
