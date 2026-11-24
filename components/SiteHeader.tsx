"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { routeFor } from "@/lib/text";
import { LangToggle, Tr, useLang } from "./Lang";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLang();
  const [showNotice, setShowNotice] = useState(true);
  const { identity, header, widgets } = settings;

  // Puts the "&" in the site title in white, as in the approved design.
  const [before, ...rest] = identity.title.split("&");
  const title = rest.length ? (
    <>
      {before}
      <em>&amp;</em>
      {rest.join("&")}
    </>
  ) : (
    identity.title
  );

  const isCurrent = (id: string) => {
    const r = routeFor(id);
    return r === "/" ? pathname === "/" : pathname === r || pathname.startsWith(r + "/");
  };

  return (
    <>
      <a className="skip" href="#main-content">
        Skip to content
      </a>
      <div className="official">
        <div className="wrap">
          <span>{header.banner}</span>
          <LangToggle />
        </div>
      </div>
      <header className="mast">
        <div className="wrap">
          <img className="emb" src="/images/png-emblem.webp" alt="National emblem of Papua New Guinea" />
          <div className="name">
            <small>Papua New Guinea</small>
            <strong>{title}</strong>
            <small style={{ textTransform: "none", letterSpacing: 0 }}>{identity.tagline}</small>
          </div>
          <form
            className="search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q")?.toString().trim();
              if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <input name="q" placeholder={lang === "tp" ? "Painim long sait" : "Search the site"} aria-label="Search" />
            <button type="submit">
              <Tr en="Search" tp="Painim" />
            </button>
          </form>
          <img className="seal" src="/images/nmag-seal.webp" alt={`${identity.title} logo`} />
        </div>
      </header>
      <nav className="main" aria-label="Main">
        <div className="wrap">
          {header.nav
            .filter((n) => n.on)
            .map((n) => (
              <Link key={n.id} href={routeFor(n.id)} aria-current={isCurrent(n.id) ? "page" : undefined}>
                <Tr en={n.label} tp={n.tp} />
              </Link>
            ))}
          <Link className="adm" href="/admin">
            Admin
          </Link>
        </div>
      </nav>
      {widgets.announce && widgets.announceText && showNotice && (
        <div className="announce">
          <div className="wrap">
            <b>
              <Tr en="Notice" tp="Notis" />
            </b>
            <span>{widgets.announceText}</span>
            <button type="button" aria-label="Dismiss notice" onClick={() => setShowNotice(false)}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
