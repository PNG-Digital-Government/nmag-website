"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ChatIcon } from "@/lib/types";

export interface ChatButton {
  label: string;
  icon: ChatIcon;
  answer: string;
  note?: string;
}

const ICONS: Record<ChatIcon, ReactNode> = {
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  ticket: (<><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" /><path d="M14 6v12" strokeDasharray="2 2" /></>),
  cap: (<><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>),
  pin: (<><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>),
  phone: (<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  camera: (<><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>),
};

/** Floating help chat and back-to-top button. */
export function HelpFab({
  chat,
  backToTop,
}: {
  chat: { title: string; greeting: string; buttons: ChatButton[] } | null;
  backToTop: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    answerRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const current = active !== null && chat ? chat.buttons[active] : null;

  return (
    <div className="fab">
      {chat && open && (
        <div className="chatbox" id="chatbox" role="dialog" aria-label={chat.title}>
          <header>{chat.title}</header>
          <div className="msgs" aria-live="polite">
            <div>{chat.greeting}</div>
            {current && (
              <div key={active} ref={answerRef} className="flash">
                <b>{current.answer}</b>
                {current.note && (
                  <>
                    <br />
                    <span>{current.note}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="q">
            {chat.buttons.map((b, i) => (
              <button
                key={i}
                type="button"
                className="chip"
                aria-pressed={active === i}
                onClick={() => setActive(active === i ? null : i)}
              >
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[b.icon] ?? ICONS.info}
                  </svg>
                </span>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {chat && (
        <button
          type="button"
          className="chat"
          aria-label={open ? "Close help chat" : "Open help chat"}
          aria-expanded={open}
          aria-controls="chatbox"
          onClick={() => setOpen((o) => !o)}
        >
          ?
        </button>
      )}
      {backToTop && (
        <button type="button" className="top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑
        </button>
      )}
    </div>
  );
}
