import type { ReactNode } from "react";
import { site } from "../content/site";
import { usePrefs } from "../context/Preferences";

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const icons = {
  whatsapp: (
    <Icon>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M9.2 8.1c-.6.6-.7 1.6-.2 2.6a9.6 9.6 0 0 0 4.3 4.3c1 .5 2 .4 2.6-.2l.5-.5a.6.6 0 0 0 0-.9l-1.4-1a.6.6 0 0 0-.8 0l-.5.5a5.7 5.7 0 0 1-2.6-2.6l.5-.5a.6.6 0 0 0 0-.8l-1-1.4a.6.6 0 0 0-.9 0Z" />
    </Icon>
  ),
  linkedin: (
    <Icon>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  ),
  email: (
    <Icon>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Icon>
  ),
  github: (
    <Icon>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </Icon>
  ),
};

/** Ícones de contato: WhatsApp, LinkedIn, e-mail e GitHub. */
export default function SocialLinks({ className = "" }: { className?: string }) {
  const { t } = usePrefs();
  const links = [
    { key: "whatsapp", href: site.whatsapp, label: t.social.whatsapp },
    { key: "linkedin", href: site.linkedin, label: t.social.linkedin },
    { key: "email", href: `mailto:${site.email}`, label: t.social.email },
    { key: "github", href: site.github, label: t.social.github },
  ] as const;

  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {links.map((l) => (
        <li key={l.key}>
          <a
            href={l.href}
            {...(l.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            aria-label={l.label}
            title={l.label}
            className="social-link"
          >
            {icons[l.key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
