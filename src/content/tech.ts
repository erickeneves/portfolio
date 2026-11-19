import shopify from "../assets/technologies/shopify.png";
import hydrogen from "../assets/technologies/hydrogen.png";
import liquid from "../assets/technologies/liquid.png";
import react from "../assets/technologies/react.svg";
import ts from "../assets/technologies/ts.svg";
import js from "../assets/technologies/js.svg";
import html from "../assets/technologies/html.svg";
import css from "../assets/technologies/css.svg";
import tailwind from "../assets/technologies/tailwind.svg";
import node from "../assets/technologies/node.svg";
import php from "../assets/technologies/php.svg";
import mysql from "../assets/technologies/mysql.svg";
import java from "../assets/technologies/java.svg";
import python from "../assets/technologies/python.svg";
import mongo from "../assets/technologies/mongo.svg";

export interface Tech {
  name: string;
  icon?: string;
  /** Ícone escuro: clareia no tema escuro para não sumir no fundo. */
  dark?: boolean;
}

/** Linguagens e ferramentas, na ordem em que aparecem nas faixas da home. */
export const techRows: Tech[][] = [
  [
    { name: "Shopify", icon: shopify },
    { name: "Hydrogen", icon: hydrogen, dark: true },
    { name: "Liquid", icon: liquid, dark: true },
    { name: "React", icon: react },
    { name: "TypeScript", icon: ts },
    { name: "JavaScript", icon: js },
    { name: "GraphQL" },
    { name: "Weaverse" },
    { name: "Tailwind CSS", icon: tailwind },
  ],
  [
    { name: "HTML", icon: html },
    { name: "CSS", icon: css },
    { name: "Shopify Flow" },
    { name: "Node.js", icon: node },
    { name: "PHP", icon: php, dark: true },
    { name: "MySQL", icon: mysql, dark: true },
    { name: "Java", icon: java },
    { name: "Python", icon: python },
    { name: "MongoDB", icon: mongo },
    { name: "Claude Code" },
  ],
];

const all = techRows.flat();
const byLength = [...all].sort((a, b) => b.name.length - a.name.length);

/** Ícone de um item da stack ("Hydrogen (headless)" encontra Hydrogen). */
export function techFor(item: string): Tech | undefined {
  return all.find((t) => t.name === item) ?? byLength.find((t) => item.startsWith(t.name));
}
