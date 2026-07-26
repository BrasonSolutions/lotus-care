"use client";

import { usePathname } from "next/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { useMediaQuery } from "@/hooks/use-media-query";

const links = [
  { label: "Overview", href: "/quality" },
  { label: "Human Rights", href: "/quality/human-rights" },
  { label: "MDT", href: "/quality/mdt" },
  { label: "Safety & Improvement", href: "/quality/safety-improvement" },
];

export function QualitySubnav() {
  const pathname = usePathname() ?? "";
  const scrolled = useScrolled();
  // The subnav duplicates links already in the main navbar's mobile
  // "Quality & Governance" submenu, so it only exists at the desktop (lg)
  // breakpoint where the main navbar shows its full inline layout instead
  // of the hamburger menu.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop || scrolled) return null;

  return (
    <nav
      aria-label="Quality & Governance sections"
      className="fixed left-0 right-0 top-[6.5rem] z-30 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
          {links.map(({ label, href }) => {
            const isActive =
              href === "/quality"
                ? pathname === "/quality"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-ring ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-foreground hover:text-primary hover:bg-warm-bg"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
