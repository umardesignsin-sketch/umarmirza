"use client";

import { useEffect, useState } from "react";

function formatLocalTime(date: Date) {
  const formatted = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return formatted.replace(" ", "").replace("AM", "am").replace("PM", "pm");
}

function isDaytime(date: Date) {
  const hour = date.getHours();
  return hour >= 6 && hour < 19;
}

export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <p className="mt-14 text-[13px] text-[#b0b0b0]">
        Location, India
      </p>
    );
  }

  return (
    <p className="mt-14 flex items-center gap-2 text-[13px] text-[#b0b0b0]">
      <span>
        {formatLocalTime(now)} · Location, India
      </span>
      <span aria-hidden="true" className="text-[15px] leading-none">
        {isDaytime(now) ? "☼" : "☾"}
      </span>
    </p>
  );
}
