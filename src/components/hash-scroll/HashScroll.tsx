"use client";

import { useEffect } from "react";

/**
 * Makes same-page anchor links work on every click, not just the first.
 *
 * `next/link` compares the target URL to the current one and skips the
 * navigation when they match. Once the address bar reads `/#contact`,
 * clicking "Have Your Say" again is a no-op — so a visitor who scrolled
 * away manually is stranded, because the URL still says `#contact` while
 * the viewport doesn't. Plain `<a href="#x">` never had this problem;
 * routing these links through `next/link` (e47eb0a) introduced it.
 *
 * Mounted once in the root layout and listening in the capture phase, so
 * it runs before Link's own handler and covers every anchor on the site,
 * including ones added later. Cross-page links (`/#about` from /careers)
 * are left entirely to Next.
 */
export function HashScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Let the browser handle modified clicks (new tab/window, download).
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") return;

      // `anchor.href` is already absolute, so this also filters out
      // mailto:/tel: links, which have no matching pathname.
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      const isSamePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname;
      // `href="#"` placeholders (footer Privacy/Terms) have no target.
      if (!isSamePage || url.hash.length <= 1) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      // A JS `behavior: "smooth"` overrides the CSS `scroll-behavior: auto`
      // that globals.css sets under prefers-reduced-motion, so the query has
      // to be re-checked here rather than left to the stylesheet.
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      // Match native fragment navigation: move focus to the target so
      // keyboard and screen-reader users land there too, not just the
      // viewport. Sections aren't focusable by default, hence tabindex.
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });

      // Keep the address bar in step without pushing a duplicate entry
      // when the hash is already current.
      if (window.location.hash !== url.hash) {
        window.history.pushState(null, "", url.hash);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
