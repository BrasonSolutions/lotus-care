"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { boardMembers, type BoardMember } from "@/data/team";
import { SectionTitle } from "@/components/section-title";
import { TeamModal } from "@/components/team-modal";

export function BoardSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Board"
          subtitle="Experienced leaders guiding Lotus Care's strategic direction and governance."
          light
        />

        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""} grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto`}
        >
          {boardMembers.map((member, i) => (
            <button
              key={member.name}
              onClick={() => setSelectedMember(member)}
              className={`card-hover reveal-delay-${i + 1} bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center group border border-white/10 hover:border-accent/30 transition-colors focus-ring-white`}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform">
                {member.initials}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-accent mt-1">{member.role}</p>
            </button>
          ))}
        </div>
      </div>

      <TeamModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
