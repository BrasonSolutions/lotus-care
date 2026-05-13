"use client";

import Image from "next/image";
import type { TeamMember } from "@/data/team";

interface TeamCardProps {
  member: TeamMember;
  onClick: () => void;
}

export function TeamCard({ member, onClick }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`View bio for ${member.name}`}
      className="card-hover bg-white rounded-2xl p-6 text-center group border border-gray-100 hover:border-primary/30 transition-colors w-full focus-ring"
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden group-hover:scale-105 transition-transform">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            width={64}
            height={64}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center text-white text-xl font-bold">
            {member.initials}
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-primary-dark group-hover:text-primary transition-colors">
        {member.name}
      </h3>
      <p className="text-sm text-muted mt-1">{member.role}</p>
    </button>
  );
}
