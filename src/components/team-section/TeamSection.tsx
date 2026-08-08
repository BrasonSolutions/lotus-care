"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import type { TeamMember, BoardMember } from "@/data/team";
import { SectionTitle } from "@/components/section-title";
import { TeamCard } from "@/components/team-card";
import { TeamModal } from "@/components/team-modal";
import { Blob } from "@/components/blob";
import { Container } from "@/components/layout";

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  departments: readonly string[];
}

export function TeamSection({
  title = "Meet the Team",
  subtitle = "Dedicated professionals committed to making a difference every day.",
  members,
  departments,
}: TeamSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [activeDept, setActiveDept] = useState<string>("All");
  const [selectedMember, setSelectedMember] = useState<
    TeamMember | BoardMember | null
  >(null);

  const filtered =
    activeDept === "All"
      ? members
      : members.filter((m) => m.department === activeDept);

  return (
    <section id="team" className="relative overflow-hidden py-24 lg:py-32 bg-warm-bg">
      <Blob color="teal" variant={1} className="absolute -top-10 -right-10 w-72 h-72" />
      <Blob color="purple" variant={3} className="absolute -bottom-16 -left-16 w-64 h-64" />
      <Container className="relative">
        <SectionTitle title={title} subtitle={subtitle} />

        {/* Department tabs */}
        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""} relative`}
        >
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-8 justify-start sm:justify-center">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-ring ${
                  activeDept === dept
                    ? "bg-primary text-white"
                    : "bg-white text-foreground hover:bg-primary/10 border border-gray-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          {/* Scroll hint fade on mobile */}
          <div className="sm:hidden absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-warm-bg to-transparent pointer-events-none" aria-hidden="true" />
        </div>

        {/* Team grid — key on activeDept triggers remount+animate on filter change */}
        <div key={activeDept} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((member, i) => (
            <div key={member.name} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <TeamCard
                member={member}
                onClick={() => setSelectedMember(member)}
                accent={i % 2 === 0 ? "teal" : "purple"}
              />
            </div>
          ))}
        </div>
      </Container>

      <TeamModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
