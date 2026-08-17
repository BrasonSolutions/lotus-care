import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HashScroll } from "@/components/hash-scroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <HashScroll />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
