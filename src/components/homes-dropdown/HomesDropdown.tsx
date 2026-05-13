"use client";

import { useState } from "react";
import type { NavItem } from "@/data/navigation";

interface HomesDropdownProps {
  item: NavItem;
  scrolled: boolean;
}

export function HomesDropdown({ item, scrolled }: HomesDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`text-base font-medium transition-colors flex items-center gap-1 focus-ring rounded ${
          scrolled
            ? "text-foreground hover:text-primary"
            : "text-white hover:text-accent"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px]">
          {item.children?.map((child) => (
            <a
              key={child.label}
              href={child.href}
              className="block px-4 py-3 text-sm text-foreground hover:bg-warm-bg hover:text-primary transition-colors focus-ring"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </a>
          ))}
          {item.viewAllHref && (
            <div className="border-t border-gray-100 mt-1 pt-1">
              <a
                href={item.viewAllHref}
                className="block px-4 py-3 text-sm font-semibold text-primary hover:bg-warm-bg transition-colors focus-ring"
                onClick={() => setOpen(false)}
              >
                {item.viewAllLabel ?? "View All"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
