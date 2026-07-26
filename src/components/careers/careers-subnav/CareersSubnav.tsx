"use client";

import { usePathname } from "next/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { useMediaQuery, NAV_BREAKPOINT_QUERY } from "@/hooks/use-media-query";

const links = [
  { label: "Overview", href: "/careers" },
  { label: "Open Roles", href: "/careers/open-roles" },
  { label: "Why Work With Us", href: "/careers/why-us" },
  { label: "Benefits", href: "/careers/benefits" },
  { label: "Training", href: "/careers/training" },
  { label: "How We Hire", href: "/careers/how-we-hire" },
  { label: "Contact", href: "/careers/contact" },
];

export function CareersSubnav() {
  const pathname = usePathname() ?? "";
  const scrolled = useScrolled();
  // The subnav duplicates links already in the main navbar's mobile
  // "Careers" submenu, so it only exists at the desktop (nav) breakpoint
  // where the main navbar shows its full inline layout instead of the
  // hamburger menu.
  const isDesktop = useMediaQuery(NAV_BREAKPOINT_QUERY);

  if (!isDesktop || scrolled) return null;

  return (
    <nav
      aria-label="Careers sections"
      className="fixed left-0 right-0 top-[6.5rem] z-30 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
          {links.map(({ label, href }) => {
            const isActive =
              href === "/careers"
                ? pathname === "/careers"
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
