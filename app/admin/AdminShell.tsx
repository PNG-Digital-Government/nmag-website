"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { ADMIN_SECTIONS, ROLE_NAMES, canOpen, type Role, type SectionId } from "@/lib/roles";
import { BackupSection } from "./sections/Backup";
import { ContentSection } from "./sections/Content";
import { FooterSection } from "./sections/Footer";
import { HeaderMenuSection } from "./sections/HeaderMenu";
import { HomepageSection } from "./sections/Homepage";
import { IdentitySection } from "./sections/Identity";
import { PagesVisitSection } from "./sections/PagesVisit";
import { SiteModeSection } from "./sections/SiteMode";
import { WidgetsSection } from "./sections/Widgets";
import { SettingsProvider, useSettings } from "./settings";
import { IDLE_MINUTES } from "./useIdleSignOut";

const SCREENS: Record<SectionId, ComponentType> = {
  homepage: HomepageSection,
  content: ContentSection,
  pages: PagesVisitSection,
  identity: IdentitySection,
  header: HeaderMenuSection,
  footer: FooterSection,
  widgets: WidgetsSection,
  mode: SiteModeSection,
  backup: BackupSection,
};

const LEAVE_MSG = "You have unsaved changes on this screen. Leave without saving?";

function firstAllowed(role: Role): SectionId {
  return ADMIN_SECTIONS.find((s) => s.roles.includes(role))!.id;
}

function sectionFromHash(role: Role): SectionId {
  const h = typeof window === "undefined" ? "" : window.location.hash.slice(1);
  return ADMIN_SECTIONS.some((s) => s.id === h) && canOpen(role, h as SectionId) ? (h as SectionId) : firstAllowed(role);
}

function Body({ email, signOut }: { email: string; signOut: () => void }) {
  const { role, load, reload, dirty, settings } = useSettings();
  const [active, setActive] = useState<SectionId>(() => firstAllowed(role));
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  useEffect(() => {
    setActive(sectionFromHash(role));
    const onHash = () => setActive(sectionFromHash(role));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [role]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const go = (id: SectionId) => {
    if (id === active) return;
    if (dirtyRef.current && !window.confirm(LEAVE_MSG)) return;
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  const doSignOut = () => {
    if (dirtyRef.current && !window.confirm(LEAVE_MSG)) return;
    signOut();
  };

  const allowed = ADMIN_SECTIONS.filter((s) => s.roles.includes(role));
  const current = ADMIN_SECTIONS.find((s) => s.id === active)!;
  const Screen = SCREENS[active];
  let group = "";

  return (
    <div className="admin">
      <aside>
        <div className="brand">
          <img src="/images/nmag-seal.webp" alt="" width={36} height={36} />
          <b>
            NMAG
            <br />
            <small>Admin Panel</small>
          </b>
        </div>
        <nav aria-label="Admin sections">
          {allowed.map((s) => {
            const heading = s.group !== group ? (group = s.group) : null;
            return (
              <div key={s.id}>
                {heading && <div className="grp">{heading}</div>}
                <button type="button" aria-current={s.id === active ? "page" : undefined} onClick={() => go(s.id)}>
                  {s.label}
                </button>
              </div>
            );
          })}
        </nav>
        <div className="who">
          <span title={email}>{email}</span>
          <small>{ROLE_NAMES[role]}</small>
        </div>
      </aside>

      <main>
        <div className="top">
          <div>
            <div className="eyebrow">Admin Panel</div>
            <h1>{current.label}</h1>
          </div>
          <div className="top-acts">
            {settings.siteMode.value !== "live" && (
              <span className="mode-pill" title="Visitors currently see a holding screen">
                Site mode: {settings.siteMode.value === "soon" ? "Coming Soon" : "Maintenance"}
              </span>
            )}
            <Link className="btn btn-outline btn-sm" href="/" target="_blank" rel="noopener">
              View site ↗
            </Link>
            <button className="btn btn-primary btn-sm" type="button" onClick={doSignOut}>
              Sign out
            </button>
          </div>
        </div>

        {load.status === "loading" && (
          <div className="panel" role="status">
            Loading settings…
          </div>
        )}
        {load.status === "error" && (
          <div className="panel">
            <p className="form-error">Couldn't load the settings: {load.message}</p>
            <button className="btn btn-primary btn-sm" type="button" onClick={reload}>
              Try again
            </button>
          </div>
        )}
        {load.status === "ready" && <Screen key={active} />}

        <p className="admin-note">For security you're signed out after {IDLE_MINUTES} minutes without activity.</p>
      </main>
    </div>
  );
}

export function AdminShell({ email, role, signOut }: { email: string; role: Role; signOut: () => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const toast = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 4000);
  }, []);

  return (
    <SettingsProvider role={role} toast={toast}>
      <Body email={email} signOut={signOut} />
      <div className="toast" role="status" aria-live="polite">
        {msg}
      </div>
    </SettingsProvider>
  );
}
