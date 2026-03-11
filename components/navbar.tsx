"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navItems, contactInfo } from "@/data/navigation";
import HomesDropdown from "./homes-dropdown";
import MobileMenu from "./mobile-menu";
import LogoWhite from "./logo-white";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top contact strip — desktop only */}
      <div
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-0 opacity-0 overflow-hidden"
            : "h-10 bg-primary-dark text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-end gap-6 text-sm">
          <a href={`tel:${contactInfo.phone}`} className="hover:text-accent transition-colors">
            {contactInfo.phone}
          </a>
          <a href={`mailto:${contactInfo.email}`} className="hover:text-accent transition-colors">
            {contactInfo.email}
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-white shadow-md"
            : "top-0 lg:top-10 bg-white/0"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center shrink-0">
              {scrolled ? (
                <Image
                  src="/images/logo.png"
                  alt="Lotus Care — Enhanced Living"
                  width={180}
                  height={48}
                  className="h-10 lg:h-12 w-auto"
                  priority
                />
              ) : (
                <LogoWhite className="h-10 lg:h-12 w-auto" />
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
                    className={`text-sm font-medium transition-colors ${
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
                className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors"
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
