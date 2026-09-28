import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { jobs } from "@/data/jobs";
import { serviceOwnerTestimonials } from "@/data/testimonial";

// /careers and /testimonials are redirect-only, so they are left out.
const staticPaths = [
  "/",
  "/referrals",
  "/privacy-policy",
  "/terms-of-service",
  "/careers/open-roles",
  "/careers/why-us",
  "/careers/benefits",
  "/careers/how-we-hire",
  "/careers/contact",
  "/quality",
  "/quality/model-of-care",
  "/quality/mdt",
  "/quality/safety-improvement",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...serviceOwnerTestimonials.map((t) => `/testimonials/${t.slug}`),
    ...jobs.map((job) => `/careers/open-roles/${job.slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
