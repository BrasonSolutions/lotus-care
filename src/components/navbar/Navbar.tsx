"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navItems, contactInfo } from "@/data/navigation";
import { HomesDropdown } from "@/components/homes-dropdown";
import { MobileMenu } from "@/components/mobile-menu";
import { LogoWhite } from "@/components/logo-white";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
            : "top-0 lg:top-10 bg-transparent"
        } ${mounted ? "animate-slide-down" : "opacity-0"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center shrink-0 focus-ring rounded">
              {scrolled ? (
                <Image
                  src="/images/logo.png"
                  alt="Lotus Care — Enhanced Living"
                  width={180}
                  height={48}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <LogoWhite className="h-10 w-auto" />
              )}
            </a>

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
                href="#contact"
                className="bg-primary text-white px-5 py-2.5 rounded-full text-base font-semibold hover:bg-primary-dark transition-colors focus-ring"
              >
                Get in Touch
              </a>
            </div>

            {/* Mobile hamburger */}
            <MobileMenu scrolled={scrolled} />
          </div>
        </div>
      </nav>
    </>
  );
}
