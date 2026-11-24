"use client";

import { generateClient } from "aws-amplify/data";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Schema } from "@/amplify/data/resource";
import type { Role } from "@/lib/roles";
import { SEED } from "@/lib/seed";
import type { SiteSettings } from "@/lib/types";
import { publishSite } from "./actions";

type Client = ReturnType<typeof generateClient<Schema>>;
let client: Client | null = null;
/** Signed-in staff talk to the data API with their Cognito sign-in. */
export function staffClient(): Client {
  client ??= generateClient<Schema>({ authMode: "userPool" });
  return client;
}

export type SettingsKey = keyof SiteSettings;
const KEYS: SettingsKey[] = ["identity", "header", "welcome", "keyFacts", "sections", "widgets", "siteMode", "visit", "footer", "chat"];

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value ?? undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

/** Saved settings merged over the sample defaults, the same way the public site does it. */
function merge(row: Record<string, unknown> | null | undefined): SiteSettings {
  const d = SEED.settings;
  if (!row) return d;
  const out: Record<string, unknown> = {};
  for (const k of KEYS) {
    const saved = parseJson(row[k]);
    const base = d[k];
    out[k] = saved == null ? base : Array.isArray(base) ? saved : { ...(base as object), ...(saved as object) };
  }
  return out as unknown as SiteSettings;
}

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready" };

interface SettingsCtx {
  load: LoadState;
  settings: SiteSettings;
  /** false until the first save creates the settings record */
  exists: boolean;
  role: Role;
  save: (changes: Partial<SiteSettings>) => Promise<void>;
  reload: () => void;
  setDirty: (dirty: boolean) => void;
  dirty: boolean;
  toast: (msg: string) => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function useSettings(): SettingsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be used inside SettingsProvider");
  return c;
}

function errorText(errors: readonly { message: string }[] | undefined): string {
  const msg = errors?.map((e) => e.message).join(" ") ?? "";
  if (/not authorized|unauthorized/i.test(msg)) return "Your role isn't allowed to make this change.";
  return msg || "The change couldn't be saved.";
}

export function SettingsProvider({ role, toast, children }: { role: Role; toast: (msg: string) => void; children: ReactNode }) {
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [settings, setSettings] = useState<SiteSettings>(SEED.settings);
  const [exists, setExists] = useState(false);
  const [dirty, setDirty] = useState(false);

  const reload = useCallback(() => {
    setLoad({ status: "loading" });
    staffClient()
      // Read with the public key: every role (Contributors included) can see
      // the settings, while saving still needs the right staff role.
      .models.SiteSettings.get({ key: "site" }, { authMode: "apiKey" })
      .then(({ data, errors }) => {
        if (errors?.length) throw new Error(errorText(errors));
        setSettings(merge(data as Record<string, unknown> | null));
        setExists(!!data);
        setLoad({ status: "ready" });
      })
      .catch((err: unknown) => setLoad({ status: "error", message: err instanceof Error ? err.message : "Could not load the settings." }));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(
    async (changes: Partial<SiteSettings>) => {
      const fields: Record<string, string> = {};
      for (const [k, v] of Object.entries(changes)) fields[k] = JSON.stringify(v);
      const models = staffClient().models.SiteSettings;

      let res;
      if (exists) {
        res = await models.update({ key: "site", ...fields });
      } else {
        if (role !== "ADMINISTRATOR") {
          throw new Error("The site settings haven't been set up yet. An Administrator needs to save any settings page once first.");
        }
        res = await models.create({ key: "site", ...fields });
      }
      if (res.errors?.length || !res.data) throw new Error(errorText(res.errors));

      setSettings(merge(res.data as Record<string, unknown>));
      setExists(true);
      const published = await publishSite().catch(() => ({ ok: false }));
      toast(published.ok ? "Saved. The website now shows the change." : "Saved. The website will show the change within 5 minutes.");
    },
    [exists, role, toast],
  );

  return <Ctx.Provider value={{ load, settings, exists, role, save, reload, setDirty, dirty, toast }}>{children}</Ctx.Provider>;
}
