"use client";

import { useState } from "react";
import { navItems, contactInfo } from "@/data/navigation";

interface MobileMenuProps {
  scrolled: boolean;
}

export default function MobileMenu({ scrolled }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [homesExpanded, setHomesExpanded] = useState(false);

  const close = () => {
    setIsOpen(false);
    setHomesExpanded(false);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 transition-colors ${
          scrolled ? "text-foreground" : "text-white"
        }`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Menu panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-primary-dark">Menu</span>
          <button onClick={close} className="p-2 text-muted hover:text-foreground" aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-65px)]" aria-label="Mobile navigation">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => setHomesExpanded((prev) => !prev)}
                  className="flex items-center justify-between w-full py-3 px-2 text-foreground font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                  <svg
                    className={`w-5 h-5 transition-transform ${homesExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    homesExpanded ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={close}
                        className="block py-2 px-2 text-sm text-muted hover:text-primary transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={close}
                className="block py-3 px-2 text-foreground font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            )
          )}

          <div className="border-t border-gray-100 mt-4 pt-4">
            <a
              href="#contact"
              onClick={close}
              className="block w-full text-center bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              Get in Touch
            </a>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <a href={`tel:${contactInfo.phone}`} className="block hover:text-primary transition-colors">
                {contactInfo.phone}
              </a>
              <a href={`mailto:${contactInfo.email}`} className="block hover:text-primary transition-colors">
                {contactInfo.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
