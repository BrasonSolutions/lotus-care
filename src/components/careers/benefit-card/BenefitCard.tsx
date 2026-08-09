import type { Benefit } from "@/data/careers";
import { getCareersIcon } from "@/components/careers/careers-icons";
import { LotusMarkAlt } from "@/components/lotus-mark";

const ACCENT = {
  teal: { card: "bg-primary-dark", chip: "bg-teal-800" },
  purple: { card: "bg-purple-600", chip: "bg-purple-700" },
} as const;

interface BenefitCardProps {
  benefit: Benefit;
  accent?: keyof typeof ACCENT;
}

export function BenefitCard({ benefit, accent = "teal" }: BenefitCardProps) {
  const a = ACCENT[accent];
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white hover:shadow-lg transition-shadow ${a.card}`}
    >
      <LotusMarkAlt className="pointer-events-none absolute -right-10 sm:-right-14 top-0 h-full w-auto text-white opacity-[0.08]" />
      <div className="relative">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white ${a.chip}`}
        >
          {getCareersIcon(benefit.icon)}
        </div>
        <h3 className="mt-6 text-2xl sm:text-3xl font-bold text-white">{benefit.title}</h3>
        <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
