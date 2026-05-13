"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { TeamMember, BoardMember } from "@/data/team";

interface TeamModalProps {
  member: TeamMember | BoardMember | null;
  onClose: () => void;
}

export function TeamModal({ member, onClose }: TeamModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (member) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [member]);

  if (!member) return null;

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-4 w-[90vw] max-w-md m-auto"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={`Bio for ${member.name}`}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-dark to-primary p-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-white/20">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={96}
                height={96}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {member.initials}
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-accent text-sm mt-1">{member.role}</p>
        </div>

        {/* Bio */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {member.bio ? (
            <div className="space-y-4 mb-6">
              {member.bio.split("\n\n").map((para, i) => (
                <p key={i} className="text-foreground leading-relaxed">{para}</p>
              ))}
            </div>
          ) : (
            <p className="text-muted italic mb-6">Bio coming soon.</p>
          )}
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors focus-ring"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
