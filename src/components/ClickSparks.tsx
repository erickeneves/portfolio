import { useEffect } from "react";
import { prefersReducedMotion } from "../lib/hooks";

const SPARKS = 8;

/** Pequena explosão de faíscas no ponto de cada clique ou toque. */
export default function ClickSparks() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      const burst = document.createElement("span");
      burst.className = "click-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      const turn = Math.random() * 45;
      for (let i = 0; i < SPARKS; i++) {
        const spark = document.createElement("i");
        spark.style.setProperty("--a", `${turn + (i * 360) / SPARKS}deg`);
        burst.appendChild(spark);
      }
      document.body.appendChild(burst);
      window.setTimeout(() => burst.remove(), 700);
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
