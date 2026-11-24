"use client";

import { useEffect, useRef } from "react";

/** Signs staff out after this long with no mouse, keyboard or touch activity. */
export const IDLE_MINUTES = 30;

export function useIdleSignOut(signOut: () => void, minutes = IDLE_MINUTES) {
  const signOutRef = useRef(signOut);
  signOutRef.current = signOut;

  useEffect(() => {
    const limit = minutes * 60 * 1000;
    let last = Date.now();
    const bump = () => {
      last = Date.now();
    };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    // Checking on an interval (rather than one long timer) also catches a
    // laptop that went to sleep with the Admin open.
    const timer = window.setInterval(() => {
      if (Date.now() - last > limit) signOutRef.current();
    }, 30 * 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(timer);
    };
  }, [minutes]);
}
