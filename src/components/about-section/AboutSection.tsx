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

export function AboutSection({ title, subtitle, paragraphs, stats }: AboutSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
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

          {/* Stats orbit — values circle slowly and swell on the left (issue #87) */}
          <div className={`reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
            <div className="relative mx-auto w-64 h-64 lg:w-80 lg:h-80 [--orbit-r:6.5rem] lg:[--orbit-r:8.5rem] [--orbit-dur:36s]">
              <div
                className="stat-orbit-halo absolute inset-8 rounded-full blur-xl opacity-80 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-6 rounded-full border border-teal-400/30"
                aria-hidden="true"
              />
              <dl
                className="absolute inset-0"
                style={{ "--orbit-n": stats.length } as React.CSSProperties}
              >
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="stat-orbit text-center"
                    style={
                      {
                        "--i": i,
                        "--angle": `${(360 / stats.length) * i}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="stat-orbit-bloom">
                      <dd className="text-3xl font-bold text-primary-dark leading-none">
                        {stat.value}
                      </dd>
                      <dt className="text-xs text-foreground mt-1 leading-tight">
                        {stat.label}
                      </dt>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
