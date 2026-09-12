import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { HashScroll } from "@/components/hash-scroll";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans-loaded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lotus Care — Enhanced Living | Disability Care Services",
  description:
    "Lotus Care provides quality respite and residential disability care services, empowering individuals to live their best lives with dignity and support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `dmSans.variable` (defines --font-dm-sans-loaded) must live on <html>,
    // not <body>: globals.css's `:root { --font-sans: var(--font-dm-sans-loaded), ... }`
    // is declared on :root (this element), and a var() reference only sees
    // custom properties already in scope at its own declaration's element —
    // it doesn't "wait" for a descendant. With the variable on <body>
    // instead, --font-sans computed as invalid at :root and that invalid
    // value inherited everywhere, silently falling back to the browser
    // default sans-serif site-wide instead of DM Sans.
    <html lang="en" data-scroll-behavior="smooth" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <HashScroll />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        {/* Vercel Web Analytics. Cookieless and no cross-site identifiers, so
            it needs no consent banner — worth keeping that way on a care
            provider's site. Injects nothing outside production on Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
