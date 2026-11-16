import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { clients } from "../content/clients";
import { site } from "../content/site";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle, useScrollProgress } from "../lib/hooks";
import { ORBITS, orbitGeometry } from "../lib/orbit";
import OrbitSystem from "../components/OrbitSystem";
import EEWindow from "../components/EEWindow";
import ClientDrawer from "../components/ClientDrawer";
import Reveal from "../components/Reveal";

/*
 * Roteiro da cena (progresso p do scroll, de 0 a 1):
 *   0.00 a 0.22  a janela "EE" se abre e revela o sistema solar
 *   0.20 a 0.47  título de apresentação
 *   0.44 a 0.54  sistema desliza para a direita e a lista de lojas aparece
 *   0.50 a 0.90  tour: cada trecho de scroll destaca uma loja
 *   0.88 a 1.00  sistema livre para explorar com clique
 */
const MASK_END = 0.22;
const TOUR_START = 0.5;
const TOUR_END = 0.9;

/** Janela de entrada (i0 a i1) e de saída (o0 a o1) de uma camada .sc */
const range = (i0: number, i1: number, o0 = 2, o1 = 3, rise = 40) =>
  ({ "--i0": i0, "--i1": i1, "--o0": o0, "--o1": o1, "--rise": `${rise}px` }) as CSSProperties;

const pad = (n: number) => String(n).padStart(2, "0");

interface TourState {
  on: boolean;
  active: number | null;
  done: boolean;
}

