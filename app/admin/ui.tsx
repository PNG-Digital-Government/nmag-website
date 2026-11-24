"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/types";
import { useSettings } from "./settings";

export function Panel({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {intro && <p className="panel-intro">{intro}</p>}
      {children}
    </section>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
  required,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "tel" | "datetime-local" | "url";
  hint?: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "wide" : undefined}>
      {label}
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Area({ label, value, onChange, hint, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; hint?: string; rows?: number }) {
  return (
    <label className="wide">
      {label}
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

/** Swaps item i with its neighbour (d = -1 up, +1 down). */
export function move<T>(arr: readonly T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return [...arr];
  const out = [...arr];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

export function OrderButtons({ i, count, onMove, name }: { i: number; count: number; onMove: (d: -1 | 1) => void; name: string }) {
  return (
    <>
      <button type="button" className="icon-btn" disabled={i === 0} onClick={() => onMove(-1)} aria-label={`Move ${name} up`}>
        ↑
      </button>
      <button type="button" className="icon-btn" disabled={i === count - 1} onClick={() => onMove(1)} aria-label={`Move ${name} down`}>
        ↓
      </button>
    </>
  );
}

/**
 * A settings form with its own unsaved copy. Nothing reaches the website
 * until staff press Save; Discard puts the last saved values back.
 */
export function SettingsForm<K extends keyof SiteSettings>({
  keys,
  children,
  confirm,
}: {
  keys: K[];
  children: (draft: Pick<SiteSettings, K>, set: <F extends K>(key: F, value: SiteSettings[F]) => void) => ReactNode;
  /** Optional question to confirm before saving (return null to skip). */
  confirm?: (draft: Pick<SiteSettings, K>, saved: Pick<SiteSettings, K>) => string | null;
}) {
  const { settings, save, setDirty } = useSettings();
  const keyList = keys.join(",");
  const saved = useMemo(() => {
    const o = {} as Pick<SiteSettings, K>;
    for (const k of keys) o[k] = settings[k];
    return o;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, keyList]);

  const [draft, setDraft] = useState(saved);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDraft(saved), [saved]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => {
    setDirty(dirty);
  }, [dirty, setDirty]);
  useEffect(() => () => setDirty(false), [setDirty]);

  const set = <F extends K>(key: F, value: SiteSettings[F]) => setDraft((d) => ({ ...d, [key]: value }) as Pick<SiteSettings, K>);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const question = confirm?.(draft, saved);
    if (question && !window.confirm(question)) return;
    setBusy(true);
    setError(null);
    try {
      await save(draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The change couldn't be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      {children(draft, set)}
      <div className={`savebar${dirty ? " on" : ""}`} role="region" aria-label="Save changes">
        <span>{error ? <b className="form-error">{error}</b> : dirty ? "You have unsaved changes." : "All changes saved."}</span>
        <button type="button" className="btn btn-outline btn-sm" disabled={!dirty || busy} onClick={() => setDraft(saved)}>
          Discard
        </button>
        <button className="btn btn-primary btn-sm" disabled={!dirty || busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
