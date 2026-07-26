interface Spoke {
  label: string;
  description: string;
}

interface HubAndSpokeProps {
  core: { label: string; subtext?: string };
  spokes: Spoke[];
}

const RADIUS = 260;
const NODE_WIDTH = 176;

export function HubAndSpoke({ core, spokes }: HubAndSpokeProps) {
  const count = spokes.length;
  const size = RADIUS * 2 + NODE_WIDTH;

  return (
    <div>
      {/* Desktop: core + radiating spokes */}
      <div
        className="hidden lg:block relative mx-auto"
        style={{ width: size, height: size }}
      >
        {spokes.map((spoke, i) => {
          const angleDeg = (360 / count) * i - 90;
          return (
            <div
              key={`line-${spoke.label}`}
              className="absolute bg-primary/15"
              style={{
                left: "50%",
                top: "50%",
                width: RADIUS,
                height: 2,
                transformOrigin: "0 0",
                transform: `rotate(${angleDeg}deg)`,
              }}
              aria-hidden="true"
            />
          );
        })}

        <div className="absolute left-1/2 top-1/2 w-44 h-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-white flex flex-col items-center justify-center text-center p-4 shadow-md z-10">
          <p className="text-sm font-semibold leading-snug">{core.label}</p>
          {core.subtext && (
            <p className="text-xs text-white/80 mt-2 leading-snug">
              {core.subtext}
            </p>
          )}
        </div>

        {spokes.map((spoke, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);
          return (
            <div
              key={spoke.label}
              className="absolute text-center z-10"
              style={{
                width: NODE_WIDTH,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                <h3 className="text-sm font-semibold text-primary-dark mb-1">
                  {spoke.label}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {spoke.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/tablet: core banner + stacked list */}
      <div className="lg:hidden">
        <div className="text-center mb-6">
          <div className="inline-block bg-primary text-white rounded-2xl px-6 py-4">
            <p className="font-semibold">{core.label}</p>
            {core.subtext && (
              <p className="text-xs text-white/80 mt-1">{core.subtext}</p>
            )}
          </div>
        </div>
        <ul className="space-y-4">
          {spokes.map((spoke) => (
            <li
              key={spoke.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              <h3 className="text-sm font-semibold text-primary-dark mb-1">
                {spoke.label}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {spoke.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
