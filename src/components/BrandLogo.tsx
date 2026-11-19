import type { Client } from "../content/clients";

interface Props {
  client: Client;
  className?: string;
}

/**
 * Logo de uma loja na página: versão para fundo escuro quando existe (troca com o tema),
 * cores originais quando marcado, e silhueta na cor do texto nos demais casos.
 */
export default function BrandLogo({ client, className = "" }: Props) {
  if (!client.logo) return null;
  const img = (src: string, extra: string) => (
    <img src={src} alt="" loading="lazy" decoding="async" draggable={false} className={`object-contain ${extra} ${className}`} />
  );
  const tone = client.logoOriginal ? "" : "logo-mono";
  if (client.logoOnDark) {
    return (
      <>
        {img(client.logoOnDark, "on-dark-only")}
        {img(client.logo, `on-light-only ${tone}`)}
      </>
    );
  }
  return img(client.logo, tone);
}
