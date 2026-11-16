import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Client } from "../content/clients";
import { usePrefs } from "../context/Preferences";
import { prefersReducedMotion } from "../lib/hooks";
import { ORBITS, SPEEDS, orbitGeometry } from "../lib/orbit";
import EEMark from "./EEMark";

interface Props {
  clients: Client[];
  onSelect: (index: number) => void;
  /** Planeta destacado de fora (tour guiado pelo scroll). */
  active?: number | null;
  /** Progresso do scroll: somado ao ângulo, faz o sistema girar junto com a rolagem. */
  spin?: { current: number };
  /** Mostra o nome de todos os planetas. Com false, só o destacado aparece. */
  labels?: boolean;
  stars?: boolean;
}

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function OrbitSystem({ clients, onSelect, active = null, spin, labels = true, stars = true }: Props) {
  const { t, lang } = usePrefs();
  const rootRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timeRef = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    hoverRef.current = hovered;
  }, [hovered]);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setBox({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox((b) => (b.w === width && b.h === height ? b : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => ({ w: box.w, ...orbitGeometry(box.w, box.h) }), [box]);

  const starDots = useMemo(() => {
    const rnd = seeded(11);
    return Array.from({ length: 120 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: 0.35 + rnd() * 1.05,
      o: 0.12 + rnd() * 0.6,
      twinkle: rnd() < 0.18,
    }));
  }, []);

  // Laço de animação: posiciona os planetas direto no DOM, sem re-render do React.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !geo.w) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();
    let speed = 1;
    let visible = true;

    const place = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Desacelera suavemente enquanto o mouse está sobre um planeta.
      speed += ((hoverRef.current !== null ? 0 : 1) - speed) * Math.min(1, dt * 5);
      if (!reduce) timeRef.current += dt * speed;
      const extra = spin?.current ?? 0;

      clients.forEach((c, i) => {
        const el = planetRefs.current[i];
        if (!el) return;
        const r = geo.R * ORBITS[c.orbit];
        const a = c.phase + timeRef.current * SPEEDS[c.orbit] + extra * (2.4 - c.orbit * 0.5);
        const x = geo.cx + Math.cos(a) * r;
        const y = geo.cy + Math.sin(a) * r * geo.tilt;
        const d = (Math.sin(a) + 1) / 2; // 0 = fundo, 1 = frente
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(0.78 + 0.32 * d).toFixed(3)})`;
        el.style.zIndex = String(d > 0.5 ? 100 + Math.round(d * 50) : 10 + Math.round(d * 80));
        el.style.setProperty("--d", d.toFixed(3));
      });
    };

    const tick = (now: number) => {
      place(now);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(root);

    place(last);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [geo, clients, spin]);

  const highlight = hovered ?? active;
  const highlightOrbit = highlight !== null ? clients[highlight]?.orbit : null;

  return (
    <div ref={rootRef} className="orbit-system absolute inset-0" data-highlight={highlight !== null || undefined}>
      {stars && (
        <svg className="stars absolute inset-0 h-full w-full" aria-hidden="true">
          {starDots.map((s, i) => (
            <circle
              key={i}
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              className={s.twinkle ? "twinkle" : undefined}
              style={{ opacity: s.o, animationDelay: `${(i % 9) * 0.6}s` }}
            />
          ))}
        </svg>
      )}

      {geo.w > 0 && (
        <>
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {ORBITS.map((k, i) => (
              <ellipse
                key={i}
                cx={geo.cx}
                cy={geo.cy}
                rx={geo.R * k}
                ry={geo.R * k * geo.tilt}
                pathLength={1}
                className="orbit-ring"
                data-active={highlightOrbit === i || undefined}
                style={{ animationDelay: `${0.2 * i}s` }}
              />
            ))}
          </svg>

          <div className="sun" style={{ width: geo.sun, height: geo.sun, left: geo.cx, top: geo.cy }} aria-hidden="true">
            <EEMark className="sun-mark" />
          </div>

          {clients.map((c, i) => {
            const size = geo.planet * c.size;
            return (
              <button
                key={c.slug}
                ref={(el) => {
                  planetRefs.current[i] = el;
                }}
                type="button"
                className="planet"
                data-active={highlight === i || undefined}
                data-labels={(labels && !geo.portrait) || highlight === i || undefined}
                style={{ width: size, height: size, "--c": c.color } as CSSProperties}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                onClick={() => onSelect(i)}
                aria-label={`${c.name}, ${c.segment[lang]}. ${t.orbit.open}`}
              >
                <span className="planet-core">
                  {c.ring && <span className="planet-ring" />}
                  <span className="planet-body" />
                  {c.ring && <span className="planet-ring planet-ring-front" />}
                </span>
                <span className="planet-label" aria-hidden="true">
                  <span className="planet-label-num">{String(i + 1).padStart(2, "0")}</span>
                  {c.name}
                </span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
