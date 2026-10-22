"use client";

import { useInView } from "@/hooks/use-in-view";
import type { ReactNode } from "react";
import { Container } from "@/components/layout";
import { Button } from "@/components/button";

interface RecruitmentSectionProps {
  title?: string;
  description: string[];
  note?: string;
  /** The roles area — on the homepage, `<HomeRoles />` inside a Suspense
   * boundary, so the section renders before Occupop has answered. */
  roles: ReactNode;
  ctas?: Array<{ label: string; href: string; variant: "primary" | "outline" }>;
}

export function RecruitmentSection({
  title = "Join Our Team",
  description,
  note,
  roles,
  ctas = [
    { label: "Explore All Roles", href: "/careers/open-roles", variant: "primary" },
    { label: "Life at Lotus Care", href: "/careers/why-us", variant: "outline" },
  ],
}: RecruitmentSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section id="careers" className="py-20 lg:py-28 bg-accent/10">
      <Container>
        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""}`}
        >
          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
              {title}
            </h2>
            {description.map((p, i) => (
              <p key={i} className="text-lg text-foreground leading-relaxed mb-3 last:mb-0">
                {p}
              </p>
            ))}
            {note && (
              <p className="text-muted mt-3">{note}</p>
            )}
          </div>

          {/* Live roles — streamed in by the page (see HomeRoles) */}
          <div className="mb-10">{roles}</div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctas.map((cta) => (
              <Button key={cta.label} href={cta.href} variant={cta.variant} size="lg">
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
