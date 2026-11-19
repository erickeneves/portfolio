/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { strings, type Lang, type Strings } from "../content/strings";

export type Theme = "dark" | "light";

interface Preferences {
  lang: Lang;
  theme: Theme;
  t: Strings;
  toggleLang: () => void;
  toggleTheme: () => void;
}

const PreferencesContext = createContext<Preferences | null>(null);

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* armazenamento indisponível (aba anônima, bloqueio): segue sem salvar */
  }
}

/**
 * Tema e idioma. Ficam no localStorage só quando a pessoa troca manualmente;
 * sem escolha salva, o tema segue o sistema operacional (ver script em index.html).
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (readStorage("pref-lang") === "en" ? "en" : "pt"));
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  // Layout effect: o tema muda no mesmo commit, a tempo da View Transition capturar o estado novo.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0c0c0d" : "#f2f0eb");
  }, [theme]);

  const toggleLang = useCallback(() => {
    const next: Lang = lang === "pt" ? "en" : "pt";
    writeStorage("pref-lang", next);
    setLang(next);
  }, [lang]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    writeStorage("pref-theme", next);
    setTheme(next);
  }, [theme]);

  const value = useMemo(
    () => ({ lang, theme, t: strings[lang], toggleLang, toggleTheme }),
    [lang, theme, toggleLang, toggleTheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePrefs precisa estar dentro de PreferencesProvider.");
  return ctx;
}
