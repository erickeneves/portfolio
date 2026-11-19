import type { Lang } from "./strings";

type Localized<T> = Record<Lang, T>;

/** Uma loja em destaque, representada por uma linha espectral real. */
export interface SpectralLine {
  /** Slug da loja em clients.ts */
  slug: string;
  /** Nome da linha: série de Balmer (Hα...) ou letra de Fraunhofer (B, D...) */
  code: string;
  /** Comprimento de onda em nanômetros: define a posição e a cor da linha. */
  nm: number;
  /** Intensidade da linha de emissão, de 0 a 1. */
  strength?: number;
  /** Resultado publicado em case da Shakers. */
  result?: { value: string; label: Localized<string>; source: string };
}

const rolandBoss = {
  value: "+238%",
  label: {
    pt: "no índice de performance das vitrines Roland e BOSS, depois da saída da VTEX.",
    en: "in the Roland and BOSS storefronts' performance score, after leaving VTEX.",
  },
  source: "https://shakersagencia.com.br/products/roland-boss",
};

/** Lojas headless: as cinco primeiras linhas da série de Balmer do hidrogênio. */
export const hydrogenLines: SpectralLine[] = [
  { slug: "integralmedica", code: "Hα", nm: 656.3, strength: 1 },
  { slug: "roland", code: "Hβ", nm: 486.1, strength: 0.92, result: rolandBoss },
  { slug: "boss", code: "Hγ", nm: 434.0, strength: 0.84, result: rolandBoss },
  { slug: "darkness", code: "Hδ", nm: 410.2, strength: 0.76 },
  { slug: "nutrify", code: "Hε", nm: 397.0, strength: 0.68 },
];

/** Lojas em Liquid: linhas de Fraunhofer, as faixas escuras do espectro do Sol. */
export const liquidLines: SpectralLine[] = [
  {
    slug: "iron-studios",
    code: "B",
    nm: 686.7,
    result: {
      value: "+70%",
      label: {
        pt: "de performance no GTmetrix e no PageSpeed, depois da migração para Shopify Plus.",
        en: "performance on GTmetrix and PageSpeed, after the move to Shopify Plus.",
      },
      source: "https://shakersagencia.com.br/products/iron-studios",
    },
  },
  { slug: "hurley", code: "D", nm: 589.3 },
  { slug: "hang-loose", code: "E", nm: 527.0 },
  { slug: "mari-maria-makeup", code: "G", nm: 430.8 },
  { slug: "bandai", code: "H", nm: 396.8 },
];
