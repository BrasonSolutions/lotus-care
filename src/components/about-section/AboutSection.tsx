"use client";

import { useInView } from "@/hooks/use-in-view";
import { SectionTitle } from "@/components/section-title";
import { Container } from "@/components/layout";

interface AboutSectionProps {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  stats: Array<{ value: string; label: string }>;
}

const STAGGER_MS = 90;

export function AboutSection({ title, subtitle, paragraphs, stats }: AboutSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="relative overflow-hidden py-20 lg:py-28 bg-white">
      {/* overflow-hidden: the stat pools sit on a negative inset and would
          otherwise widen the page on small viewports. */}
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />

        <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-8">
          {/* Text content */}
          <div className={`reveal ${inView ? "in-view" : ""}`}>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-foreground leading-relaxed mb-6 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          {/* Stats rail — one straight vertical line, replacing the orbit (#87). */}
          <div className={`reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
            <div className="relative mx-auto max-w-sm py-2">
              {/* Soft brand pools so the column reads warm rather than bare. */}
              <div className="absolute -inset-10 pointer-events-none" aria-hidden="true">
                <div className="absolute -left-6 top-[6%] h-44 w-44 rounded-full bg-teal-300/25 blur-3xl" />
                <div className="absolute -right-4 bottom-[4%] h-48 w-48 rounded-full bg-purple-300/25 blur-3xl" />
              </div>

              {/* Teal-to-plum rule, the same device the Quality pages use.
                  Inset by half the marker so it runs through their centres. */}
              <div
                aria-hidden="true"
                className="absolute left-[1.375rem] top-5 bottom-5 w-px bg-gradient-to-b from-primary-dark to-purple-600"
              />

              <dl className="relative space-y-10">
                {stats.map((stat, i) => {
                  const plum = i % 2 !== 0;
                  return (
                    <div
                      key={stat.label}
                      className={`flex items-center gap-6 pop-item ${inView ? "in-view" : ""}`}
                      style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
                    >
                      <span
                        className={`relative z-10 grid shrink-0 place-items-center w-11 h-11 rounded-full bg-white ring-2 ${
                          plum ? "ring-purple-600" : "ring-primary-dark"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${plum ? "bg-purple-600" : "bg-primary-dark"}`}
                        />
                      </span>
                      {/* Reversed so the value reads first while `dt` still precedes `dd`. */}
                      <div className="flex flex-col-reverse">
                        <dt className="mt-2 font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-muted">
                          {stat.label}
                        </dt>
                        <dd
                          className={`text-4xl lg:text-5xl font-bold leading-none ${
                            plum ? "text-purple-600" : "text-primary-dark"
                          }`}
                        >
                          {stat.value}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
