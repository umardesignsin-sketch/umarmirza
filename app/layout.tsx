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
  "I'm Umar Mirza, a builder, designer, and creator. I help businesses and individuals bring their ideas to life on the internet through web design, development, and growth.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  applicationName: "Umar Mirza",
  keywords: [
    "Umar Mirza",
    "designer",
    "developer",
    "Framer",
    "indie hacker",
  ],
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
