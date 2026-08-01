"use client";

import { useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/use-in-view";
import type { BoardMember } from "@/data/team";
import { SectionTitle } from "@/components/section-title";
import { TeamModal } from "@/components/team-modal";
import { WideContainer } from "@/components/layout";

interface BoardSectionProps {
  title?: string;
  subtitle?: string;
  members: BoardMember[];
}

export function BoardSection({
  title = "Our Board",
  subtitle = "Experienced leaders guiding Lotus Care's strategic direction and governance.",
  members,
}: BoardSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-primary-dark">
      <WideContainer>
        <SectionTitle title={title} subtitle={subtitle} light />

        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""} grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto`}
        >
          {members.map((member, i) => (
            <button
              key={member.name}
              onClick={() => setSelectedMember(member)}
              className={`card-hover reveal-delay-${i + 1} bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center group border border-white/10 hover:border-accent/30 transition-colors focus-ring-white`}
            >
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-white/20 group-hover:scale-105 transition-transform">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-2xl font-bold">
                    {member.initials}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-accent mt-1">{member.role}</p>
            </button>
          ))}
        </div>
      </WideContainer>

      <TeamModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
