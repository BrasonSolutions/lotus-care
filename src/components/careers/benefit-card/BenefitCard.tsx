import type { Benefit } from "@/data/careers";
import { getCareersIcon } from "@/components/careers/careers-icons";

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary">
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
