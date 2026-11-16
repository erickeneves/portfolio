import type { Lang } from "./strings";
import gamerent from "../assets/projects/gamerent.gif";
import pacman from "../assets/projects/pacman.gif";

export interface PersonalProject {
  slug: string;
  title: string;
  description: Record<Lang, string>;
  tech: string[];
  media: string;
  github: string;
}

export const projects: PersonalProject[] = [
  {
    slug: "gamerent",
    title: "GameRent",
    description: {
      pt: "Sistema de aluguel de jogos com catálogo, reservas, contas de usuário e painel administrativo.",
      en: "Game rental system with a catalog, reservations, user accounts and an admin panel.",
    },
    tech: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
    media: gamerent,
    github: "https://github.com/erickeneves/Loja-Jogos",
  },
  {
    slug: "pacman",
    title: "Pac-Man",
    description: {
      pt: "Recriação do Pac-Man em Java puro, com movimentação dos fantasmas, colisão e pontuação.",
      en: "Pac-Man rebuilt in plain Java, with ghost movement, collision and scoring.",
    },
    tech: ["Java"],
    media: pacman,
    github: "https://github.com/erickeneves/Pac-Man-Java",
  },
];
