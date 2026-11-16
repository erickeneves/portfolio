import { useState, type CSSProperties } from "react";
import { clients } from "../content/clients";
import { projects } from "../content/projects";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle } from "../lib/hooks";
import ClientDrawer from "../components/ClientDrawer";
import Reveal from "../components/Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Work() {
  const { t, lang } = usePrefs();
  useDocumentTitle(t.meta.work);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <section className="page-wrap pb-16 pt-36 lg:pb-24 lg:pt-48">
        <Reveal>
          <p className="label">{t.work.label}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="display mt-6 max-w-[14ch]">{t.work.heading}</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-[48ch] text-lg text-fg-2">{t.work.intro}</p>
        </Reveal>
      </section>

      <section className="page-wrap pb-28 lg:pb-40">
        <div className="label hidden grid-cols-[4rem_1.2fr_1fr_9rem_7rem] border-b border-line pb-4 md:grid">
          <span>#</span>
          <span>{t.work.cols.store}</span>
          <span>{t.work.cols.segment}</span>
          <span>{t.work.cols.platform}</span>
          <span />
        </div>
        <ul>
          {clients.map((c, i) => (
            <li key={c.slug} className="work-row border-b border-line">
              <Reveal delay={i * 50}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-y-1 py-6 text-left md:grid-cols-[4rem_1.2fr_1fr_9rem_7rem] md:py-8"
                >
                  <span className="label">{pad(i + 1)}</span>
                  <span className="flex items-center gap-4 text-2xl font-medium tracking-[-0.02em] md:text-[2.4rem] md:leading-none">
                    <span className="work-dot" style={{ "--c": c.color } as CSSProperties} aria-hidden="true" />
                    {c.name}
                  </span>
                  <span className="hidden text-fg-2 md:block">{c.segment[lang]}</span>
                  <span className="hidden text-fg-2 md:block">{c.platform}</span>
                  <span className="label text-right transition-colors group-hover:text-fg">{t.work.details} →</span>
                  <span className="col-start-2 text-sm text-fg-2 md:hidden">{c.segment[lang]}</span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap py-28 lg:py-40">
          <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="label">{t.work.personalLabel}</h2>
            <p className="text-fg-2">{t.work.personalIntro}</p>
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="aspect-[16/10] overflow-hidden border border-line bg-bg-2">
                    <img
                      src={p.media}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-medium tracking-[-0.02em]">{p.title}</h3>
                    <span className="label transition-colors group-hover:text-fg">GitHub ↗</span>
                  </div>
                  <p className="mt-2 max-w-[48ch] text-fg-2">{p.description[lang]}</p>
                  <p className="label mt-5">{p.tech.join(" · ")}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClientDrawer clients={clients} index={open} onChange={setOpen} />
    </>
  );
}
