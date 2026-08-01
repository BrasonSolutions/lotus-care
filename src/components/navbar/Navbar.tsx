"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NavItem } from "@/data/navigation";
import { HomesDropdown } from "@/components/homes-dropdown";
import { MobileMenu } from "@/components/mobile-menu";
import { LogoWhite } from "@/components/logo-white";
import { LogoDark } from "@/components/logo-dark";
import { Container } from "@/components/layout";

interface NavbarProps {
  navItems: NavItem[];
  contactInfo: { phone: string; email: string };
  ctaLabel?: string;
  ctaHref?: string;
  solidWhenTop?: boolean;
}

export function Navbar({
  navItems,
  contactInfo,
  ctaLabel = "Get in Touch",
  ctaHref = "#contact",
  solidWhenTop = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top contact strip — desktop only, slides away on scroll */}
      <div
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden bg-primary-dark text-white ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <Container className="h-10 flex items-center justify-end gap-6 text-sm">
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
        </Container>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-white shadow-md"
            : `top-0 lg:top-10 ${solidWhenTop ? "bg-primary-dark" : "bg-transparent"}`
        } animate-slide-down`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Container>
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
            <div className="hidden lg:flex items-center gap-8">
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
        </Container>
      </nav>
    </>
  );
}
