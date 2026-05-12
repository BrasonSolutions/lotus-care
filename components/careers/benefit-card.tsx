import type { Benefit } from "@/data/careers";

interface BenefitCardProps {
  benefit: Benefit;
}

export default function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-3xl shrink-0 mt-0.5" aria-hidden="true">
        {benefit.icon}
      </span>
      <div>
        <h3 className="font-semibold text-primary-dark mb-1">{benefit.title}</h3>
        <p className="text-sm text-foreground leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
