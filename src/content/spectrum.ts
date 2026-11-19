import type { Lang } from "./strings";

type Localized<T> = Record<Lang, T>;

/** Um número publicado em case da Shakers. */
export interface CaseResult {
  value: string;
  label: Localized<string>;
}

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
  /** Resultados publicados no case da Shakers. */
  results?: CaseResult[];
  /** Endereço do case. */
  source?: string;
}

const caseUrl = (handle: string) => `https://shakersagencia.com.br/products/${handle}`;

const rolandBoss = {
  source: caseUrl("roland-boss"),
  results: [
    {
      value: "+238%",
      label: {
        pt: "no índice de performance das vitrines, depois da saída da VTEX.",
        en: "in the storefronts' performance score, after leaving VTEX.",
      },
    },
    {
      value: "1 carrinho",
      label: {
        pt: "para Roland e BOSS: o cliente compra das duas marcas na mesma sacola, com checkout unificado.",
        en: "for Roland and BOSS: customers buy from both brands in the same bag, with a single checkout.",
      },
    },
  ],
};

/** Lojas headless: as cinco primeiras linhas da série de Balmer do hidrogênio. */
export const hydrogenLines: SpectralLine[] = [
  { slug: "integralmedica", code: "Hα", nm: 656.3, strength: 1 },
  { slug: "roland", code: "Hβ", nm: 486.1, strength: 0.92, ...rolandBoss },
  { slug: "boss", code: "Hγ", nm: 434.0, strength: 0.84, ...rolandBoss },
  { slug: "darkness", code: "Hδ", nm: 410.2, strength: 0.76 },
  { slug: "nutrify", code: "Hε", nm: 397.0, strength: 0.68 },
];

/** Lojas em Liquid: linhas de Fraunhofer, as faixas escuras do espectro do Sol. */
export const liquidLines: SpectralLine[] = [
  {
    slug: "iron-studios",
    code: "B",
    nm: 686.7,
    source: caseUrl("iron-studios"),
    results: [
      {
        value: "+70%",
        label: {
          pt: "de performance no GTmetrix e no PageSpeed, depois da migração da VTEX para a Shopify Plus.",
          en: "performance on GTmetrix and PageSpeed, after moving from VTEX to Shopify Plus.",
        },
      },
      {
        value: "2 países",
        label: {
          pt: "Brasil e Estados Unidos na mesma estrutura Shopify Plus, com Expansion Stores.",
          en: "Brazil and the United States on the same Shopify Plus setup, with Expansion Stores.",
        },
      },
    ],
  },
  {
    slug: "uv-line",
    code: "C",
    nm: 656.3,
    source: caseUrl("uv-line"),
    results: [
      {
        value: "99",
        label: {
          pt: "de nota de performance no PageSpeed, na migração da VTEX para a Shopify.",
          en: "performance score on PageSpeed, after moving from VTEX to Shopify.",
        },
      },
      {
        value: "30 seções",
        label: {
          pt: "editáveis no tema: o time da marca atualiza as páginas sem depender de desenvolvedor.",
          en: "editable in the theme: the brand team updates pages without a developer.",
        },
      },
    ],
  },
  {
    slug: "qix",
    code: "a",
    nm: 627.7,
    source: caseUrl("qix"),
    results: [
      {
        value: "E → A",
        label: {
          pt: "na nota do GTmetrix, depois da migração para a Shopify Plus.",
          en: "in the GTmetrix grade, after the move to Shopify Plus.",
        },
      },
      {
        value: "2 lojas",
        label: {
          pt: "geridas de um lugar só com Expansion Stores, com menos custo de manutenção.",
          en: "managed from one place with Expansion Stores, at a lower maintenance cost.",
        },
      },
    ],
  },
  { slug: "hurley", code: "D", nm: 589.3 },
  { slug: "hang-loose", code: "E", nm: 527.0 },
  {
    slug: "scarfme",
    code: "F",
    nm: 486.1,
    source: caseUrl("scarfme"),
    results: [
      {
        value: "+174%",
        label: {
          pt: "em conversões, com o redesign da loja e o trabalho contínuo de CRO e CRM.",
          en: "in conversions, after the store redesign and ongoing CRO and CRM work.",
        },
      },
    ],
  },
  { slug: "fujifilm", code: "d", nm: 466.8 },
  { slug: "mari-maria-makeup", code: "G", nm: 430.8 },
  { slug: "bandai", code: "H", nm: 396.8 },
];

/** Lojas que aparecem no espectro. */
export const spectrumSlugs = new Set([...hydrogenLines, ...liquidLines].map((l) => l.slug));
