import { getCareersIcon } from "@/components/careers/careers-icons";

interface HubNavCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export function HubNavCard({
  icon,
  title,
  description,
  href,
}: HubNavCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus-ring"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {getCareersIcon(icon)}
      </div>
      <h3 className="text-lg font-semibold text-primary-dark mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed flex-1">{description}</p>
      <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
        Learn more
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}
