"use client";

import { useEffect, useState } from "react";

export function Countdown({ launch }: { launch: string }) {
  const target = new Date(launch).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const left = now === null || Number.isNaN(target) ? 0 : Math.max(0, target - now);
  const parts: [string, number][] = [
    ["Days", Math.floor(left / 864e5)],
    ["Hours", Math.floor(left / 36e5) % 24],
    ["Minutes", Math.floor(left / 6e4) % 60],
  ];

  return (
    <>
      {parts.map(([label, value]) => (
        <div key={label}>
          <b>{label}</b>
          <span className="big">{now === null ? "--" : String(value).padStart(2, "0")}</span>
        </div>
      ))}
    </>
  );
}
