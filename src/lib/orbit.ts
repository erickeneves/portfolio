/** Raio de cada órbita, em fração do raio maior. */
export const ORBITS = [0.42, 0.68, 0.94];

/** Velocidade angular de cada órbita (rad/s). As internas giram mais rápido. */
export const SPEEDS = [0.16, 0.1, 0.065];

/** Geometria do sistema para uma área de w x h pixels. */
export function orbitGeometry(w: number, h: number) {
  const portrait = h > w * 1.1;
  const R = portrait ? w * 0.47 : Math.min(w * 0.38, h * 0.95);
  return {
    portrait,
    R,
    cx: w / 2,
    cy: h / 2,
    tilt: portrait ? 0.7 : 0.36,
    sun: Math.max(56, Math.min(140, R * 0.2)),
    planet: Math.max(18, Math.min(46, R * 0.075)),
  };
}
