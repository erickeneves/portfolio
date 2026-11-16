import portrait from "../assets/profile-pic.jpeg";
import { site } from "../content/site";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle } from "../lib/hooks";
import { keepHyphenated } from "../lib/text";
import Reveal from "../components/Reveal";

export default function About() {
  const { t, lang } = usePrefs();
  useDocumentTitle(t.meta.about);
  const cv = site.cv[lang];

  return (
    <>
      <section className="page-wrap grid gap-14 pb-24 pt-36 lg:grid-cols-12 lg:gap-10 lg:pb-36 lg:pt-48">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label">{t.about.label}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display mt-6">{keepHyphenated(t.about.heading)}</h1>
          </Reveal>
          <Reveal delay={160} className="mt-12 max-w-[58ch] space-y-5 text-lg leading-relaxed text-fg-2">
            {t.about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          {cv && (
            <Reveal delay={220}>
              <a href={cv} target="_blank" rel="noopener noreferrer" className="btn mt-10">
                {t.about.cv} <span aria-hidden="true">↓</span>
              </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={200} className="lg:col-span-4 lg:col-start-9 lg:pt-24">
          <figure>
            <div className="aspect-[4/5] overflow-hidden bg-bg-2">
              {/* O recorte 4:5 centralizado também tira o canto inferior direito da foto original. */}
              <img
                src={portrait}
                alt={t.about.portraitAlt}
                className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
              />
            </div>
            <figcaption className="label mt-4 flex justify-between gap-4">
              <span>{site.name}</span>
              <span>{site.location[lang]}</span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap grid gap-10 py-24 lg:grid-cols-12 lg:py-32">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.about.stackLabel}</h2>
          </Reveal>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-4">
            {t.about.stack.map((group, i) => (
              <Reveal key={group.title} delay={i * 70}>
                <h3 className="border-b border-line pb-3 text-lg font-medium">{group.title}</h3>
                <ul className="mt-4 space-y-2 text-fg-2">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap grid gap-10 py-24 lg:grid-cols-12 lg:py-32">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.about.timelineLabel}</h2>
          </Reveal>
          <ol className="border-t border-line lg:col-span-9">
            {t.about.timeline.map((item, i) => (
              <li key={item.title} className="border-b border-line">
                <Reveal delay={i * 70} className="grid gap-1 py-6 md:grid-cols-[9rem_1fr_1fr] md:gap-8">
                  <span className="label pt-1.5">{item.when}</span>
                  <span className="text-xl font-medium tracking-tight">{item.title}</span>
                  <span className="text-fg-2 md:pt-0.5">{item.place}</span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
