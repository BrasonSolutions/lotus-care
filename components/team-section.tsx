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
          className={`reveal ${inView ? "in-view" : ""} flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-8 justify-center`}
        >
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeDept === dept
                  ? "bg-primary text-white"
                  : "bg-white text-foreground hover:bg-primary/10 border border-gray-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((member) => (
            <TeamCard
              key={member.name}
              member={member}
              onClick={() => setSelectedMember(member)}
            />
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
