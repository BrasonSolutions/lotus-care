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
    <section id="about" className="relative overflow-hidden py-20 lg:py-28 bg-white">
      {/* overflow-hidden: the stat pools sit on a negative inset and would
          otherwise widen the page on small viewports (#87). */}
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
              <div className="absolute -inset-20 pointer-events-none" aria-hidden="true">
                <div className="absolute -left-[4%] top-[6%] h-48 w-48 rounded-full bg-teal-300/30 blur-3xl" />
                <div className="absolute left-[40%] -top-[8%] h-28 w-28 rounded-full bg-purple-300/30 blur-2xl" />
                <div className="absolute -right-[4%] top-[16%] h-44 w-44 rounded-full bg-teal-200/30 blur-3xl" />
                <div className="absolute left-[36%] top-[42%] h-28 w-28 rounded-full bg-teal-400/30 blur-3xl" />
                <div className="absolute -right-[6%] bottom-[30%] h-36 w-36 rounded-full bg-purple-300/30 blur-3xl" />
                <div className="absolute -left-[6%] -bottom-[4%] h-52 w-52 rounded-full bg-teal-400/30 blur-3xl" />
                <div className="absolute right-[2%] -bottom-[8%] h-40 w-40 rounded-full bg-purple-200/30 blur-3xl" />
              </div>
              {/* Dashed orbit path, turning slowly the same way as the values.
                  An SVG circle rather than border-dashed: CSS gives no control
                  over dash length or gap. pathLength="100" normalises the
                  circumference, so "2.5 1.5" is exactly 25 dashes with no ragged
                  seam where the stroke closes.
                  A full turn ends where it started, so the global
                  prefers-reduced-motion rule snapping it to the end frame
                  leaves it looking untouched — no extra guard needed. */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-6 animate-[spin_45s_linear_infinite]"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  pathLength="100"
                  strokeDasharray="2.5 1.5"
                  strokeWidth="0.7"
                  className="stroke-teal-400/40"
                />
              </svg>
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
