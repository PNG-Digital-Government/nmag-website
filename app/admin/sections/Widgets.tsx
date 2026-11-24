"use client";

import type { ChatIcon, ChatItem, SiteSettings } from "@/lib/types";
import { useSettings } from "../settings";
import { Area, Field, OrderButtons, Panel, SettingsForm, move } from "../ui";

const ICONS: [ChatIcon, string][] = [
  ["clock", "Clock"],
  ["ticket", "Ticket"],
  ["cap", "School cap"],
  ["pin", "Map pin"],
  ["phone", "Phone"],
  ["info", "Information"],
  ["camera", "Camera"],
];

const SOURCES: [ChatItem["src"], string][] = [
  ["text", "Text I type below"],
  ["hours", "Opening hours (Pages & Visit Info)"],
  ["fees", "Entry fees (Pages & Visit Info)"],
];

/** Same rule as the public help chat (lib/content.ts chatAnswer). */
function previewAnswer(item: ChatItem, visit: SiteSettings["visit"]): string {
  if (item.src === "hours") return visit.hours.map((h) => h.join(": ")).join(" · ");
  if (item.src === "fees") return visit.fees.map((f) => f.join(": ")).join(" · ");
  return item.answer;
}

const TOGGLES: [keyof Pick<SiteSettings["widgets"], "announce" | "backToTop" | "chat">, string][] = [
  ["announce", "Announcement bar"],
  ["backToTop", "Back-to-top button"],
  ["chat", "Help chat"],
];

export function WidgetsSection() {
  // Opening hours and fees for the preview come from the saved Pages & Visit Info.
  const { visit } = useSettings().settings;
  return (
    <SettingsForm keys={["widgets", "chat"]}>
      {(d, set) => {
        const items = d.chat.items;
        const setItems = (next: ChatItem[]) => set("chat", { ...d.chat, items: next });
        const setItem = (i: number, patch: Partial<ChatItem>) => setItems(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
        return (
          <>
            <Panel title="Widgets">
              <div className="rows">
                {TOGGLES.map(([k, label]) => (
                  <div className="row" key={k}>
                    <input type="checkbox" id={`w-${k}`} checked={d.widgets[k]} onChange={(e) => set("widgets", { ...d.widgets, [k]: e.target.checked })} />
                    <label className="t" htmlFor={`w-${k}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="fields" style={{ marginTop: "1rem" }}>
                <Area label="Announcement text" value={d.widgets.announceText} onChange={(v) => set("widgets", { ...d.widgets, announceText: v })} />
              </div>
            </Panel>

            <Panel
              title="Museum helper (help chat)"
              intro="Change the chat's title and greeting, and the quick-question buttons visitors can tap. Each button shows one answer; tapping it again hides it."
            >
              <div className="fields">
                <Field label="Chat title (top bar)" value={d.chat.title} onChange={(v) => set("chat", { ...d.chat, title: v })} />
                <Area label="Greeting message" value={d.chat.greeting} onChange={(v) => set("chat", { ...d.chat, greeting: v })} />
              </div>

              <h3 className="sub-h">Quick-question buttons</h3>
              <div className="exed">
                {items.map((q, i) => (
                  <div className="exitem" key={i}>
                    <div className="fields">
                      <Field label="Button text" value={q.label} onChange={(v) => setItem(i, { label: v })} />
                      <label>
                        Icon
                        <select value={q.icon} onChange={(e) => setItem(i, { icon: e.target.value as ChatIcon })}>
                          {ICONS.map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="wide">
                        Answer comes from
                        <select value={q.src} onChange={(e) => setItem(i, { src: e.target.value as ChatItem["src"] })}>
                          {SOURCES.map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </label>
                      {q.src === "text" && <Area label="Answer" value={q.answer} onChange={(v) => setItem(i, { answer: v })} />}
                      <Area label="Extra note shown under the answer (optional)" rows={2} value={q.note ?? ""} onChange={(v) => setItem(i, { note: v })} />
                      <div className="chat-pv wide">
                        <span>Visitors will see</span>
                        <b>{previewAnswer(q, visit) || "(no answer yet)"}</b>
                        {q.note && <small>{q.note}</small>}
                      </div>
                    </div>
                    <div className="item-acts">
                      <OrderButtons i={i} count={items.length} name={q.label || `button ${i + 1}`} onMove={(dir) => setItems(move(items, i, dir))} />
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                        Remove button
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm add-btn"
                onClick={() => setItems([...items, { label: "New question", icon: "info", src: "text", answer: "" }])}
              >
                Add question button
              </button>
            </Panel>
          </>
        );
      }}
    </SettingsForm>
  );
}
