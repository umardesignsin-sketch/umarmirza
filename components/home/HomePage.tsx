import type { ReactNode } from "react";
import Link from "next/link";
import { LocalTime } from "@/components/home/LocalTime";

const timeline: { year: string; text: ReactNode }[] = [
  {
    year: "2026",
    text: (
      <>
        Indie Hacker, founded{" "}
        <a
          href="https://framertonextjs.com"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-[#111]"
        >
          framertonextjs.com
        </a>{" "}
        and{" "}
        <a
          href="https://rankvyze.com"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-[#111]"
        >
          rankvyze.com
        </a>
      </>
    ),
  },
  {
    year: "2025",
    text: "Content Creation, web design/dev, became framer expert",
  },
  {
    year: "2024",
    text: "Meta ads for clients, 500K$ in combined revenue, web design/dev, Content Creation",
  },
  {
    year: "2023",
    text: "Meta Ads, web design/dev",
  },
  {
    year: "2023",
    text: "Ecom/Dropshipping, web design/dev",
  },
  {
    year: "2022",
    text: "Sold toilet cleaners in my hometown",
  },
  {
    year: "2021",
    text: "Data entry operator (MS Excel)",
  },
];

export function HomePage() {
  return (
    <main className="min-h-full bg-white">
      <div className="mx-auto max-w-[560px] px-6 pb-16 pt-24 sm:pt-28">
        <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-[#111]">
          Umar Mirza
        </h1>
        <p className="mt-1 text-[13px] text-[#b0b0b0]">Updated Aug 22, 2026</p>

        <div className="mt-8 space-y-5 text-[15px] leading-[1.7] text-[#1a1a1a]">
          <p>I&apos;m Umar Mirza, a builder, designer, and creator.</p>
          <p>
            I help businesses and individuals bring their ideas to life on the
            internet through web design, development, and growth.
          </p>
          <p>
            Over the years, I&apos;ve explored multiple paths — from doing a data
            entry job to running eCom brands, managing Meta Ads, creating
            content, and now building my{" "}
            <Link
              href="/waitlist"
              className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-[#111]"
            >
              own products
            </Link>
            .
          </p>
          <p>
            I&apos;m currently focused on building tools, content, and services
            that create freedom for me and value for others.
          </p>
          <p>
            You can find me on{" "}
            <a
              href="https://x.com/iumarmirza"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-[#111]"
            >
              X
            </a>{" "}
            and{" "}
            <a
              href="https://www.instagram.com/iumarmirza/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-[#111]"
            >
              Instagram
            </a>
            , or reach me via{" "}
            <a
              href="mailto:marketingwithumar1@gmail.com"
              className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-[#111]"
            >
              email
            </a>
            .
          </p>
        </div>

        <section className="mt-14">
          <h2 className="mb-3 text-[13px] text-[#b0b0b0]">Timeline</h2>
          <ul>
            {timeline.map((item, index) => (
              <li
                key={`${item.year}-${index}`}
                className="group grid grid-cols-[64px_1fr] gap-6 border-t border-[#ececec] py-[14px] text-[14px] leading-[1.55] transition-colors duration-200 last:border-b last:border-[#ececec] hover:border-[#ddd]"
              >
                <span className="text-[#b0b0b0] transition-colors duration-200 group-hover:text-[#888]">
                  {item.year}
                </span>
                <span className="text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#111]">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <LocalTime />
      </div>
    </main>
  );
}
