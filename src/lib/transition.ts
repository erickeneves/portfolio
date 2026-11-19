import { flushSync } from "react-dom";
import { prefersReducedMotion } from "./hooks";

export type TransitionKind = "page" | "theme";

/** View Transitions disponíveis e sem pedido de movimento reduzido. */
export function canTransition() {
  return typeof document.startViewTransition === "function" && !prefersReducedMotion();
}

/**
 * Roda uma atualização do React dentro de uma View Transition.
 * O tipo vai para html[data-vt], e o CSS escolhe a animação: cortina para página, círculo para tema.
 * Sem suporte, aplica a atualização direto.
 */
export function runTransition(kind: TransitionKind, update: () => void) {
  if (!canTransition()) {
    update();
    return;
  }
  const root = document.documentElement;
  root.dataset.vt = kind;
  const vt = document.startViewTransition(() => flushSync(update));
  vt.finished.finally(() => {
    if (root.dataset.vt === kind) delete root.dataset.vt;
  });
}
