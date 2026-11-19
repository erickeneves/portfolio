import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePrefs } from "../context/Preferences";
import { prefersReducedMotion } from "../lib/hooks";

interface Star {
  /** Índice da qualidade em home.qualities e about.traits. */
  trait: number;
  /** Posição dentro da constelação, de 0 a 1. */
  u: number;
  v: number;
  /** Rótulo acima da estrela (para as estrelas de onde as linhas descem). */
  top?: boolean;
}

/** Três constelações de quatro estrelas. A primeira estrela de cada uma é a mais brilhante. */
const SKY: { stars: Star[]; edges: [number, number][] }[] = [
  {
    // Ingenium: losango
    stars: [
      { trait: 0, u: 0.5, v: 0.06, top: true },
      { trait: 1, u: 0.14, v: 0.44 },
      { trait: 5, u: 0.86, v: 0.38 },
      { trait: 4, u: 0.44, v: 0.86 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  },
  {
    // Opus: ziguezague
    stars: [
      { trait: 3, u: 0.12, v: 0.16, top: true },
      { trait: 2, u: 0.34, v: 0.7 },
      { trait: 6, u: 0.62, v: 0.26, top: true },
      { trait: 9, u: 0.88, v: 0.82 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    // Concordia: forquilha
    stars: [
      { trait: 7, u: 0.14, v: 0.22, top: true },
      { trait: 8, u: 0.48, v: 0.48 },
      { trait: 11, u: 0.86, v: 0.14, top: true },
      { trait: 10, u: 0.62, v: 0.88 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
];

/* Dois desenhos do mesmo céu: lado a lado no desktop, empilhado no celular. */
const DESK = { w: 1200, h: 540, cell: (i: number) => ({ x: i * 400 + 50, y: 120, w: 300, h: 330 }) };
const MOBILE = { w: 400, h: 1380, cell: (i: number) => ({ x: 50, y: i * 460 + 110, w: 300, h: 290 }) };
type Layout = typeof DESK;

const place = (layout: Layout, c: number, s: Star) => {
  const cell = layout.cell(c);
  return { x: cell.x + s.u * cell.w, y: cell.y + s.v * cell.h };
};
const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/** Ordem do passeio automático: estrela por estrela, constelação por constelação. */
const ORDER = SKY.flatMap((c) => c.stars.map((s) => s.trait));
const AUTOPLAY_MS = 3800;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function Lines({ layout, active, focus }: { layout: Layout; active: number | null; focus: number | null }) {
  return (
    <svg viewBox={`0 0 ${layout.w} ${layout.h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {SKY.map((con, ci) =>
        con.edges.map(([a, b], ei) => {
          const p = place(layout, ci, con.stars[a]);
          const q = place(layout, ci, con.stars[b]);
          const touches = active !== null && (con.stars[a].trait === active || con.stars[b].trait === active);
          return (
            <line
              key={`${ci}-${ei}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              pathLength={1}
              className="cline"
              data-on={touches || undefined}
              data-dim={(focus !== null && focus !== ci) || undefined}
              style={{ "--d": `${ci * 0.5 + ei * 0.28}s` } as CSSProperties}
            />
          );
        }),
      )}
    </svg>
  );
}

/** Qualidades como estrelas ligadas em constelações, sobre uma nebulosa. */
export default function Constellations() {
  const { t } = usePrefs();
  const sky = t.home.sky;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setLit(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Passeio automático pelas estrelas enquanto ninguém interage.
  useEffect(() => {
    if (!inView || hovering || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setActive((a) => ORDER[(a === null ? 0 : ORDER.indexOf(a) + 1) % ORDER.length]);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [inView, hovering]);

  const dust = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: 110 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      r: 0.4 + rnd() * 0.9,
      o: 0.12 + rnd() * 0.5,
      tw: rnd() < 0.2,
    }));
  }, []);

  const focus = active === null ? null : SKY.findIndex((c) => c.stars.some((s) => s.trait === active));
  const trait = active === null ? null : t.about.traits[active];

  return (
    <div>
      <div
        ref={ref}
        className="sky"
        data-lit={lit || undefined}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <div className="nebula" aria-hidden="true">
          <span className="nebula-cloud n1" />
          <span className="nebula-cloud n2" />
          <span className="nebula-cloud n3" />
        </div>

        <svg className="sky-dust absolute inset-0 h-full w-full" aria-hidden="true">
          {dust.map((d, i) => (
            <circle
              key={i}
              cx={`${d.x}%`}
              cy={`${d.y}%`}
              r={d.r}
              className={d.tw ? "twinkle" : undefined}
              style={{ opacity: d.o, animationDelay: `${(i % 7) * 0.7}s` }}
            />
          ))}
        </svg>

        <div className="hidden md:block" aria-hidden="true">
          <Lines layout={DESK} active={active} focus={focus} />
        </div>
        <div className="md:hidden" aria-hidden="true">
          <Lines layout={MOBILE} active={active} focus={focus} />
        </div>

        {SKY.map((_, ci) => {
          const d = DESK.cell(ci);
          const m = MOBILE.cell(ci);
          return (
            <div
              key={ci}
              className="cname"
              data-dim={(focus !== null && focus !== ci) || undefined}
              style={
                {
                  "--xd": pct(d.x - 10, DESK.w),
                  "--yd": pct(36, DESK.h),
                  "--xm": pct(m.x - 10, MOBILE.w),
                  "--ym": pct(m.y - 80, MOBILE.h),
                } as CSSProperties
              }
            >
              <span className="cname-title">{sky.constellations[ci].name}</span>
              <span className="label">{sky.constellations[ci].sub}</span>
            </div>
          );
        })}

        {SKY.map((con, ci) =>
          con.stars.map((s, si) => {
            const d = place(DESK, ci, s);
            const m = place(MOBILE, ci, s);
            return (
              <button
                key={s.trait}
                type="button"
                className="cstar"
                data-alpha={si === 0 || undefined}
                data-top={s.top || undefined}
                data-on={active === s.trait || undefined}
                data-dim={(focus !== null && focus !== ci) || undefined}
                style={
                  {
                    "--xd": pct(d.x, DESK.w),
                    "--yd": pct(d.y, DESK.h),
                    "--xm": pct(m.x, MOBILE.w),
                    "--ym": pct(m.y, MOBILE.h),
                    "--i": ci * 4 + si,
                  } as CSSProperties
                }
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(s.trait)}
                onFocus={() => setActive(s.trait)}
                onClick={() => setActive(s.trait)}
                aria-pressed={active === s.trait}
              >
                <span className="cstar-dot" aria-hidden="true" />
                <span className="cstar-label">{t.home.qualities[s.trait]}</span>
              </button>
            );
          }),
        )}
      </div>

      <div className="sky-readout mt-8 grid min-h-[8.5rem] gap-3 border-t border-line pt-6 md:grid-cols-12 md:gap-10" aria-live="polite">
        {trait && focus !== null && active !== null ? (
          <Fragment key={active}>
            <p className="sky-readout-in label md:col-span-3 md:pt-2">
              {sky.constellations[focus].name} · {sky.constellations[focus].sub}
            </p>
            <div className="sky-readout-in md:col-span-9">
              <p className="text-2xl font-medium tracking-[-0.02em]">{t.home.qualities[active]}</p>
              <p className="mt-2 max-w-[62ch] text-fg-2">{trait.text}</p>
            </div>
          </Fragment>
        ) : (
          <p className="text-fg-2 md:col-span-9 md:col-start-4">
            <span className="pointer-coarse:hidden">{sky.hint}</span>
            <span className="hidden pointer-coarse:inline">{sky.hintTouch}</span>
          </p>
        )}
      </div>
    </div>
  );
}
