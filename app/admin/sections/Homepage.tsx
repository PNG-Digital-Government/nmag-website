"use client";

import { Area, Field, OrderButtons, Panel, SettingsForm, move } from "../ui";

export function HomepageSection() {
  return (
    <SettingsForm keys={["keyFacts", "sections", "welcome"]}>
      {(d, set) => (
        <>
          <Panel title="Hero slides" intro="Slide text and pictures move to the Content screen in the next stage of the build.">
            <p className="soon-note">Coming next: edit, add and reorder hero slides, each with its own picture.</p>
          </Panel>

          <Panel title="Section order and visibility" intro="Choose which sections show on the homepage, and in what order.">
            <div className="rows">
              {d.sections.map((s, i) => (
                <div className="row" key={s.id}>
                  <input
                    type="checkbox"
                    id={`sec-${s.id}`}
                    checked={s.on}
                    onChange={(e) => set("sections", d.sections.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)))}
                  />
                  <label className="t" htmlFor={`sec-${s.id}`}>
                    {s.label}
                  </label>
                  <OrderButtons i={i} count={d.sections.length} name={s.label} onMove={(dir) => set("sections", move(d.sections, i, dir))} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Key facts" intro="The figures in the strip under the hero.">
            <div className="exed">
              {d.keyFacts.map((k, i) => (
                <div className="exitem" key={i}>
                  <div className="fields">
                    <Field label={`Figure ${i + 1}`} value={k.n} onChange={(v) => set("keyFacts", d.keyFacts.map((x, j) => (j === i ? { ...x, n: v } : x)))} />
                    <Field label="Label" value={k.l} onChange={(v) => set("keyFacts", d.keyFacts.map((x, j) => (j === i ? { ...x, l: v } : x)))} />
                  </div>
                  <div className="item-acts">
                    <OrderButtons i={i} count={d.keyFacts.length} name={`figure ${i + 1}`} onMove={(dir) => set("keyFacts", move(d.keyFacts, i, dir))} />
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => set("keyFacts", d.keyFacts.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {d.keyFacts.length < 6 && (
              <button type="button" className="btn btn-primary btn-sm add-btn" onClick={() => set("keyFacts", [...d.keyFacts, { n: "", l: "" }])}>
                Add key fact
              </button>
            )}
          </Panel>

          <Panel title="Director's welcome">
            <div className="fields">
              <Field label="Name" value={d.welcome.name} onChange={(v) => set("welcome", { ...d.welcome, name: v })} />
              <Field label="Role" value={d.welcome.role} onChange={(v) => set("welcome", { ...d.welcome, role: v })} />
              <Field
                label="Initials"
                hint="Shown in the oval when there's no portrait."
                value={d.welcome.initials}
                onChange={(v) => set("welcome", { ...d.welcome, initials: v.slice(0, 3) })}
              />
              <Area label="Message" rows={5} value={d.welcome.text} onChange={(v) => set("welcome", { ...d.welcome, text: v })} />
            </div>
            <p className="soon-note">Coming next: upload the Director's portrait.</p>
          </Panel>
        </>
      )}
    </SettingsForm>
  );
}
