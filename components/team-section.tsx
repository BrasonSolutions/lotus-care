"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import {
  departments,
  teamMembers,
  type Department,
  type TeamMember,
  type BoardMember,
} from "@/data/team";
import SectionTitle from "./section-title";
import TeamCard from "./team-card";
import TeamModal from "./team-modal";

export default function TeamSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [activeDept, setActiveDept] = useState<Department>("All");
  const [selectedMember, setSelectedMember] = useState<
    TeamMember | BoardMember | null
  >(null);

  const filtered =
    activeDept === "All"
      ? teamMembers
      : teamMembers.filter((m) => m.department === activeDept);

  return (
    <section id="team" className="py-20 lg:py-28 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Meet the Team"
          subtitle="Dedicated professionals committed to making a difference every day."
        />

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
        <div key={activeDept} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((member, i) => (
            <div key={member.name} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <TeamCard
                member={member}
                onClick={() => setSelectedMember(member)}
              />
            </div>
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
