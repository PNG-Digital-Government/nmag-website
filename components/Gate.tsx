import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Countdown } from "./Countdown";

/** Maintenance / Coming Soon screen ("Closed for Rehanging"). */
export function Gate({ settings }: { settings: SiteSettings }) {
  const m = settings.siteMode;
  const soon = m.value === "soon";
  const galleriesOpen = settings.visit.hours[0]?.[1] ?? "";
  const tp = soon ? m.soonTp : m.tp;

  return (
    <div className="gate">
      <div className="ring">
        <img src="/images/nmag-seal.webp" alt={`${settings.identity.title} seal`} />
      </div>
      <div className="eb">{settings.identity.title}</div>
      <h1>{soon ? m.soonTitle : m.title}</h1>
      <p>{soon ? m.soonMsg : m.msg}</p>
      {tp && <p className="tp">{tp}</p>}
      <div className="rule" aria-hidden="true" />
      <div className="meta">
        {soon ? (
          m.launch ? (
            <Countdown launch={m.launch} />
          ) : (
            <div>
              <b>Launch</b>Date to be announced
            </div>
          )
        ) : (
          <div>
            <b>Back online</b>
            {m.back}
          </div>
        )}
        <div>
          <b>Galleries open</b>
          {galleriesOpen}
        </div>
        {!soon && (
          <div>
            <b>Phone</b>
            {settings.visit.phone}
          </div>
        )}
      </div>
      <div className="foot">
        <span>{settings.header.banner}</span>
        <Link href="/admin">Admin sign-in</Link>
      </div>
    </div>
  );
}
