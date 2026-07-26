"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/navigation";

const noopSubscribe = () => () => {};

interface MobileMenuProps {
  scrolled: boolean;
  navItems: NavItem[];
  contactInfo: { phone: string; email: string };
  ctaLabel?: string;
  ctaHref?: string;
}

export function MobileMenu({
  scrolled,
  navItems,
  contactInfo,
  ctaLabel = "Get in Touch",
  ctaHref = "#contact",
}: MobileMenuProps) {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  // Portal target (document.body) only exists on the client; this avoids
  // the SSR/client markup mismatch that `typeof document` checks trigger.
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const close = () => {
    setIsOpen(false);
    setExpandedItem(null);
  };

  const open = () => {
    // Pre-expand whichever section the current page belongs to, so a
    // careers-page visitor opening the menu sees the Careers submenu
    // already open instead of having to tap it again.
    const activeParent = navItems.find(
      (item) => item.children && item.href !== "/" && pathname.startsWith(item.href)
    );
    setExpandedItem(activeParent?.label ?? null);
    setIsOpen(true);
  };

  const toggleItem = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  // Portaled to document.body: the navbar's entrance animation applies a
  // transform to <nav>, which creates a new containing block for any
  // `position: fixed` descendants — breaking this drawer's fixed
  // positioning on small screens. Rendering outside <nav> avoids that.
  const drawer = (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={close}
          aria-hidden
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-primary-dark">Menu</span>
          <button
            onClick={close}
            className="p-2 text-muted hover:text-foreground focus-ring rounded"
            aria-label="Close menu"
          >
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
                  onClick={() => toggleItem(item.label)}
                  className="flex items-center justify-between w-full py-3 px-2 text-foreground font-medium hover:text-primary transition-colors focus-ring rounded"
                >
                  {item.label}
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedItem === item.label ? "rotate-180" : ""}`}
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
                    expandedItem === item.label ? "max-h-[60vh]" : "max-h-0"
                  }`}
                >
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={close}
                        className="block py-2.5 px-2 text-base text-muted hover:text-primary transition-colors focus-ring rounded"
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
                className="block py-3 px-2 text-foreground font-medium hover:text-primary transition-colors focus-ring rounded"
              >
                {item.label}
              </a>
            )
          )}

          <div className="border-t border-gray-100 mt-4 pt-4">
            <a
              href={ctaHref}
              onClick={close}
              className="block w-full text-center bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors focus-ring"
            >
              {ctaLabel}
            </a>
            <div className="mt-4 space-y-1 text-muted">
              <a
                href={`tel:${contactInfo.phone}`}
                className="block py-2 px-2 text-base hover:text-primary transition-colors focus-ring rounded"
              >
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block py-2 px-2 text-base hover:text-primary transition-colors focus-ring rounded"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );

  return (
    <div className="lg:hidden">
      {/* Hamburger button — p-3 gives ~50px tap area */}
      <button
        onClick={() => (isOpen ? close() : open())}
        className={`p-3 -mr-1 transition-colors focus-ring rounded ${
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

      {isClient && createPortal(drawer, document.body)}
    </div>
  );
}
