"use client";

import { useInView } from "@/hooks/use-in-view";
import SectionTitle from "./section-title";

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="About Lotus Care"
          subtitle="Dedicated to enhancing the lives of people with disabilities since our founding."
        />

        <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-8">
          {/* Text content */}
          <div className={`reveal ${inView ? "in-view" : ""}`}>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Lotus Care is a registered NDIS provider committed to delivering
              exceptional residential and respite disability care across
              Victoria. Our network of eight purpose-designed homes provides
              warm, supportive environments where individuals are empowered to
              thrive.
            </p>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              We believe every person deserves to live a life of dignity,
              choice, and connection. Our dedicated team of professionals works
              alongside each participant to develop personalised support plans
              that reflect their unique goals, interests, and aspirations.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Through our person-centred approach, multi-disciplinary expertise,
              and genuine commitment to community integration, we create
              pathways for individuals to build meaningful relationships,
              develop new skills, and participate fully in community life.
            </p>
          </div>

          {/* Stats card */}
          <div className={`reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
            <div className="relative">
              <div className="bg-warm-bg rounded-2xl p-8 lg:p-12">
                <dl className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <dd className="text-4xl font-bold text-primary-dark mb-2">8</dd>
                    <dt className="text-sm text-foreground">Care Homes</dt>
                  </div>
                  <div className="text-center">
                    <dd className="text-4xl font-bold text-primary-dark mb-2">150+</dd>
                    <dt className="text-sm text-foreground">Staff Members</dt>
                  </div>
                  <div className="text-center">
                    <dd className="text-4xl font-bold text-primary-dark mb-2">200+</dd>
                    <dt className="text-sm text-foreground">Lives Supported</dt>
                  </div>
                  <div className="text-center">
                    <dd className="text-4xl font-bold text-primary-dark mb-2">24/7</dd>
                    <dt className="text-sm text-foreground">Care Available</dt>
                  </div>
                </dl>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
