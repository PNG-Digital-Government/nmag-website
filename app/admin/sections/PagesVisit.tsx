"use client";

import { Field, Panel, SettingsForm } from "../ui";
import { PairRows } from "./PairRows";

export function PagesVisitSection() {
  return (
    <SettingsForm keys={["visit"]}>
      {(d, set) => (
        <>
          <Panel title="Visit information" intro="Shown on Plan a Visit, the homepage, the footer, the help chat and the maintenance screen.">
            <div className="fields">
              <Field label="Address" wide value={d.visit.address} onChange={(v) => set("visit", { ...d.visit, address: v })} />
              <Field label="Phone" type="tel" value={d.visit.phone} onChange={(v) => set("visit", { ...d.visit, phone: v })} />
              <Field label="Email" type="email" value={d.visit.email} onChange={(v) => set("visit", { ...d.visit, email: v })} />
            </div>
          </Panel>
          <Panel title="Opening hours" intro="The first row is shown as “Galleries open” on the maintenance screen.">
            <PairRows rows={d.visit.hours} labels={["Days", "Hours"]} addLabel="Add hours row" onChange={(hours) => set("visit", { ...d.visit, hours })} />
          </Panel>
          <Panel title="Entry fees">
            <PairRows rows={d.visit.fees} labels={["Visitor type", "Fee"]} addLabel="Add fee row" onChange={(fees) => set("visit", { ...d.visit, fees })} />
          </Panel>
        </>
      )}
    </SettingsForm>
  );
}
