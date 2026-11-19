/** Faixa visível desenhada no espectrógrafo, em nanômetros. */
export const NM_MIN = 380;
export const NM_MAX = 700;

/** Posição (0 a 1) de um comprimento de onda na faixa. */
export const nmPos = (nm: number) => (nm - NM_MIN) / (NM_MAX - NM_MIN);

/** Cor aproximada da luz em um comprimento de onda (aproximação clássica de Dan Bruton). */
export function nmToRgb(nm: number): string {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) {
    r = (440 - nm) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = (510 - nm) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = (645 - nm) / 65;
  } else {
    r = 1;
  }
  // As pontas do espectro perdem intensidade para o olho.
  const fade = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 680 ? 0.3 + (0.7 * (780 - nm)) / 100 : 1;
  const c = (v: number) => Math.round(255 * Math.pow(Math.max(0, Math.min(1, v * fade)), 0.8));
  return `rgb(${c(r)} ${c(g)} ${c(b)})`;
}

/** Gradiente contínuo do espectro visível, para o fundo da faixa. */
export const spectrumGradient = (() => {
  const stops: string[] = [];
  for (let nm = NM_MIN; nm <= NM_MAX; nm += 10) {
    stops.push(`${nmToRgb(nm)} ${(nmPos(nm) * 100).toFixed(2)}%`);
  }
  return `linear-gradient(90deg, ${stops.join(", ")})`;
})();
