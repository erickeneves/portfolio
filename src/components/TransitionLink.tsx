import type { MouseEvent } from "react";
import { Link, NavLink, useLocation, useNavigate, type LinkProps, type NavLinkProps } from "react-router";
import { canTransition, runTransition } from "../lib/transition";

/** Clique em link interno com a cortina de troca de página (View Transitions). */
function useTransitionClick(to: LinkProps["to"], onClick?: (e: MouseEvent<HTMLAnchorElement>) => void) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Mesmo endereço ou destino que não é texto: o Link resolve sozinho.
    if (typeof to !== "string" || to === pathname || !canTransition()) return;
    e.preventDefault();
    runTransition("page", () => navigate(to));
  };
}

export function TLink({ onClick, ...props }: LinkProps) {
  const handle = useTransitionClick(props.to, onClick);
  return <Link {...props} onClick={handle} />;
}

export function TNavLink({ onClick, ...props }: NavLinkProps) {
  const handle = useTransitionClick(props.to, onClick);
  return <NavLink {...props} onClick={handle} />;
}
