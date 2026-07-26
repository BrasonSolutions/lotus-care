import Image from "next/image";

interface TeamStripMember {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

interface TeamStripProps {
  heading: string;
  intro?: string;
  members: TeamStripMember[];
}

export function TeamStrip({ heading, intro, members }: TeamStripProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4">{heading}</h2>
      {intro && <p className="text-muted leading-relaxed mb-6">{intro}</p>}
      <div className="flex flex-wrap gap-6">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center text-white text-sm font-bold">
                  {member.initials}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-primary-dark text-sm">{member.name}</p>
              <p className="text-xs text-muted">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
