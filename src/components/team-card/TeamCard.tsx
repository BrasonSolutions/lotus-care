"use client";

import Image from "next/image";
import type { TeamMember } from "@/data/team";
import { LotusPhotoMask } from "@/components/lotus-mark";

interface TeamCardProps {
  member: TeamMember;
  onClick: () => void;
  accent?: "teal" | "purple";
}

const ACCENT = {
  teal: "bg-primary/15 text-primary",
  purple: "bg-purple-600/15 text-purple-600",
} as const;

export function TeamCard({ member, onClick, accent = "teal" }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`View bio for ${member.name}`}
      className="card-hover bg-white rounded-2xl p-6 sm:p-8 text-center group border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-md transition-colors w-full h-full focus-ring"
    >
      {/* Photo — lotus mask with a teal outline layer showing through the inset */}
      <div className="relative w-36 h-36 mx-auto mb-4 group-hover:scale-105 transition-transform">
        <div className="absolute inset-0">
          <LotusPhotoMask className="w-full h-full" aria-hidden="true">
            <div className="w-full h-full bg-primary" />
          </LotusPhotoMask>
        </div>
        <div className="absolute inset-[3px]">
          <LotusPhotoMask className="w-full h-full">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={144}
                height={144}
                sizes="144px"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center text-white text-3xl font-bold">
                {member.initials}
              </div>
            )}
          </LotusPhotoMask>
        </div>
      </div>

      <span
        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${ACCENT[accent]}`}
      >
        {member.department}
      </span>

      <h3 className="text-lg font-bold text-primary-dark group-hover:text-primary transition-colors">
        {member.name}
      </h3>
      <p className="text-sm text-muted mt-1">{member.role}</p>
    </button>
  );
}
