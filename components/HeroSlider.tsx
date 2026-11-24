"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";
import { emOnly } from "@/lib/text";
import { Tr } from "./Lang";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const hovering = useRef(false);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!hovering.current) setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;
  const s = slides[index % slides.length];

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div className="wrap">
        <div className="slide" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
          <div>
            {s.tag && <span className="tag">{s.tag}</span>}
            <h1 dangerouslySetInnerHTML={{ __html: emOnly(s.title) }} />
            {s.text && <p>{s.text}</p>}
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              {s.cta && (
                <Link className="btn btn-primary" href={s.ctaLink || "/exhibitions"}>
                  {s.cta}
                </Link>
              )}
              <Link className="btn btn-outline" href="/visit">
                <Tr en="Plan a visit" tp="Kam lukim" />
              </Link>
            </div>
          </div>
          {s.imageUrl ? (
            <div className="art photo">
              <img src={s.imageUrl} alt={s.imageAlt ?? ""} />
            </div>
          ) : (
            <div className="art">
              <img src="/images/png-emblem.webp" alt="" />
            </div>
          )}
        </div>
        {slides.length > 1 && (
          <div className="dots">
            {slides.map((sl, i) => (
              <button
                key={sl.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index % slides.length}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
