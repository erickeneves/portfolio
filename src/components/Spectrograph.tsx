import { useEffect, useRef, useState, type CSSProperties } from "react";
import { clients, type Client } from "../content/clients";
import { hydrogenLines, liquidLines, type SpectralLine } from "../content/spectrum";
import { usePrefs } from "../context/Preferences";
import { prefersReducedMotion } from "../lib/hooks";
import { nmPos, nmToRgb, spectrumGradient } from "../lib/spectrum";
import BrandLogo from "./BrandLogo";

type Kind = "emission" | "absorption";

interface BandProps {
  kind: Kind;
  lines: SpectralLine[];
  onOpen: (slug: string) => void;
}

const AUTOPLAY_MS = 6500;
const TICKS = [400, 450, 500, 550, 600, 650];
const bySlug = (slug: string) => clients.find((c) => c.slug === slug) as Client;

function SpectrumBand({ kind, lines, onOpen }: BandProps) {
  const { t, lang } = usePrefs();
  const copy = kind === "emission" ? t.home.spectrum.hydrogen : t.home.spectrum.liquid;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setLit(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Percorre as linhas sozinho até a pessoa escolher uma.
  useEffect(() => {
    if (!auto || !inView || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % lines.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [auto, inView, lines.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  const line = lines[active];
  const client = bySlug(line.slug);
  const color = nmToRgb(line.nm);
  const nm = line.nm.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: 1 });
  const scope = client.scope?.[lang] ?? [];

  return (
    <div ref={ref} className="spectrum" data-kind={kind} data-lit={lit || undefined}>
      <header className="grid gap-4 md:grid-cols-12 md:items-end md:gap-10">
        <div className="md:col-span-7">
          <p className="label">{copy.kicker}</p>
          <h3 className="mt-3 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-none tracking-[-0.03em]">{copy.title}</h3>
        </div>
        <p className="text-fg-2 md:col-span-5">{copy.text}</p>
      </header>

      <div className="mt-8">
        <div className="spectrum-band" style={kind === "absorption" ? { backgroundImage: spectrumGradient } : undefined}>
          {kind === "emission" && <span className="spectrum-faint" style={{ backgroundImage: spectrumGradient }} />}
          <span className="spectrum-scan" aria-hidden="true" />
          {lines.map((l, i) => (
            <button
              key={l.slug}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="spectrum-line"
              data-active={i === active || undefined}
              style={
                {
                  "--x": `${(nmPos(l.nm) * 100).toFixed(2)}%`,
                  "--lc": nmToRgb(l.nm),
                  "--s": l.strength ?? 1,
                  "--d": `${0.25 + i * 0.22}s`,
                } as CSSProperties
              }
              onClick={() => pick(i)}
            >
              <span className="spectrum-line-core" />
              <span className="spectrum-line-tag">{l.code}</span>
            </button>
          ))}
        </div>

        <div className="spectrum-scale" aria-hidden="true">
          {TICKS.map((tick) => (
            <span key={tick} style={{ left: `${(nmPos(tick) * 100).toFixed(2)}%` }}>
              {tick}
            </span>
          ))}
          <span className="spectrum-unit">nm</span>
        </div>
        <div className="spectrum-track" aria-hidden="true">
          {auto && inView && <span key={active} className="spectrum-progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {lines.map((l, i) => (
          <li key={l.slug}>
            <button
              type="button"
              aria-pressed={i === active}
              className="spectrum-chip"
              style={{ "--lc": nmToRgb(l.nm) } as CSSProperties}
              onClick={() => pick(i)}
            >
              <span className="spectrum-chip-code">{l.code}</span>
              {bySlug(l.slug).name}
            </button>
          </li>
        ))}
      </ul>

      <div
        key={line.slug}
        className="spectrum-readout mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-10"
        style={{ "--lc": color } as CSSProperties}
        aria-live="polite"
      >
        <div className="lg:col-span-5">
          <div className="flex items-end gap-4">
            <span className="spectrum-code">{line.code}</span>
            <span className="label pb-1">
              {nm} nm · {copy.line}
            </span>
          </div>
          <h4 className="mt-6 text-[clamp(2.1rem,4.2vw,3.4rem)] font-medium leading-none tracking-[-0.03em]">{client.name}</h4>
          <p className="mt-3 text-fg-2">
            {client.segment[lang]} · {t.stack[client.stack]}
          </p>
          {client.award && (
            <p className="award mt-4">
              <span aria-hidden="true">✦</span> {client.award[lang]}
            </p>
          )}
          <div className="mt-7 flex h-9 items-center">
            <BrandLogo client={client} className="h-full w-auto max-w-[9rem]" />
          </div>
        </div>

        <div className="lg:col-span-7">
          {scope.length > 0 && (
            <>
              <p className="label">{t.home.spectrum.highlights}</p>
              <ul className="mt-4 space-y-3">
                {scope.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-3 text-fg-2">
                    <span className="spectrum-bullet" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {line.results && (
            <div className="spectrum-result mt-7">
              <ul className="space-y-3">
                {line.results.map((r) => (
                  <li key={r.value}>
                    <span className="spectrum-result-value">
                      {r.value}
                      <span className="text-accent" aria-hidden="true">
                        *
                      </span>
                    </span>{" "}
                    <span className="text-fg-2">{r.label[lang]}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-fg-2">* {t.home.spectrum.note}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            {scope.length > 0 && (
              <button type="button" onClick={() => onOpen(client.slug)} className="ulink font-medium">
                {t.home.spectrum.details} <span aria-hidden="true">→</span>
              </button>
            )}
            {client.url && (
              <a href={client.url} target="_blank" rel="noopener noreferrer" className="label ulink hover:text-fg">
                {t.home.spectrum.visit} ↗
              </a>
            )}
            {line.source && (
              <a href={line.source} target="_blank" rel="noopener noreferrer" className="label ulink hover:text-fg">
                {t.home.spectrum.source} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lojas em destaque como linhas espectrais: Hydrogen em emissão, Liquid em absorção. */
export default function Spectrograph({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <div className="space-y-24 lg:space-y-32">
      <SpectrumBand kind="emission" lines={hydrogenLines} onOpen={onOpen} />
      <SpectrumBand kind="absorption" lines={liquidLines} onOpen={onOpen} />
    </div>
  );
}
