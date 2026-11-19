import type { Tech } from "../content/tech";

/** Ícone de uma tecnologia; sem ícone, um ponto na cor de destaque. */
export default function TechIcon({ tech, className = "" }: { tech?: Tech; className?: string }) {
  if (!tech?.icon) return <span className={`tech-dot ${className}`} aria-hidden="true" />;
  return (
    <img
      src={tech.icon}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`tech-icon${tech.dark ? " is-dark" : ""} ${className}`}
    />
  );
}
