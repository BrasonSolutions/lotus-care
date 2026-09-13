"use client";

import { useInView } from "@/hooks/use-in-view";

const STAGGER_MS = 90;

/* Same 4 icons ServiceCard already draws for the homepage's enhanceServices
   cards (Model of Care/MDT/Quality Safety Improvement) — reused verbatim so
   this grid reads as a deliberate callback to that card, not a new mark. */
const ICONS: Record<string, React.ReactNode> = {
  "shield-check": (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  "chart-bar": (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  globe: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
};

// Same two chip treatments as ServiceCard's icon-tile cards (10% tint,
// inverts to solid on hover) — the exact card this grid is echoing.
const ACCENT = {
  teal: "bg-primary/10 text-primary group-hover:bg-primary-dark group-hover:text-white",
  purple: "bg-purple-600/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
} as const;

export interface IconCardItem {
  icon: keyof typeof ICONS;
  heading: string;
  body: string;
}

interface IconCardsProps {
  items: IconCardItem[];
}

/** 2-column icon-card grid — the same card language as the homepage's own
   enhanceServices cards (icon tile, heading, body, no link), given its own
   staggered pop-in like every other card grid on this page. Reveal lives on
   the <li> wrapper, hover's lift/border transition lives on the inner card,
   so the per-item reveal delay never leaks into the hover transition (same
   split PrincipleTags/PrincipleCards use). */
export function IconCards({ items }: IconCardsProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      <ul className="grid sm:grid-cols-2 gap-6">
        {items.map((item, i) => {
          const accent = i % 2 === 0 ? ACCENT.teal : ACCENT.purple;
          return (
            <li
              key={item.heading}
              className={`pop-item ${inView ? "in-view" : ""}`}
              style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
            >
              <div className="group h-full card-hover bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-colors">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${accent}`}
                >
                  <span className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full">{ICONS[item.icon]}</span>
                </div>
                <h3 className="text-lg font-bold text-primary-dark mb-2">{item.heading}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
