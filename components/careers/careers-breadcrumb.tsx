"use client";

import { usePathname } from "next/navigation";

const pageLabels: Record<string, string> = {
  "open-roles": "Open Roles",
  "why-us": "Why Work With Us",
  benefits: "Benefits",
  training: "Training & Development",
  "how-we-hire": "How We Hire",
  contact: "Contact Recruitment",
};

export default function CareersBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // segments[0] === "careers"
  const sub = segments[1];
  const deepSub = segments[2];

  if (!sub) return null;

  const subLabel = pageLabels[sub] ?? sub;

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <ol className="flex items-center gap-2 text-sm text-muted">
        <li>
          <a href="/careers" className="hover:text-primary transition-colors focus-ring rounded">
            Careers
          </a>
        </li>
        <li aria-hidden="true">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </li>
        {deepSub ? (
          <>
            <li>
              <a
                href={`/careers/${sub}`}
                className="hover:text-primary transition-colors focus-ring rounded"
              >
                {subLabel}
              </a>
            </li>
            <li aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li aria-current="page" className="text-primary-dark font-medium truncate max-w-[200px]">
              {deepSub.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
            </li>
          </>
        ) : (
          <li aria-current="page" className="text-primary-dark font-medium">
            {subLabel}
          </li>
        )}
      </ol>
    </nav>
  );
}
