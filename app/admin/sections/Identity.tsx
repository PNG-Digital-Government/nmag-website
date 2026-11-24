"use client";

import { Field, Panel, SettingsForm } from "../ui";

export function IdentitySection() {
  return (
    <SettingsForm keys={["identity"]}>
      {(d, set) => (
        <>
          <Panel title="Brand">
            <div className="fields">
              <Field label="Site title" value={d.identity.title} onChange={(v) => set("identity", { ...d.identity, title: v })} />
              <Field label="Short name" value={d.identity.short} onChange={(v) => set("identity", { ...d.identity, short: v })} />
              <Field label="Tagline" wide value={d.identity.tagline} onChange={(v) => set("identity", { ...d.identity, tagline: v })} />
            </div>
          </Panel>
          <Panel title="Colour presets from the logo">
            <p className="soon-note">
              Coming next: the Night &amp; Ochre theme and the five saved presets (Crimson &amp; antique gold, Bright seal red &amp; gold, Bird of
              paradise, Deep earth, Kina green).
            </p>
          </Panel>
        </>
      )}
    </SettingsForm>
  );
}
