"use client";

import type { SiteSettings } from "@/lib/types";
import { Area, Field, Panel, SettingsForm } from "../ui";

type Mode = SiteSettings["siteMode"]["value"];

const MODES: [Mode, string, string][] = [
  ["live", "Live", "Everyone sees the website."],
  ["maintenance", "Maintenance", "Visitors see the “Closed for Rehanging” screen."],
  ["soon", "Coming Soon", "Visitors see the launch countdown."],
];

/** Launch times are entered and stored as Port Moresby time (UTC+10, no daylight saving). */
const PNG_OFFSET = "+10:00";
const toInput = (iso: string) => (iso ? iso.slice(0, 16) : "");
const fromInput = (local: string) => (local ? `${local}:00${PNG_OFFSET}` : "");

export function SiteModeSection() {
  return (
    <SettingsForm
      keys={["siteMode"]}
      confirm={(d, saved) => {
        const m = d.siteMode.value;
        if (m === saved.siteMode.value) return null;
        if (m === "maintenance") return "Switch the website to Maintenance? Visitors will only see the maintenance screen until you switch it back to Live.";
        if (m === "soon") return "Switch the website to Coming Soon? Visitors will only see the countdown screen until you switch it back to Live.";
        return null;
      }}
    >
      {(d, set) => {
        const m = d.siteMode;
        const upd = (patch: Partial<typeof m>) => set("siteMode", { ...m, ...patch });
        return (
          <>
            <Panel title="Site mode" intro="The Admin and staff sign-in keep working in every mode.">
              <div className="rows">
                {MODES.map(([value, label, desc]) => (
                  <div className="row" key={value}>
                    <input type="radio" name="mode" id={`m-${value}`} checked={m.value === value} onChange={() => upd({ value })} />
                    <label className="t" htmlFor={`m-${value}`}>
                      <b>{label}</b>
                      <br />
                      <small className="muted">{desc}</small>
                    </label>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Maintenance screen" intro="Gallery hours and phone come from Pages & Visit Info.">
              <div className="fields">
                <Field label="Heading" value={m.title} onChange={(v) => upd({ title: v })} />
                <Field label="Back online" hint="For example: Today, 2:00 pm" value={m.back} onChange={(v) => upd({ back: v })} />
                <Area label="Message" value={m.msg} onChange={(v) => upd({ msg: v })} />
                <Area label="Tok Pisin line" rows={2} value={m.tp} onChange={(v) => upd({ tp: v })} />
              </div>
            </Panel>

            <Panel title="Coming Soon screen">
              <div className="fields">
                <Field label="Heading" value={m.soonTitle} onChange={(v) => upd({ soonTitle: v })} />
                <Field
                  label="Launch date and time"
                  type="datetime-local"
                  hint="Port Moresby time. Leave empty to show “Date to be announced”."
                  value={toInput(m.launch)}
                  onChange={(v) => upd({ launch: fromInput(v) })}
                />
                <Area label="Message" value={m.soonMsg} onChange={(v) => upd({ soonMsg: v })} />
                <Area label="Tok Pisin line" rows={2} value={m.soonTp} onChange={(v) => upd({ soonTp: v })} />
              </div>
            </Panel>
          </>
        );
      }}
    </SettingsForm>
  );
}
