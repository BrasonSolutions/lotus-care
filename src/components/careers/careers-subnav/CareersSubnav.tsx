"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Careers sections"
      className={`fixed left-0 right-0 z-30 bg-white border-b border-gray-100 shadow-sm transition-all duration-300 ${
        scrolled ? "top-16" : "top-16 lg:top-[6.5rem]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
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
          {/* Scroll fade hint on mobile */}
          <div
            className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </nav>
  );
}
