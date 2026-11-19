/** Raio de cada órbita, em fração do raio maior. */
export const ORBITS = [0.42, 0.68, 0.94];

/** Velocidade angular de cada órbita (rad/s). As internas giram mais rápido. */
export const SPEEDS = [0.16, 0.1, 0.065];

/** Geometria do sistema para uma área de w x h pixels. */
export function orbitGeometry(w: number, h: number) {
  const portrait = h > w * 1.1;
  const R = portrait ? w * 0.47 : Math.min(w * 0.38, h * 0.95);
  // Cartões do modo buraco negro: dispostos numa elipse em volta do centro.
  const cardW = Math.round(Math.max(106, Math.min(150, w * 0.1)));
  const cardH = Math.round(cardW * 0.92);
  return {
    portrait,
    R,
    cx: w / 2,
    cy: h / 2,
    tilt: portrait ? 0.7 : 0.36,
    sun: Math.max(56, Math.min(132, R * 0.2)),
    planet: Math.max(32, Math.min(70, R * 0.11)),
    cardW,
    cardRx: Math.min(w * 0.36, w / 2 - cardW * 0.62),
    // No celular a cena sobe um pouco e há texto embaixo: elipse mais baixa.
    cardRy: portrait ? h * 0.28 : Math.min(h * 0.34, h / 2 - cardH * 0.72),
  };
}

export const smoothstep = (x: number) => x * x * (3 - 2 * x);

/** Iniciais para lojas sem logo: "Roland & BOSS" vira "RB". */
export const initials = (name: string) =>
  name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
