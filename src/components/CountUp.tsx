import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/hooks";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Duração em ms. */
  duration?: number;
}

/** Número que conta de 0 até o valor quando entra na tela. Leitores de tela recebem só o valor final. */
export default function CountUp({ value, prefix = "", suffix = "", duration = 1800 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / duration);
          setN(Math.round((1 - Math.pow(1 - k, 4)) * value));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const final = `${prefix}${value}${suffix}`;
  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span className="sr-only">{final}</span>
      {/* O valor final invisível reserva a largura: o número cresce sem empurrar o layout. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {final}
      </span>
      <span className="col-start-1 row-start-1" aria-hidden="true">
        {prefix}
        {n}
        {suffix}
      </span>
    </span>
  );
}
