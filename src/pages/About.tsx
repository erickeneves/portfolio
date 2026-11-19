import portrait from "../assets/profile-pic.jpeg";
import { site } from "../content/site";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle } from "../lib/hooks";
import { keepHyphenated } from "../lib/text";
import Reveal from "../components/Reveal";
import SocialLinks from "../components/SocialLinks";
import CountUp from "../components/CountUp";
import TechIcon from "../components/TechIcon";
import { techFor } from "../content/tech";

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
          <SocialLinks className="mt-6" />
        </Reveal>
      </section>

      <section className="border-t border-line">
        <dl className="page-wrap grid grid-cols-1 sm:grid-cols-3">
          {t.about.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="border-b border-line py-8 sm:border-b-0 sm:border-r sm:px-8 sm:py-12 sm:first:pl-0 sm:last:border-r-0"
            >
              <dt className="label">{s.label}</dt>
              <dd className="mt-3 text-[clamp(2.2rem,4.5vw,3.5rem)] font-medium leading-none tracking-[-0.03em]">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap grid gap-10 py-24 lg:grid-cols-12 lg:py-32">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.about.traitsLabel}</h2>
          </Reveal>
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
            {t.about.traits.map((trait, i) => (
              <li key={trait.title} className="border-t border-line">
                <Reveal delay={(i % 2) * 80} className="group grid grid-cols-[2.5rem_1fr] gap-x-2 py-7">
                  <span className="label pt-1.5 transition-colors duration-300 group-hover:!text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-medium tracking-tight">{trait.title}</h3>
                    <p className="mt-2 text-fg-2">{trait.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="page-wrap grid gap-10 py-24 lg:grid-cols-12 lg:py-32">
          <Reveal className="lg:col-span-3">
            <h2 className="label">{t.about.stackLabel}</h2>
          </Reveal>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
            {t.about.stack.map((group, i) => (
              <Reveal key={group.title} delay={i * 70}>
                <h3 className="border-b border-line pb-3 text-lg font-medium">{group.title}</h3>
                <ul className="mt-4 space-y-2 text-fg-2">
                  {group.items.map((item) => {
                    const tech = techFor(item);
                    return (
                      <li key={item} className="flex items-center gap-3">
                        <span className="grid w-6 shrink-0 place-items-center" aria-hidden="true">
                          {tech?.icon ? <TechIcon tech={tech} /> : <span className="h-px w-3 bg-accent" />}
                        </span>
                        {item}
                      </li>
                    );
                  })}
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
