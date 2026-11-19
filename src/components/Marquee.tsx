import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Segundos para uma volta completa. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Faixa em movimento contínuo. O conteúdo é repetido uma vez (oculto para leitores de tela)
 * e a faixa anda metade da própria largura, o que fecha o laço sem emenda.
 * Cada item precisa do próprio espaçamento à direita, não `gap`, para as duas metades serem iguais.
 */
export default function Marquee({ children, duration = 40, reverse = false, className = "" }: Props) {
  return (
    <div
      className={`marquee ${className}`}
      data-reverse={reverse || undefined}
      style={{ "--dur": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
