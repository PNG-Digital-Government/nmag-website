"use client";

import { Area, Field, Panel, SettingsForm } from "../ui";

export function FooterSection() {
  return (
    <SettingsForm keys={["footer"]}>
      {(d, set) => (
        <Panel title="Footer" intro="Address, phone and email in the footer come from Pages & Visit Info.">
          <div className="fields">
            <Area label="About text" value={d.footer.about} onChange={(v) => set("footer", { ...d.footer, about: v })} />
            <Field label="Copyright line" wide value={d.footer.copy} onChange={(v) => set("footer", { ...d.footer, copy: v })} />
          </div>
        </Panel>
      )}
    </SettingsForm>
  );
}
