"use client";

import { useSyncExternalStore } from "react";

// Matches the `nav` breakpoint (--breakpoint-nav in globals.css) that
// Navbar/MobileMenu use to switch between hamburger and full inline layout.
export const NAV_BREAKPOINT_QUERY = "(min-width: 1440px)";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
