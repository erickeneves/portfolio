import { useEffect, useRef } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Progresso (0 a 1) de rolagem através de uma seção alta com conteúdo "sticky".
 * Grava o valor na variável CSS --p da seção, para as animações derivarem dele em CSS,
 * e expõe o mesmo valor por ref para animações em JS.
 */
export function useScrollProgress<T extends HTMLElement>(onChange?: (p: number) => void) {
  const ref = useRef<T>(null);
  const progress = useRef(0);
  const callback = useRef(onChange);

  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    let raf = 0;

    const update = () => {
      raf = 0;
      const total = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = reduce || total <= 0 ? 1 : Math.min(1, Math.max(0, -top / total));
      progress.current = p;
      el.style.setProperty("--p", p.toFixed(4));
      callback.current?.(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { ref, progress };
}
