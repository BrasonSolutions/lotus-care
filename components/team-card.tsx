"use client";

import type { TeamMember } from "@/data/team";

interface TeamCardProps {
  member: TeamMember;
  onClick: () => void;
}

export default function TeamCard({ member, onClick }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      className="card-hover bg-white rounded-2xl p-6 text-center group border border-gray-100 hover:border-primary/30 transition-colors w-full"
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-dark to-primary mx-auto mb-4 flex items-center justify-center text-white text-lg font-bold group-hover:scale-105 transition-transform">
        {member.initials}
      </div>
      <h3 className="text-base font-bold text-primary-dark group-hover:text-primary transition-colors">
        {member.name}
      </h3>
      <p className="text-sm text-muted mt-1">{member.role}</p>
    </button>
  );
}
