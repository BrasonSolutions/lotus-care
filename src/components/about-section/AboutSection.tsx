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
              {/* Soft pools in the brand tones, scattered around the rotation
                  rather than laid out on a ring (issue #87). Hand-placed at
                  irregular positions and sizes so they read as drift, not as
                  a pattern. The saturated tones sit toward the middle; only
                  the pale ones reach the radius the values ride at, which is
                  what keeps the teal-700 text above WCAG AA. */}
              <div className="absolute -inset-16 pointer-events-none" aria-hidden="true">
                <div className="absolute left-[2%] top-[10%] h-40 w-40 rounded-full bg-teal-300/90 blur-3xl" />
                <div className="absolute left-[38%] -top-[4%] h-24 w-24 rounded-full bg-purple-300/70 blur-2xl" />
                <div className="absolute right-[2%] top-[22%] h-36 w-36 rounded-full bg-teal-200/95 blur-3xl" />
                <div className="absolute left-[34%] top-[40%] h-32 w-32 rounded-full bg-teal-500/60 blur-3xl" />
                <div className="absolute right-[20%] bottom-[26%] h-28 w-28 rounded-full bg-purple-400/45 blur-2xl" />
                <div className="absolute left-[8%] bottom-[4%] h-44 w-44 rounded-full bg-teal-400/75 blur-3xl" />
                <div className="absolute right-[4%] -bottom-[2%] h-32 w-32 rounded-full bg-purple-200/85 blur-3xl" />
              </div>
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
