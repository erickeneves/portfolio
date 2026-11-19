import type { Lang } from "./strings";
import rolandLogo from "../assets/clients/roland.svg";
import bossLogo from "../assets/clients/boss.svg";
import darknessLogo from "../assets/clients/darkness.png";
import nutrifyLogo from "../assets/clients/nutrify.png";
import nutrifyLogoDark from "../assets/clients/nutrify-dark.png";
import hangLooseLogoDark from "../assets/clients/hangloose-dark.png";

type Localized<T> = Record<Lang, T>;

export type Stack = "Hydrogen" | "Liquid";

/** Posição de uma loja no sistema solar da home. */
export interface OrbitProps {
  /** 0 = órbita interna, 1 = média, 2 = externa */
  orbit: 0 | 1 | 2;
  /** Multiplicador do tamanho do planeta (1 = padrão) */
  size: number;
  /** Ângulo inicial em radianos */
  phase: number;
  /** Desenha um anel ao redor do planeta */
  ring?: boolean;
}

export interface Client {
  slug: string;
  name: string;
  segment: Localized<string>;
  /** Hydrogen = loja headless; Liquid = tema Shopify tradicional */
  stack: Stack;
  /** Cor do planeta e do banner da marca */
  color: string;
  /** Endereço da loja. Sem url, o painel não mostra o link. */
  url?: string;
  /** Logo com fundo transparente. Por padrão aparece em silhueta. */
  logo?: string;
  /** Mostra a logo nas cores originais (para selos que perdem a leitura em silhueta). */
  logoOriginal?: boolean;
  /**
   * Versão colorida da logo para fundo escuro (planeta, banner e tema escuro).
   * Quando existe, `logo` aparece só sobre fundo claro.
   */
  logoOnDark?: string;
  /** O que você fez no projeto. Aparece no painel de detalhes como "O que fiz". */
  scope?: Localized<string[]>;
  /** Presente = a loja aparece como planeta no sistema solar da home. */
  orbit?: OrbitProps;
}

export type FeaturedClient = Client & { orbit: OrbitProps };

const cdn = (path: string) => `https://cdn.shopify.com/s/files/1/${path}`;

const rolandScope: Localized<string[]> = {
  pt: [
    "Cálculo de frete no carrinho, prazo de preparo na página de produto e prazo da transportadora gravado no pedido.",
    "Blog 100% personalizável pelo admin, montado com metaobjetos e metacampos.",
    "Avise-me quando chegar, pop-up de cadastro que some para quem já é cliente e selos de desconto automático e PIX.",
    "Home de Black Friday com cronômetro, vitrine automática de lançamentos e sugestões de busca.",
    "Validações no checkout: máscara de telefone, campos obrigatórios e regras de endereço.",
  ],
  en: [
    "Shipping estimate in the cart, preparation time on the product page and carrier lead time saved on the order.",
    "Blog fully customizable from the Shopify admin, built with metaobjects and metafields.",
    "Back-in-stock alerts, a sign-up pop-up that skips existing customers and automatic discount and PIX badges.",
    "Black Friday home with a countdown, an automatic new-arrivals shelf and search suggestions.",
    "Checkout validations: phone mask, required fields and address rules.",
  ],
};

/**
 * Lojas em que você trabalhou. As que têm `orbit` viram planetas na home (na ordem do tour);
 * as demais aparecem em "Mais lojas" na página de trabalhos.
 */
