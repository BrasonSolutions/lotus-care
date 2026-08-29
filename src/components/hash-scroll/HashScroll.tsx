"use client";

import { useEffect } from "react";

// Makes same-page hash links re-navigate; next/link skips them if the URL already matches.
function shouldIgnoreClick(event: MouseEvent): boolean {
  // Let the browser handle modified clicks (new tab/window, download).
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function resolveAnchor(event: MouseEvent): HTMLAnchorElement | null {
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") return null;
  return anchor;
}

// `href="#"` placeholders (footer Privacy/Terms) have no target.
function resolveSamePageHashUrl(anchor: HTMLAnchorElement): URL | null {
  let url: URL;
  try {
    // `anchor.href` is absolute, so mailto:/tel: links also get filtered out here.
    url = new URL(anchor.href);
  } catch {
    return null;
  }

  const isSamePage =
    url.origin === window.location.origin && url.pathname === window.location.pathname;
  if (!isSamePage || url.hash.length <= 1) return null;
  return url;
}

function findHashTarget(url: URL): HTMLElement | null {
  const id = decodeURIComponent(url.hash.slice(1));
  return document.getElementById(id);
}

function scrollToHashTarget(target: HTMLElement, url: URL): void {
  // JS `smooth` overrides CSS reduced-motion, so we recheck the media query here.
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  // Match native fragment nav: focus the target for keyboard/screen-reader users too.
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });

  // Keep the URL in sync without pushing a duplicate history entry.
  if (window.location.hash !== url.hash) {
    window.history.pushState(null, "", url.hash);
  }
}

export function HashScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (shouldIgnoreClick(event)) return;

      const anchor = resolveAnchor(event);
      if (!anchor) return;

      const url = resolveSamePageHashUrl(anchor);
      if (!url) return;

      const target = findHashTarget(url);
      if (!target) return;

      event.preventDefault();
      scrollToHashTarget(target, url);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
