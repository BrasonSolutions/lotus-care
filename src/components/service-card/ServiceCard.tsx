"use client";

import type { Service } from "@/data/services";

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  heart: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  users: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  target: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  globe: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
};

/* SVG illustrations for image-style cards */
const illustrations: Record<string, React.ReactNode> = {
  home: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="200" fill="#0d6a70" />
      <circle cx="320" cy="60" r="80" fill="#1badb2" opacity="0.2" />
      <circle cx="80" cy="160" r="60" fill="#54c7d6" opacity="0.15" />
      <g transform="translate(160, 40)">
        <path d="M40 10L70 40V90H10V40L40 10Z" fill="white" opacity="0.15" />
        <rect x="25" y="55" width="15" height="25" rx="2" fill="white" opacity="0.2" />
        <rect x="48" y="45" width="12" height="12" rx="1" fill="white" opacity="0.2" />
        <path d="M40 10L70 40H10L40 10Z" fill="white" opacity="0.1" />
      </g>
      <path d="M0 180 Q100 140 200 170 Q300 200 400 160 V200 H0Z" fill="white" opacity="0.05" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="200" fill="#0d6a70" />
      <circle cx="100" cy="40" r="90" fill="#1badb2" opacity="0.15" />
      <circle cx="340" cy="140" r="70" fill="#54c7d6" opacity="0.1" />
      <g transform="translate(155, 45)">
        <path d="M45 25C45 10 30 0 22.5 0C15 0 0 10 0 25C0 55 45 80 45 80C45 80 90 55 90 25C90 10 75 0 67.5 0C60 0 45 10 45 25Z" fill="white" opacity="0.15" />
      </g>
      <circle cx="200" cy="150" r="3" fill="white" opacity="0.3" />
      <circle cx="180" cy="160" r="2" fill="white" opacity="0.2" />
      <circle cx="220" cy="155" r="2.5" fill="white" opacity="0.25" />
      <path d="M0 170 Q100 150 200 165 Q300 180 400 155 V200 H0Z" fill="white" opacity="0.05" />
    </svg>
  ),
};

interface ServiceCardProps {
  service: Service;
  index: number;
  inView: boolean;
}

export function ServiceCard({ service, index, inView }: ServiceCardProps) {
  const isImageCard = service.hasImage;
  const delayClass = `reveal-delay-${index + 1}`;

  if (isImageCard) {
    return (
      <div
        className={`card-hover reveal ${delayClass} ${inView ? "in-view" : ""} group relative rounded-2xl overflow-hidden min-h-[240px] sm:min-h-[280px] flex items-end`}
      >
        {/* SVG illustration background */}
        <div className="absolute inset-0">
          {illustrations[service.icon]}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent" />
        <div className="relative z-10 p-6">
          <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-hover reveal ${delayClass} ${inView ? "in-view" : ""} bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-colors`}
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icons[service.icon]}
      </div>
      <h3 className="text-lg font-bold text-primary-dark mb-3">
        {service.title}
      </h3>
      <p className="text-muted text-sm leading-relaxed">{service.description}</p>
    </div>
  );
}
