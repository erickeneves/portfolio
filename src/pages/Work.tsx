import { useState } from "react";
import { clients, otherClients, type Client } from "../content/clients";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle } from "../lib/hooks";
import ClientDrawer from "../components/ClientDrawer";
import Reveal from "../components/Reveal";
import BrandLogo from "../components/BrandLogo";
import Spectrograph from "../components/Spectrograph";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Work() {
  const { t, lang } = usePrefs();
  useDocumentTitle(t.meta.work);
  const [open, setOpen] = useState<number | null>(null);
  const indexOf = (c: Client) => clients.indexOf(c);

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
          <p className="mt-8 max-w-[52ch] text-lg text-fg-2">{t.work.intro}</p>
        </Reveal>
      </section>

      <section className="page-wrap pb-28 lg:pb-36">
        <Reveal>
          <h2 className="label mb-12">{t.home.spectrum.label}</h2>
        </Reveal>
        <Spectrograph onOpen={(slug) => setOpen(clients.findIndex((c) => c.slug === slug))} />
      </section>

      <section className="border-t border-line">
        <div className="page-wrap py-28 lg:py-36">
          <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="label">
              {t.work.moreLabel} · {pad(otherClients.length)}
            </h2>
            <p className="max-w-[52ch] text-fg-2">{t.work.moreIntro}</p>
          </Reveal>

          <ul className="mt-10 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
            {otherClients.map((c, i) => (
              <li key={c.slug} className="border-b border-r border-line">
                <Reveal delay={(i % 4) * 50} className="h-full">
                  <button
                    type="button"
                    onClick={() => setOpen(indexOf(c))}
                    className="group flex h-full w-full flex-col justify-between gap-8 p-5 text-left transition-colors hover:bg-bg-2 md:p-6"
                  >
                    <span className="flex h-12 items-center">
                      {c.logo ? (
                        <BrandLogo client={c} className="max-h-10 max-w-[70%] opacity-80 transition-opacity group-hover:opacity-100" />
                      ) : (
                        <span className="text-xl font-medium tracking-tight">{c.name}</span>
                      )}
                    </span>
                    <span>
                      <span className="block font-medium">{c.name}</span>
                      <span className="mt-1 block text-sm text-fg-2">{c.segment[lang]}</span>
                      <span className="label mt-3 block transition-colors group-hover:text-fg">{t.work.details} →</span>
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClientDrawer clients={clients} index={open} onChange={setOpen} />
    </>
  );
}
