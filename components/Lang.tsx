"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "tp";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

const KEY = "nmag-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "tp" || saved === "en") setLangState(saved);
    } catch {
      /* storage unavailable: stay on English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "tp" ? "tpi" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Shows the English or Tok Pisin text, following the visitor's choice. */
export function Tr({ en, tp }: { en: string; tp?: string }) {
  const { lang } = useLang();
  return <>{lang === "tp" && tp ? tp : en}</>;
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <span style={{ display: "flex", gap: ".4rem" }}>
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
        English
      </button>
      <button type="button" aria-pressed={lang === "tp"} onClick={() => setLang("tp")}>
        Tok Pisin
      </button>
    </span>
  );
}
