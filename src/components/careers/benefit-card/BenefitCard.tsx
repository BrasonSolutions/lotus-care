import type { Benefit } from "@/data/careers";
import { getCareersIcon } from "@/components/careers/careers-icons";

const ACCENT = {
  teal: { chip: "bg-primary/15 text-primary" },
  purple: { chip: "bg-purple-600/15 text-purple-600" },
} as const;

interface BenefitCardProps {
  benefit: Benefit;
  accent?: keyof typeof ACCENT;
}

export function BenefitCard({ benefit, accent = "teal" }: BenefitCardProps) {
  const a = ACCENT[accent];
  return (
    <div className="flex gap-4 p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${a.chip}`}>
        {getCareersIcon(benefit.icon)}
      </div>
      <div>
        <h3 className="font-semibold text-primary-dark mb-1">{benefit.title}</h3>
        <p className="text-sm text-foreground leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
