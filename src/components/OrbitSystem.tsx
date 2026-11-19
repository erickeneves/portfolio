import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { FeaturedClient } from "../content/clients";
import { usePrefs } from "../context/Preferences";
import { prefersReducedMotion } from "../lib/hooks";
import { ORBITS, SPEEDS, initials, lerp, orbitGeometry, smoothstep } from "../lib/orbit";
import EEMark from "./EEMark";
import ShootingStars from "./ShootingStars";

interface Props {
  clients: FeaturedClient[];
  onSelect: (index: number) => void;
  /** Planeta destacado de fora (tour guiado pelo scroll). */
  active?: number | null;
  /** Progresso do scroll: somado ao ângulo, faz o sistema girar junto com a rolagem. */
  spin?: { current: number };
  /** Mostra o nome de todos os planetas. Com false, só o destacado aparece. */
  labels?: boolean;
  stars?: boolean;
  /** Avisa quando o sol vira buraco negro (e volta). */
  onHoleChange?: (open: boolean) => void;
}

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function OrbitSystem({
  clients,
  onSelect,
  active = null,
  spin,
  labels = true,
  stars = true,
  onHoleChange,
}: Props) {
  const { t, lang } = usePrefs();
  const rootRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timeRef = useRef(0);
  const mixRef = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const holeRef = useRef(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hole, setHole] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    hoverRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    holeRef.current = hole;
    onHoleChange?.(hole);
  }, [hole, onHoleChange]);

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
    return Array.from({ length: 130 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: 0.35 + rnd() * 1.05,
      o: 0.15 + rnd() * 0.65,
      twinkle: rnd() < 0.18,
    }));
  }, []);

  // Laço de animação: posiciona os planetas direto no DOM, sem re-render do React.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !geo.w) return;
    const reduce = prefersReducedMotion();
    const n = clients.length;
    let raf = 0;
    let last = performance.now();
    let speed = 1;
    let visible = true;

    const place = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Buraco negro: mistura de 0 (órbita) a 1 (cartões em volta do centro).
      const target = holeRef.current ? 1 : 0;
      mixRef.current = reduce ? target : mixRef.current + (target - mixRef.current) * Math.min(1, dt * 3.4);
      if (Math.abs(target - mixRef.current) < 0.002) mixRef.current = target;
      const m = smoothstep(mixRef.current);

      // Desacelera com o mouse sobre um planeta e para enquanto o buraco negro está aberto.
      const still = hoverRef.current !== null || holeRef.current;
      speed += ((still ? 0 : 1) - speed) * Math.min(1, dt * 5);
      if (!reduce) timeRef.current += dt * speed;
      const extra = spin?.current ?? 0;

      clients.forEach((c, i) => {
        const el = planetRefs.current[i];
        if (!el) return;
        const r = geo.R * ORBITS[c.orbit.orbit];
        const a = c.orbit.phase + timeRef.current * SPEEDS[c.orbit.orbit] + extra * (2.4 - c.orbit.orbit * 0.5);
        const ox = geo.cx + Math.cos(a) * r;
        const oy = geo.cy + Math.sin(a) * r * geo.tilt;
        const d = (Math.sin(a) + 1) / 2; // 0 = fundo, 1 = frente

        const ca = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const kx = geo.cx + Math.cos(ca) * geo.cardRx;
        const ky = geo.cy + Math.sin(ca) * geo.cardRy;

        const x = lerp(ox, kx, m);
        const y = lerp(oy, ky, m);
        const s = lerp(0.78 + 0.32 * d, 1, m);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        el.style.zIndex = String(m > 0.5 ? 200 + i : d > 0.5 ? 100 + Math.round(d * 50) : 10 + Math.round(d * 80));
        el.style.setProperty("--d", lerp(d, 1, m).toFixed(3));
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
  const highlightOrbit = highlight !== null && !hole ? clients[highlight]?.orbit.orbit : null;

  return (
    <div
      ref={rootRef}
      className="orbit-system absolute inset-0"
      data-highlight={highlight !== null || undefined}
      data-hole={hole || undefined}
      style={{ "--card-w": `${geo.cardW}px` } as CSSProperties}
    >
      {stars && (
        <>
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
          <ShootingStars />
        </>
      )}

      {geo.w > 0 && (
        <>
          <svg className="orbit-rings absolute inset-0 h-full w-full" aria-hidden="true">
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

          <button
            type="button"
            className="sun"
            data-hole={hole || undefined}
            style={{ width: geo.sun, height: geo.sun, left: geo.cx, top: geo.cy }}
            onClick={() => setHole((h) => !h)}
            aria-pressed={hole}
            aria-label={hole ? t.orbit.sunClose : t.orbit.sunOpen}
          >
            <span className="sun-ring" aria-hidden="true" />
            <span className="sun-disk" aria-hidden="true">
              <EEMark className="sun-mark" />
            </span>
            <span className="sun-ring sun-ring-front" aria-hidden="true" />
            <span className="sun-caption label" aria-hidden="true">
              {hole ? t.orbit.sunClose : t.orbit.sunHint}
            </span>
          </button>

          {clients.map((c, i) => {
            const size = geo.planet * c.orbit.size;
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
                style={{ width: size, height: size, "--c": c.color, "--i": i } as CSSProperties}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                onClick={() => onSelect(i)}
                aria-label={`${c.name}, ${c.segment[lang]}. ${t.orbit.open}`}
              >
                <span className="planet-core">
                  {c.orbit.ring && <span className="planet-ring" />}
                  <span className="planet-body" />
                  {c.logo ? (
                    <img
                      className={`planet-logo${c.logoOnDark || c.logoOriginal ? " is-original" : ""}`}
                      src={c.logoOnDark ?? c.logo}
                      alt=""
                      decoding="async"
                      draggable={false}
                    />
                  ) : (
                    <span className="planet-mono">{initials(c.name)}</span>
                  )}
                  {c.orbit.ring && <span className="planet-ring planet-ring-front" />}
                </span>

                <span className="planet-label" aria-hidden="true">
                  <span className="planet-label-num">{String(i + 1).padStart(2, "0")}</span>
                  {c.name}
                </span>

                <span className="planet-card" aria-hidden="true">
                  <span className="planet-card-logo">
                    {c.logo ? (
                      <>
                        {c.logoOnDark && (
                          <img className="is-original on-dark-only" src={c.logoOnDark} alt="" decoding="async" draggable={false} />
                        )}
                        <img
                          className={[c.logoOriginal && "is-original", c.logoOnDark && "on-light-only"].filter(Boolean).join(" ") || undefined}
                          src={c.logo}
                          alt=""
                          decoding="async"
                          draggable={false}
                        />
                      </>
                    ) : (
                      <span className="planet-card-mono">
                        <span className="planet-body" />
                        <span className="planet-mono">{initials(c.name)}</span>
                      </span>
                    )}
                  </span>
                  <span className="planet-card-name">{c.name}</span>
                  <span className="planet-card-meta">{c.stack === "Hydrogen" ? "Headless · Hydrogen" : "Liquid"}</span>
                </span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
