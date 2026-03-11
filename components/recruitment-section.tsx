"use client";

import { useInView } from "@/hooks/use-in-view";

export default function RecruitmentSection() {
  const { ref, inView } = useInView();

  return (
    <section id="careers" className="py-20 lg:py-28 bg-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""} max-w-3xl mx-auto text-center`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">
            Join Our Team
          </h2>
          <p className="text-lg text-foreground leading-relaxed mb-4">
            Are you passionate about making a real difference in people&apos;s
            lives? Lotus Care is always looking for compassionate, dedicated
            professionals to join our growing team.
          </p>
          <p className="text-muted mb-8">
            We offer competitive salaries, ongoing professional development,
            and the opportunity to be part of a supportive, values-driven
            organisation.
          </p>
          <a
            href="#contact"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            View Open Positions
          </a>
        </div>
      </div>
    </section>
  );
}
