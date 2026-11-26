import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Racing_Sans_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const racingSansOne = Racing_Sans_One({
  weight: "400",
  variable: "--font-racing-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfterClass",
  description: "Discover activities and make plans together at McGill",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${racingSansOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
