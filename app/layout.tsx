import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const site = getSiteUrl();
const title = "Umar Mirza";
const description =
  "Umar Mirza is a builder, designer, and creator. Web design, development, and growth for businesses and individuals.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  applicationName: "Umar Mirza",
  authors: [{ name: "Umar Mirza", url: site }],
  creator: "Umar Mirza",
  keywords: [
    "Umar Mirza",
    "designer",
    "developer",
    "Framer",
    "indie hacker",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: site,
    siteName: "Umar Mirza",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans">{children}</body>
    </html>
  );
}
