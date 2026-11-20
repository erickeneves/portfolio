/** Raio de cada órbita, em fração do raio maior. */
export const ORBITS = [0.42, 0.68, 0.94];

/** Velocidade angular de cada órbita (rad/s). As internas giram mais rápido. */
export const SPEEDS = [0.16, 0.1, 0.065];

/** Geometria do sistema para uma área de w x h pixels. */
export function orbitGeometry(w: number, h: number) {
  const portrait = h > w * 1.1;
  const R = portrait ? w * 0.47 : Math.min(w * 0.38, h * 0.95);
  // Cartões do modo buraco negro: dispostos numa elipse em volta do centro.
  // Em pé (celular) os cartões ficam compactos e a elipse usa a altura toda.
  const cardW = portrait
    ? Math.round(Math.max(84, Math.min(100, w * 0.26)))
    : Math.round(Math.max(106, Math.min(150, w * 0.1)));
  const cardH = Math.round(cardW * (portrait ? 0.86 : 0.92));
  return {
    portrait,
    R,
    cx: w / 2,
    cy: h / 2,
    tilt: portrait ? 0.7 : 0.36,
    sun: Math.max(56, Math.min(132, R * 0.2)),
    planet: Math.max(32, Math.min(70, R * 0.11)),
    cardW,
    cardRx: portrait ? w / 2 - cardW / 2 - 8 : Math.min(w * 0.36, w / 2 - cardW * 0.62),
    // 70px de folga no alto para o cabeçalho.
    cardRy: portrait ? Math.min(h * 0.33, h / 2 - cardH / 2 - 70) : Math.min(h * 0.34, h / 2 - cardH * 0.72),
  };
}

/**
 * n posições espaçadas por igual ao longo do contorno da elipse, a partir do topo e em sentido horário.
 * Dividir pelo comprimento do arco (e não pelo ângulo) evita cartões amontoados nas pontas da elipse.
 * Com `p` acima de 2 a curva vira uma superelipse, mais reta no topo e nas laterais: numa tela em pé,
 * a elipse comum é tão fechada nas pontas que os cartões vizinhos ao do topo encostam nele.
 */
export function ellipseSlots(n: number, rx: number, ry: number, p = 2) {
  const steps = 720;
  const start = -Math.PI / 2;
  const e = 2 / p;
  const at = (k: number) => {
    const a = start + (k / steps) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x: Math.sign(c) * Math.abs(c) ** e * rx, y: Math.sign(s) * Math.abs(s) ** e * ry };
  };
  const acc = [0];
  let prev = at(0);
  for (let k = 1; k <= steps; k++) {
    const p = at(k);
    acc.push(acc[k - 1] + Math.hypot(p.x - prev.x, p.y - prev.y));
    prev = p;
  }
  const total = acc[steps];
  const slots: Array<{ x: number; y: number }> = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const target = (i / n) * total;
    while (k < steps - 1 && acc[k + 1] < target) k++;
    const f = (target - acc[k]) / (acc[k + 1] - acc[k] || 1);
    slots.push(at(k + f));
  }
  return slots;
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