export const clients: Client[] = [
  {
    slug: "integralmedica",
    name: "Integralmedica",
    segment: { pt: "Suplementos esportivos", en: "Sports nutrition" },
    stack: "Hydrogen",
    color: "#cf5a40",
    url: "https://www.integralmedica.com.br",
    logo: cdn("0742/9632/8446/files/logo-integral-grande.webp?v=1747248833&width=400"),
    logoOriginal: true,
    scope: {
      pt: [
        "Brindes automáticos configurados com metacampos e metaobjetos, sem depender de apps externos.",
        "Promoções de leve mais por menos, desconto no PIX e ofertas relâmpago com contagem regressiva.",
        "Assinaturas e planos recorrentes integrados à página de produto e às vitrines.",
        "Teste A/B na página de produto, tabelas nutricionais e kits com vários botões de compra.",
        "Quiz montado com metacampos e metaobjetos.",
        "Landing pages de campanha em blocos Weaverse, editáveis pelo time da marca.",
        "Feed para o Google Merchant, catálogo XML e pontos de fidelidade no produto e no checkout.",
      ],
      en: [
        "Automatic gifts driven by metafields and metaobjects, with no third-party apps.",
        "Buy-more-pay-less promotions, PIX discount and flash deals with countdowns.",
        "Subscriptions and recurring plans built into the product page and collections.",
        "Product page A/B test, nutrition tables and bundles with multiple buy buttons.",
        "Quiz built with metafields and metaobjects.",
        "Campaign landing pages built with Weaverse blocks the brand team can edit.",
        "Google Merchant feed, XML catalog and loyalty points on product pages and checkout.",
      ],
    },
    orbit: { orbit: 1, size: 1.15, phase: 0.2 },
  },
  {
    slug: "darkness",
    name: "Darkness",
    segment: { pt: "Suplementos para treino pesado", en: "Performance supplements" },
    stack: "Hydrogen",
    color: "#514c68",
    url: "https://www.darkness.com.br",
    logo: darknessLogo,
    logoOnDark: cdn("0742/9632/8446/files/DK_NEW_LOGO_1024x1024_branco.png?v=1770136707&width=300"),
    logoOriginal: true,
    scope: {
      pt: [
        "Loja headless que divide a base de código com a Integralmedica: menu novo, assinaturas, brindes e countdown.",
        "Categorias com conteúdo próprio, lançamentos de vestuário e metaobjetos para linhas de produto.",
        "Otimização de imagens e correções de lentidão no carrinho.",
      ],
      en: [
        "Headless store sharing its codebase with Integralmedica: new menu, subscriptions, gifts and countdowns.",
        "Category pages with their own content, apparel launches and metaobjects for product lines.",
        "Image optimization and cart performance fixes.",
      ],
    },
    orbit: { orbit: 0, size: 1, phase: 0.6 },
  },
  {
    slug: "nutrify",
    name: "Nutrify",
    segment: { pt: "Suplementos e vitaminas", en: "Supplements and vitamins" },
    stack: "Hydrogen",
    color: "#0f6e54",
    logo: nutrifyLogo,
    logoOnDark: nutrifyLogoDark,
    logoOriginal: true,
    scope: {
      pt: [
        "Variantes por dosagem e sabor, com uma nova dinâmica na página de produto.",
        "Página de revenda, cupons e promoções para influenciadores.",
        "Atualização de conteúdo e dos descritivos de kits depois da migração da loja.",
      ],
      en: [
        "Variants by dosage and flavor, with a new product page flow.",
        "Reseller page, coupons and influencer promotions.",
        "Content and bundle description updates after the store migration.",
      ],
    },
    orbit: { orbit: 0, size: 0.95, phase: 2.69 },
  },
  {
    slug: "roland",
    name: "Roland",
    segment: { pt: "Instrumentos musicais", en: "Musical instruments" },
    stack: "Hydrogen",
    color: "#d9843f",
    url: "https://store.roland.com.br",
    logo: rolandLogo,
    scope: rolandScope,
    orbit: { orbit: 1, size: 1.1, phase: 2.29 },
  },
  {
    slug: "boss",
    name: "BOSS",
    segment: { pt: "Pedais, amplificadores e efeitos", en: "Guitar pedals, amps and effects" },
    stack: "Hydrogen",
    color: "#4a74c9",
    url: "https://store.bossmusic.com.br",
    logo: bossLogo,
    scope: {
      pt: [
        "Segunda vitrine headless da mesma loja Shopify da Roland: frete, checkout, cadastro e promoções valem para as duas.",
        ...rolandScope.pt.slice(2, 4),
      ],
      en: [
        "Second headless storefront on the same Shopify store as Roland: shipping, checkout, sign-up and promotions work on both.",
        ...rolandScope.en.slice(2, 4),
      ],
    },
    orbit: { orbit: 0, size: 0.95, phase: 4.78 },
  },
  {
    slug: "mari-maria-makeup",
    name: "Mari Maria Makeup",
    segment: { pt: "Maquiagem", en: "Makeup" },
    stack: "Liquid",
    color: "#d08a9f",
    url: "https://www.marimariamakeup.com",
    logo: cdn("0731/6147/4209/files/LOGO_-_LARANJA.svg?v=1790190770"),
    scope: {
      pt: [
        "Régua de brindes e frete grátis sempre visível no minicart.",
        "QA depois do lançamento da loja e troca do app de avaliações.",
        "Investigação de regras de cupom e validação de endereço no checkout.",
      ],
      en: [
        "Gift and free-shipping progress bar always visible in the mini cart.",
        "Post-launch QA and a reviews app swap.",
        "Coupon rule investigation and address validation at checkout.",
      ],
    },
    orbit: { orbit: 1, size: 1, phase: 4.38 },
  },
  {
    slug: "hurley",
    name: "Hurley",
    segment: { pt: "Surfwear", en: "Surfwear" },
    stack: "Liquid",
    color: "#5f6f7d",
    url: "https://hurley.com.br",
    logo: cdn("0759/0356/6136/files/Frame_3.svg?v=1685531539"),
    scope: {
      pt: ["Ajustes de CRO nas páginas de produto.", "Avisos no checkout replicados entre as lojas do grupo."],
      en: ["CRO tweaks on product pages.", "Checkout notices rolled out across the group's stores."],
    },
    orbit: { orbit: 2, size: 1, phase: 1.1 },
  },
  {
    slug: "hang-loose",
    name: "Hang Loose",
    segment: { pt: "Surfwear e lifestyle", en: "Surfwear and lifestyle" },
    stack: "Liquid",
    color: "#3f9a8c",
    url: "https://hangloose.com.br",
    logo: cdn("0752/4214/4017/files/logo_hang_01.png?v=1773238763&width=400"),
    logoOnDark: hangLooseLogoDark,
    logoOriginal: true,
    scope: {
      pt: [
        "Landing page da collab Hang Loose x Fat Buddha, implementada a partir do layout aprovado.",
        "Avisos no checkout compartilhados com as outras lojas do grupo.",
      ],
      en: [
        "Landing page for the Hang Loose x Fat Buddha collab, built from the approved layout.",
        "Checkout notices shared with the group's other stores.",
      ],
    },
    orbit: { orbit: 2, size: 1, phase: 2.67 },
  },
  {
    slug: "iron-studios",
    name: "Iron Studios",
    segment: { pt: "Estátuas colecionáveis", en: "Collectible statues" },
    stack: "Liquid",
    color: "#a98d64",
    url: "https://ironstudios.com.br",
    logo: cdn("0911/3056/0819/files/logo-p.svg?v=1737469309"),
    scope: {
      pt: ["Versão da loja em inglês.", "Análise e escolha de app para aviso de reposição de estoque."],
      en: ["English version of the store.", "Research and selection of a back-in-stock notification app."],
    },
    orbit: { orbit: 2, size: 1.05, phase: 4.24, ring: true },
  },
  {
    slug: "bandai",
    name: "Bandai BR",
    segment: { pt: "Action figures e colecionáveis", en: "Action figures and collectibles" },
    stack: "Liquid",
    color: "#b8484f",
    url: "https://bandaibrasil.com.br",
    logo: cdn("0897/6770/6996/files/bandai-logo.svg?v=1757685082"),
    orbit: { orbit: 2, size: 0.95, phase: 5.81 },
  },

  /* ---------- Mais lojas ---------- */
  {
    slug: "limited-edition",
    name: "Limited Edition",
    segment: { pt: "Colecionáveis multimarcas", en: "Multi-brand collectibles" },
    stack: "Liquid",
    color: "#7d7f86",
    url: "https://www.limitededition.com.br",
    logo: cdn("0726/3309/0286/files/logo_cinza.png?v=1761940146&width=400"),
    scope: {
      pt: [
        "Correções no carrinho e no carregamento da listagem de produtos.",
        "Carrossel de produtos relacionados no carrinho vazio.",
      ],
      en: ["Cart and product listing loading fixes.", "Related products carousel in the empty cart."],
    },
  },
  {
    slug: "qix",
    name: "QIX",
    segment: { pt: "Tênis de skate e streetwear", en: "Skate shoes and streetwear" },
    stack: "Liquid",
    color: "#a24b3d",
    url: "https://qixskateshop.com.br",
    logo: cdn("0670/1560/6439/files/svg-image-1_1.svg?v=1749235360"),
    scope: {
      pt: ["Metacampos para conteúdo de produto.", "Favoritos no topo do site mobile."],
      en: ["Metafields for product content.", "Wishlist shortcut in the mobile header."],
    },
  },
  {
    slug: "cadiveu",
    name: "Cadiveu",
    segment: { pt: "Cosméticos capilares profissionais", en: "Professional hair care" },
    stack: "Liquid",
    color: "#8a7a6a",
    url: "https://store.cadiveu.com",
    logo: cdn("0911/3462/4108/files/logo.svg?v=1749782196"),
    scope: {
      pt: ["Novo design da home, da página de produto e do menu, a partir do Figma."],
      en: ["New home, product page and menu design, built from Figma."],
    },
  },
  {
    slug: "yosen",
    name: "Yosen",
    segment: { pt: "Suplementos para saúde e longevidade", en: "Health and longevity supplements" },
    stack: "Liquid",
    color: "#e0703f",
    url: "https://www.yosen.com.br",
    logo: cdn("1020/3172/0529/files/yosen-logo.png?v=1778779038&width=400"),
  },
  {
    slug: "montecristo",
    name: "Montecristo",
    segment: { pt: "Joalheria e relógios", en: "Fine jewelry and watches" },
    stack: "Liquid",
    color: "#6e6a64",
    url: "https://montecristo.com.br",
    logo: cdn("0723/3667/0953/files/Logo_Montecristo_Header.svg?v=1743722306"),
  },
  {
    slug: "scarfme",
    name: "Scarf Me",
    segment: { pt: "Lenços e cashmere", en: "Scarves and cashmere" },
    stack: "Liquid",
    color: "#c4868c",
    url: "https://scarfme.com.br",
    logo: cdn("0021/0288/6455/files/logo_e2b36537-2abb-44e4-9d6c-c8807793052a.svg?v=1789474174"),
    scope: {
      pt: ["Instalação do Tolstoy (vídeos compráveis) e ajustes na opção de presente."],
      en: ["Tolstoy shoppable video setup and gift option tweaks."],
    },
  },
  {
    slug: "barthelemy",
    name: "Barthelemy",
    segment: { pt: "Resortwear com alfaiataria", en: "Tailored resortwear" },
    stack: "Liquid",
    color: "#2f4f7a",
    url: "https://barthelemy.com.br",
    logo: cdn("2648/8462/files/barthelemy-logo-white.svg?v=1701800273"),
  },
  {
    slug: "uv-line",
    name: "UV Line",
    segment: { pt: "Roupas com proteção UV", en: "UV-protective apparel" },
    stack: "Liquid",
    color: "#3c8fb0",
    url: "https://www.uvline.com.br",
    logo: cdn("0664/5232/4427/files/protecao-solar_2_025f840f-399e-4633-a7b4-fc973b9b54cb.svg?v=1793503138"),
  },
  {
    slug: "capicilin",
    name: "Capicilin",
    segment: { pt: "Tratamento capilar", en: "Hair treatment" },
    stack: "Liquid",
    color: "#8db53a",
    url: "https://capicilin.com.br",
    logo: cdn("0952/3422/8545/files/LOGO_2.png?v=1794179564&width=400"),
  },
  {
    slug: "linhahum",
    name: "Linhahum",
    segment: { pt: "Nutrição enteral e suplementos", en: "Enteral nutrition and supplements" },
    stack: "Liquid",
    color: "#4a6fc0",
    url: "https://www.linhahum.com.br",
    logo: cdn("0826/4407/4787/files/logoo_1.png?v=1698860644&width=400"),
  },
  {
    slug: "cbjr-store",
    name: "CBJR Store",
    segment: { pt: "Produtos oficiais do Charlie Brown Jr.", en: "Official Charlie Brown Jr. merch" },
    stack: "Liquid",
    color: "#5a5a5e",
    scope: {
      pt: ["Ordenação de produtos nas coleções."],
      en: ["Product ordering in collections."],
    },
  },
  {
    slug: "rezzet",
    name: "Rezzet",
    segment: { pt: "Alimento natural para cães", en: "Natural dog food" },
    stack: "Liquid",
    color: "#8fae5a",
    url: "https://rezzet.ca",
    logo: cdn("0822/7913/7533/files/Logo_f1a27202-fba8-4773-834d-bfb38aacaf79.png?v=1786549745&width=400"),
  },
];

export const featuredClients = clients.filter((c): c is FeaturedClient => c.orbit !== undefined);
export const otherClients = clients.filter((c) => c.orbit === undefined);
export const headlessCount = clients.filter((c) => c.stack === "Hydrogen").length;
