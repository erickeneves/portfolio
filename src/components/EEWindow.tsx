import { useLayoutEffect, useRef } from "react";
import { EE_H, EE_ORIGIN, EE_PATH, EE_STROKE, EE_W } from "../lib/ee";

/** Retângulo enorme em volta do monograma: com fill-rule evenodd, as letras viram buracos. */
const OUTER = `M-30000 -30000H${EE_W + 30000}V${EE_H + 30000}H-30000Z`;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

interface Props {
  progress: { current: number };
  /** Ponto do progresso em que a janela termina de abrir. */
  end?: number;
}

/**
 * Cobertura de tela inteira com o monograma "EE" recortado. Pelos recortes se vê a cena de trás.
 * Com o scroll, a câmera mergulha no primeiro E até o traço ocupar a tela toda.
 */
export default function EEWindow({ progress, end = 0.22 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    let raf = 0;
    let lastP = -1;
    let lastW = 0;
    let lastH = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const svg = svgRef.current;
      const path = pathRef.current;
      if (!svg || !path) return;

      const p = progress.current;
      const vw = svg.clientWidth;
      const vh = svg.clientHeight;
      if (p === lastP && vw === lastW && vh === lastH) return;
      lastP = p;
      lastW = vw;
      lastH = vh;

      const e = smooth(clamp01(p / end));
      if (e >= 1) {
        svg.style.visibility = "hidden";
        return;
      }
      svg.style.visibility = "visible";
      svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);

      const markW = Math.min(vw * (vw < 768 ? 0.8 : 0.56), 840);
      const s0 = markW / EE_W;
      const mx = (vw - markW) / 2;
      const my = (vh - EE_H * s0) / 2;
      // Escala final: o traço mais fino precisa cobrir mais que a tela inteira.
      const sEnd = (Math.max(vw, vh) * 2.4) / EE_STROKE;
      // Interpolação exponencial: o zoom parece ter velocidade constante.
      const s = s0 * Math.pow(sEnd / s0, e);
      const ox0 = mx + EE_ORIGIN.x * s0;
      const oy0 = my + EE_ORIGIN.y * s0;
      const ox = ox0 + (vw / 2 - ox0) * e;
      const oy = oy0 + (vh / 2 - oy0) * e;

      path.setAttribute(
        "transform",
        `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-EE_ORIGIN.x} ${-EE_ORIGIN.y})`,
      );
    };

    // Primeira pintura já com a posição certa; depois segue no ritmo da tela.
    draw();
    return () => cancelAnimationFrame(raf);
  }, [progress, end]);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[200] h-full w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={OUTER + EE_PATH}
        fillRule="evenodd"
        style={{ fill: "var(--fg)", pointerEvents: "visiblePainted" }}
      />
    </svg>
  );
}
