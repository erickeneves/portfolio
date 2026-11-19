import { TLink } from "../components/TransitionLink";
import { usePrefs } from "../context/Preferences";
import { useDocumentTitle } from "../lib/hooks";

export default function NotFound() {
  const { t } = usePrefs();
  useDocumentTitle(t.meta.notFound);

  return (
    <section className="page-wrap flex min-h-[80svh] flex-col justify-center pb-24 pt-36">
      <p className="label">404</p>
      <h1 className="display mt-6 max-w-[16ch]">{t.notFound.title}</h1>
      <p className="mt-6 text-lg text-fg-2">{t.notFound.text}</p>
      <TLink to="/" className="btn mt-10 self-start">
        ← {t.notFound.back}
      </TLink>
    </section>
  );
}
