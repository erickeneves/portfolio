import { site } from "../content/site";

export default function Footer() {
  const links = [
    { label: "E-mail", href: `mailto:${site.email}` },
    { label: "LinkedIn", href: site.linkedin },
    { label: "GitHub", href: site.github },
    { label: "WhatsApp", href: site.whatsapp },
  ];

  return (
    <footer className="border-t border-line">
      <div className="page-wrap flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <span className="label">
          © {new Date().getFullYear()} {site.name}
        </span>
        <ul className="flex flex-wrap gap-x-7 gap-y-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="label ulink hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
