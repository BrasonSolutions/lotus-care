import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { HashScroll } from "@/components/hash-scroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
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