export default function Home() {
  const { t, lang } = usePrefs();
  useDocumentTitle(t.meta.home);
  const [open, setOpen] = useState<number | null>(null);
  const [tour, setTour] = useState<TourState>({ on: false, active: null, done: false });
  const n = clients.length;

  const { ref, progress } = useScrollProgress<HTMLElement>((p) => {
    const on = p >= 0.44;
    const done = p >= TOUR_END;
    const active =
      p >= TOUR_START && p < TOUR_END
        ? Math.min(n - 1, Math.floor(((p - TOUR_START) / (TOUR_END - TOUR_START)) * n))
        : null;
    setTour((prev) => (prev.on === on && prev.done === done && prev.active === active ? prev : { on, active, done }));
  });

  const activeIdx = tour.active;
  const systemRef = useRef<HTMLDivElement>(null);

  // No desktop, durante o tour o sistema vai para o espaço à direita da lista
  // e encolhe o necessário para a órbita externa caber nesse espaço.
  useLayoutEffect(() => {
    const el = systemRef.current;
    if (!el) return;
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 1024) {
        el.style.removeProperty("--shift-x");
        el.style.removeProperty("--shrink");
        return;
      }
      const panel = Math.min(448, vw * 0.4);
      const { R, planet } = orbitGeometry(vw, vh);
      const outer = R * ORBITS[ORBITS.length - 1] + planet;
      const room = (vw - panel) / 2 - 56;
      const scale = Math.min(0.92, room / outer);
      el.style.setProperty("--shift-x", `${panel / 2}px`);
      el.style.setProperty("--shrink", (1 - scale).toFixed(3));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <>
      <section ref={ref} className="scene" style={{ "--p": 0 } as CSSProperties} aria-label={t.orbit.title}>
        <div className="scene-sticky">
          {/* Sistema solar: está ali desde o início, visto pelos recortes do monograma */}
          <div ref={systemRef} className="scene-system absolute inset-0">
            <OrbitSystem
              clients={clients}
              active={activeIdx}
              spin={progress}
              labels={!tour.on}
              onSelect={setOpen}
            />
          </div>

          {/* Apresentação */}
          <div
            className="sc pointer-events-none absolute inset-0 z-[150] flex items-end pb-[16svh] lg:items-center lg:pb-0"
            style={range(0.2, 0.29, 0.4, 0.47)}
          >
            <div className="page-wrap">
              <p className="label">{t.intro.eyebrow}</p>
              <h1 className="mt-6 max-w-[12ch] text-[clamp(2.9rem,7.4vw,7rem)] font-medium leading-[0.94] tracking-[-0.04em]">
                {t.intro.headlineA}{" "}
                <span className="font-serif font-normal italic tracking-[-0.02em]">{t.intro.headlineB}</span>
              </h1>
              <p className="mt-8 max-w-[38ch] text-lg text-fg-2">{t.intro.sub}</p>
            </div>
          </div>

          {/* Lista de lojas: desktop */}
          <div
            className={`absolute inset-y-0 left-0 z-[160] hidden w-[min(28rem,40vw)] lg:flex ${tour.on ? "" : "pointer-events-none"}`}
          >
            <div className="page-wrap flex flex-col justify-center pr-0">
              <div className="sc" style={range(0.44, 0.52)}>
                <p className="label">
                  {t.orbit.label} · {pad(n)}
                </p>
                <h2 className="mt-5 text-[clamp(2.2rem,3.6vw,3.4rem)] font-medium leading-none tracking-[-0.03em]">
                  {t.orbit.title}
                </h2>
              </div>

              <ol className="sc mt-10 border-t border-line" style={range(0.47, 0.54)}>
                {clients.map((c, i) => {
                  const isActive = activeIdx === i;
                  return (
                    <li key={c.slug} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setOpen(i)}
                        className={`group grid w-full grid-cols-[2.75rem_1fr_auto] items-baseline py-3 text-left transition-colors duration-300 hover:text-fg ${
                          isActive || tour.done ? "text-fg" : "text-fg-2"
                        }`}
                      >
                        <span className={`label ${isActive ? "!text-accent" : ""}`}>{pad(i + 1)}</span>
                        <span className="text-xl font-medium tracking-tight">{c.name}</span>
                        <span className="label opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          {t.orbit.open} →
                        </span>
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-500 ease-out"
                        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                      >
                        <p className="overflow-hidden pl-11 text-fg-2">
                          <span className="block pb-4">{c.segment[lang]}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="sc mt-8" style={range(0.88, 0.94)}>
                <p className="text-fg-2">
                  <span className="pointer-coarse:hidden">{t.orbit.hint}</span>
                  <span className="hidden pointer-coarse:inline">{t.orbit.hintTouch}</span>
                </p>
                <Link to="/trabalhos" className="ulink mt-3 inline-block">
                  {t.orbit.all} →
                </Link>
              </div>
            </div>
          </div>

          {/* Lista de lojas: mobile, uma loja por vez */}
          <div
            className={`absolute inset-x-0 bottom-0 z-[160] lg:hidden ${tour.on ? "" : "pointer-events-none"}`}
          >
            <div className="page-wrap pb-8">
              <div className="sc" style={range(0.44, 0.52)}>
                <p className="label">
                  {t.orbit.label} · {pad(n)}
                </p>
                <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em]">{t.orbit.title}</h2>
              </div>
              <div className="sc mt-5 min-h-[5.5rem] border-t border-line pt-4" style={range(0.48, 0.54)}>
                {activeIdx !== null ? (
                  <button type="button" onClick={() => setOpen(activeIdx)} className="block w-full text-left">
                    <span className="label !text-accent">
                      {pad(activeIdx + 1)} / {pad(n)}
                    </span>
                    <span className="mt-1 block text-2xl font-medium tracking-tight">{clients[activeIdx].name}</span>
                    <span className="block text-fg-2">{clients[activeIdx].segment[lang]}</span>
                  </button>
                ) : tour.done ? (
                  <div>
                    <p className="text-fg-2">{t.orbit.hintTouch}</p>
                    <Link to="/trabalhos" className="ulink mt-2 inline-block">
                      {t.orbit.all} →
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Monograma recortado por cima de tudo */}
          <EEWindow progress={progress} end={MASK_END} />

          <div className="sc pointer-events-none absolute inset-x-0 bottom-0 z-[220]" style={range(-1, 0, 0, 0.05, 0)}>
            <div className="page-wrap flex items-end justify-between pb-7">
              <span className="label !text-bg">{t.intro.role}</span>
              <span className="label flex items-center gap-3 !text-bg">
                {t.intro.scroll}
                <span className="scroll-line" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap py-28 lg:py-40">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.home.servicesLabel}</h2>
          </Reveal>
          <ol className="border-t border-line lg:col-span-9">
            {t.home.services.map((s, i) => (
              <li key={s.title} className="border-b border-line">
                <Reveal delay={i * 70} className="grid gap-2 py-7 md:grid-cols-[4rem_1fr_1.15fr] md:gap-8 md:py-9">
                  <span className="label pt-2">{pad(i + 1)}</span>
                  <h3 className="text-2xl font-medium tracking-[-0.02em] md:text-[2rem] md:leading-tight">{s.title}</h3>
                  <p className="text-fg-2 md:pt-2">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-wrap pb-28 lg:pb-40">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.home.aboutLabel}</h2>
          </Reveal>
          <Reveal className="lg:col-span-9" delay={80}>
            <p className="max-w-[30ch] text-[clamp(1.7rem,3.4vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em]">
              {t.home.aboutText}
            </p>
            <Link to="/sobre" className="ulink mt-10 inline-flex items-center gap-2 text-lg">
              {t.home.aboutLink} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap py-28 lg:py-40">
          <Reveal>
            <p className="label">{t.home.ctaLabel}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 max-w-[18ch]">{t.home.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={160} className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <a
              href={`mailto:${site.email}`}
              className="ulink self-start text-[clamp(1.4rem,3.2vw,2.6rem)] font-medium tracking-tight"
            >
              {site.email}
            </a>
            <p className="text-fg-2">
              {t.home.ctaAlt}{" "}
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="ulink text-fg">
                {t.home.ctaAltLink} ↗
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <ClientDrawer clients={clients} index={open} onChange={setOpen} />
    </>
  );
}
