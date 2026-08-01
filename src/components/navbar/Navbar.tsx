"use client";

import Link from "next/link";
import type { NavItem } from "@/data/navigation";
import { navItems as defaultNavItems, contactInfo as defaultContactInfo } from "@/data/navigation";
import { HomesDropdown } from "@/components/homes-dropdown";
import { MobileMenu } from "@/components/mobile-menu";
import { LogoWhite } from "@/components/logo-white";
import { LogoDark } from "@/components/logo-dark";
import { useScrolled } from "@/hooks/use-scrolled";

interface NavbarProps {
  navItems?: NavItem[];
  contactInfo?: { phone: string; email: string };
  ctaLabel?: string;
  ctaHref?: string;
  solidWhenTop?: boolean;
}

export function Navbar({
  navItems = defaultNavItems,
  contactInfo = defaultContactInfo,
  ctaLabel = "Get in Touch",
  ctaHref = "#contact",
  solidWhenTop = false,
}: NavbarProps) {
  const scrolled = useScrolled();

  return (
    <>
      {/* Top contact strip — desktop only, slides away on scroll */}
      <div
        className={`hidden nav:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden bg-primary-dark text-white ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-end gap-6 text-sm">
          <a
            href={`tel:${contactInfo.phone}`}
            className="hover:text-accent transition-colors focus-ring rounded"
          >
            {contactInfo.phone}
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            className="hover:text-accent transition-colors focus-ring rounded"
          >
            {contactInfo.email}
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-white shadow-md"
            : `top-0 nav:top-10 ${solidWhenTop ? "bg-primary-dark" : "bg-transparent"}`
        } animate-slide-down`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 focus-ring rounded">
              {scrolled ? (
                <LogoDark className="h-10 w-auto" />
              ) : (
                <LogoWhite className="h-10 w-auto" />
              )}
            </Link>

            {/* Desktop nav */}
            <div className="hidden nav:flex items-center gap-8">
              {navItems.map((item) =>
                item.children ? (
                  <HomesDropdown key={item.label} item={item} scrolled={scrolled} />
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-base font-medium transition-colors focus-ring rounded ${
                      scrolled
                        ? "text-foreground hover:text-primary"
                        : "text-white hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              )}
              <a
                href={ctaHref}
                className="bg-primary text-white px-5 py-2.5 rounded-full text-base font-semibold hover:bg-primary-dark transition-colors focus-ring"
              >
                {ctaLabel}
              </a>
            </div>

            {/* Mobile hamburger */}
            <MobileMenu
              scrolled={scrolled}
              navItems={navItems}
              contactInfo={contactInfo}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
            />
          </div>
        </div>
      </nav>
    </>
  );
}
