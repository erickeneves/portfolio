import type { Lang } from "./strings";

/**
 * Dados pessoais e links. Tudo que aparece no site sobre contato sai daqui.
 */
export const site = {
  name: "Erick Neves",
  email: "erickedu211@gmail.com",
  whatsapp: "https://wa.me/5514988364827",
  linkedin: "https://www.linkedin.com/in/erick-neves-3a9252321/",
  github: "https://github.com/erickeneves",
  location: { pt: "São Paulo, Brasil", en: "São Paulo, Brazil" },

  /**
   * Currículo em PDF por idioma. Coloque os arquivos em public/cv e informe o caminho,
   * por exemplo "/cv/erick-neves-pt.pdf". Com null, o botão de currículo não aparece.
   */
  cv: { pt: null, en: null } as Record<Lang, string | null>,
};
