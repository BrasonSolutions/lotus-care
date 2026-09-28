import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { HashScroll } from "@/components/hash-scroll";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Cloudflare Web Analytics; cookie-less. Token from dashboard > Web Analytics > Manage site.
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

const dmSans = DM_Sans({
  variable: "--font-dm-sans-loaded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lotus Care — Enhanced Living | Disability Care Services",
    template: "%s | Lotus Care",
  },
  description:
    "Lotus Care provides quality respite and residential disability care services, empowering individuals to live their best lives with dignity and support.",
  openGraph: { siteName: "Lotus Care", type: "website", locale: "en_IE" },
  twitter: { card: "summary_large_image" },
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
        {CF_BEACON_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
