import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Asta_Sans, Geist, Geist_Mono, Racing_Sans_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Title style (see globals.css)
const racingSansOne = Racing_Sans_One({
  weight: "400",
  variable: "--font-racing-sans",
  subsets: ["latin"],
});

// Heading, Heading 2/3, Body and Label styles: Regular, Medium, Bold, ExtraBold (see globals.css)
const astaSans = Asta_Sans({
  weight: ["400", "500", "700", "800"],
  variable: "--font-asta-sans",
  subsets: ["latin"],
  // Next.js has no size data for Asta Sans, so skip its auto-sized fallback
  // (avoids the "Failed to find font override values" warning) and use system fonts instead.
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "AfterClass",
  description: "Discover activities and make plans together at McGill",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${racingSansOne.variable} ${astaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
