import { useEffect, useState } from "react";
import { site } from "../content/site";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle } from "../lib/hooks";
import Reveal from "../components/Reveal";

export default function Contact() {
  const { t, lang } = usePrefs();
  useDocumentTitle(t.meta.contact);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const channels = [
    { name: "WhatsApp", action: t.contact.channels.whatsapp, href: site.whatsapp },
    { name: "LinkedIn", action: t.contact.channels.linkedin, href: site.linkedin },
    { name: "GitHub", action: t.contact.channels.github, href: site.github },
  ];

  return (
    <>
      <section className="page-wrap pb-20 pt-36 lg:pb-28 lg:pt-48">
        <Reveal>
          <p className="label">{t.contact.label}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="display mt-6 max-w-[14ch]">{t.contact.heading}</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-[44ch] text-lg text-fg-2">{t.contact.intro}</p>
        </Reveal>

        <Reveal delay={220} className="mt-16 border-t border-line pt-10">
          <a
            href={`mailto:${site.email}`}
            className="ulink break-all text-[clamp(1.75rem,5.6vw,4.75rem)] font-medium leading-none tracking-[-0.035em]"
          >
            {site.email}
          </a>
          <div className="mt-6">
            <button type="button" onClick={copyEmail} className="label hover:text-fg" aria-live="polite">
              {copied ? `${t.contact.copied} ✓` : t.contact.copy}
            </button>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.contact.channelsLabel}</h2>
          </Reveal>
          <ul className="border-t border-line lg:col-span-9">
            {channels.map((c, i) => (
              <li key={c.name} className="border-b border-line">
                <Reveal delay={i * 70}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-6 py-6"
                  >
                    <span className="text-2xl font-medium tracking-[-0.02em] md:text-4xl">{c.name}</span>
                    <span className="label transition-colors group-hover:text-fg">{c.action} ↗</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3 lg:col-start-4">
            <p className="label">{t.contact.baseLabel}</p>
            <p className="mt-2">{site.location[lang]}</p>
          </div>
          <div className="lg:col-span-3">
            <p className="label">{t.contact.statusLabel}</p>
            <p className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {t.contact.status}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
