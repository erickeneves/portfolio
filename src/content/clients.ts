import type { Lang } from "./strings";

type Localized<T> = Record<Lang, T>;

export interface Client {
  slug: string;
  name: string;
  segment: Localized<string>;
  platform: string;
  /** Endereço da loja. Sem url, o painel não mostra o link. */
  url?: string;
  /** O que você fez no projeto. Opcional: aparece no painel de detalhes quando preenchido. */
  scope?: Localized<string[]>;

  /* Aparência no sistema solar */
  color: string;
  /** 0 = órbita interna, 1 = média, 2 = externa */
  orbit: 0 | 1 | 2;
  /** Multiplicador do tamanho do planeta (1 = padrão) */
  size: number;
  /** Ângulo inicial em radianos */
  phase: number;
  /** Desenha um anel ao redor do planeta */
  ring?: boolean;
}

/**
 * Lojas em que você trabalhou. A ordem aqui é a ordem do tour na home e da lista em /trabalhos.
 * Para adicionar uma loja, copie um bloco e ajuste os campos.
 */
export const clients: Client[] = [
  {
    slug: "integralmedica",
    name: "Integralmedica",
    segment: { pt: "Suplementos esportivos", en: "Sports nutrition" },
    platform: "Shopify",
    url: "https://www.integralmedica.com.br",
    color: "#cf5a40",
    orbit: 1,
    size: 1.2,
    phase: 0.35,
  },
  {
    slug: "darkness",
    name: "Darkness",
    segment: { pt: "Suplementos esportivos", en: "Sports nutrition" },
    platform: "Shopify",
    url: "https://www.darkness.com.br",
    color: "#5a5672",
    orbit: 0,
    size: 0.95,
    phase: 2.2,
  },
  {
    slug: "nutrify",
    name: "Nutrify",
    segment: { pt: "Suplementos e vitaminas", en: "Supplements and vitamins" },
    platform: "Shopify",
    color: "#82a86e",
    orbit: 1,
    size: 1,
    phase: 3.6,
  },
  {
    slug: "roland-boss",
    name: "Roland & Boss",
    segment: { pt: "Instrumentos musicais e áudio", en: "Musical instruments and audio" },
    platform: "Shopify",
    color: "#d9a03f",
    orbit: 2,
    size: 1.1,
    phase: 1.1,
  },
  {
    slug: "qix",
    name: "QIX",
    segment: { pt: "Tênis e streetwear", en: "Sneakers and streetwear" },
    platform: "Shopify",
    color: "#5182b6",
    orbit: 0,
    size: 0.9,
    phase: 5.3,
  },
  {
    slug: "iron-studios",
    name: "Iron Studios",
    segment: { pt: "Estátuas colecionáveis", en: "Collectible statues" },
    platform: "Shopify",
    url: "https://ironstudios.com.br",
    color: "#a98d64",
    orbit: 2,
    size: 1.15,
    phase: 4.4,
    ring: true,
  },
];
