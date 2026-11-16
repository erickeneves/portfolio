import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Client } from "../content/clients";
import { usePrefs } from "../context/Preferences";

interface Props {
  clients: Client[];
  index: number | null;
  onChange: (index: number | null) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Painel lateral com os detalhes de uma loja. Navega entre lojas com as setas do teclado. */
export default function ClientDrawer({ clients, index, onChange }: Props) {
  const { t, lang } = usePrefs();
  const isOpen = index !== null;
  // Mantém o conteúdo na tela durante a animação de saída.
  const [shown, setShown] = useState<number | null>(index);
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = clients.length;

  useEffect(() => {
    if (index !== null) setShown(index);
  }, [index]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange((index + 1) % total);
      if (e.key === "ArrowLeft") onChange((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onChange]);

  const current = index ?? shown;
  const c = current !== null ? clients[current] : null;

  // Portal no body: o painel fica acima do cabeçalho, independente de onde é usado.
  return createPortal(
    <div className="drawer-root" data-open={isOpen || undefined} inert={!isOpen}>
      <div className="drawer-backdrop" onClick={() => onChange(null)} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        {c && current !== null && (
          <>
            <header className="flex items-center justify-between border-b border-line px-6 py-5 md:px-10">
              <span className="label">
                {pad(current + 1)} / {pad(total)}
              </span>
              <button ref={closeRef} type="button" onClick={() => onChange(null)} className="label hover:text-fg">
                {t.drawer.close} ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10">
              <div className="drawer-planet" style={{ "--c": c.color } as CSSProperties} aria-hidden="true">
                <span className="planet-core">
                  {c.ring && <span className="planet-ring" />}
                  <span className="planet-body" />
                  {c.ring && <span className="planet-ring planet-ring-front" />}
                </span>
              </div>

              <h2 id="drawer-title" className="mt-12 text-[clamp(2.4rem,6vw,3.75rem)] font-medium leading-none tracking-[-0.03em]">
                {c.name}
              </h2>
              <p className="mt-4 text-lg text-fg-2">{c.segment[lang]}</p>

              <dl className="mt-12 border-t border-line">
                <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-4">
                  <dt className="label pt-0.5">{t.drawer.segment}</dt>
                  <dd>{c.segment[lang]}</dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-4">
                  <dt className="label pt-0.5">{t.drawer.platform}</dt>
                  <dd>{c.platform}</dd>
                </div>
                {c.url && (
                  <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-4">
                    <dt className="label pt-0.5">{t.drawer.site}</dt>
                    <dd className="truncate">{c.url.replace(/^https?:\/\/(www\.)?/, "")}</dd>
                  </div>
                )}
              </dl>

              {c.scope && c.scope[lang].length > 0 && (
                <div className="mt-12">
                  <h3 className="label">{t.drawer.scope}</h3>
                  <ul className="mt-5 space-y-3">
                    {c.scope[lang].map((item) => (
                      <li key={item} className="flex gap-3 text-fg-2">
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.url && (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn mt-12">
                  {t.drawer.visit} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>

            <footer className="grid grid-cols-2 border-t border-line">
              <button
                type="button"
                onClick={() => onChange((current - 1 + total) % total)}
                className="label px-6 py-5 text-left hover:text-fg md:px-10"
              >
                ← {t.drawer.prev}
              </button>
              <button
                type="button"
                onClick={() => onChange((current + 1) % total)}
                className="label border-l border-line px-6 py-5 text-right hover:text-fg md:px-10"
              >
                {t.drawer.next} →
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
}
