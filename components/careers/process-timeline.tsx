import type { ProcessStep } from "@/data/careers";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="relative">
      {/* Connecting line — desktop only */}
      <div
        className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200"
        aria-hidden="true"
      />

      <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step) => (
          <li key={step.step} className="flex md:flex-col gap-4 md:gap-0 md:items-center md:text-center">
            {/* Step number bubble */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 shrink-0 rounded-full bg-primary text-white font-bold text-xl shadow-md">
              {step.step}
            </div>

            <div className="md:mt-4">
              <h3 className="font-semibold text-primary-dark mb-1">{step.title}</h3>
              <p className="text-sm text-foreground leading-relaxed">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
