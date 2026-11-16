import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { usePrefs } from "../context/Preferences";
import EEMark from "./EEMark";

function ThemeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const { t, lang, theme, toggleLang, toggleTheme } = usePrefs();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = [
    { to: "/trabalhos", label: t.nav.work },
    { to: "/sobre", label: t.nav.about },
    { to: "/contato", label: t.nav.contact },
  ];

  const langToggle = (
    <button type="button" onClick={toggleLang} className="nav-link" aria-label={t.nav.switchLang}>
      <span className={lang === "pt" ? "" : "opacity-45"}>PT</span>
      <span className="opacity-45"> / </span>
      <span className={lang === "en" ? "" : "opacity-45"}>EN</span>
    </button>
  );

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-[300]">
        <div className="page-wrap flex h-16 items-center justify-between lg:h-20">
          <Link to="/" className="flex items-center gap-3" aria-label={t.nav.homeAria}>
            <EEMark className="h-[13px] w-auto" />
            <span className="text-[15px] font-medium tracking-tight">Erick Neves</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label={t.nav.main}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
                {l.label}
              </NavLink>
            ))}
            <span className="h-4 w-px bg-current opacity-30" aria-hidden="true" />
            {langToggle}
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-8 w-8 place-items-center"
              aria-label={theme === "dark" ? t.nav.toLight : t.nav.toDark}
            >
              <ThemeIcon />
            </button>
          </nav>

          <button
            type="button"
            className="nav-link md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {t.nav.menu}
          </button>
        </div>
      </header>

      {/* Menu mobile fica fora do cabeçalho: a mistura por diferença não deve afetá-lo. */}
      <div
        id="mobile-menu"
        className="mobile-menu fixed inset-0 z-[350] flex flex-col bg-bg md:hidden"
        data-open={menuOpen || undefined}
        inert={!menuOpen}
      >
        <div className="page-wrap flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label={t.nav.homeAria}>
            <EEMark className="h-[13px] w-auto" />
            <span className="text-[15px] font-medium tracking-tight">Erick Neves</span>
          </Link>
          <button type="button" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t.nav.close}
          </button>
        </div>

        <nav className="page-wrap flex flex-1 flex-col justify-center gap-2" aria-label={t.nav.main}>
          {[{ to: "/", label: t.nav.home }, ...links].map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `flex items-baseline gap-4 py-2 text-5xl font-medium tracking-[-0.03em] ${isActive ? "text-fg" : "text-fg-2"}`
              }
            >
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="page-wrap flex items-center justify-between border-t border-line py-6">
          {langToggle}
          <button type="button" onClick={toggleTheme} className="nav-link flex items-center gap-2">
            <ThemeIcon /> {theme === "dark" ? t.nav.light : t.nav.dark}
          </button>
        </div>
      </div>
    </>
  );
}
