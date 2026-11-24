"use client";

import { Field, OrderButtons, Panel, SettingsForm, move } from "../ui";

export function HeaderMenuSection() {
  return (
    <SettingsForm keys={["header"]}>
      {(d, set) => {
        const nav = d.header.nav;
        const setNav = (next: typeof nav) => set("header", { ...d.header, nav: next });
        return (
          <>
            <Panel title="Official banner">
              <div className="fields">
                <Field label="Banner text" wide value={d.header.banner} onChange={(v) => set("header", { ...d.header, banner: v })} />
              </div>
            </Panel>
            <Panel title="Menu" intro="Tick the pages to show in the menu. Each has an English and a Tok Pisin label.">
              <div className="rows">
                {nav.map((n, i) => (
                  <div className="row menu-row" key={n.id}>
                    <input
                      type="checkbox"
                      checked={n.on}
                      disabled={n.id === "home"}
                      aria-label={`Show ${n.label} in the menu`}
                      onChange={(e) => setNav(nav.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)))}
                    />
                    <input
                      className="t"
                      value={n.label}
                      aria-label={`English label for ${n.id}`}
                      onChange={(e) => setNav(nav.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                    />
                    <input
                      className="tp"
                      value={n.tp}
                      placeholder="Tok Pisin"
                      aria-label={`Tok Pisin label for ${n.id}`}
                      onChange={(e) => setNav(nav.map((x, j) => (j === i ? { ...x, tp: e.target.value } : x)))}
                    />
                    <OrderButtons i={i} count={nav.length} name={n.label} onMove={(dir) => setNav(move(nav, i, dir))} />
                  </div>
                ))}
              </div>
            </Panel>
          </>
        );
      }}
    </SettingsForm>
  );
}
