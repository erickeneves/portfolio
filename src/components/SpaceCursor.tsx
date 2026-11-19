import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/hooks";

const INTERACTIVE = "a, button, [role='button'], label, summary, select";
const TEXT_FIELD = "input, textarea, [contenteditable='true']";

/**
 * Cursor temático: uma estrela no ponto exato e uma órbita com lua que segue com atraso.
 * A órbita abre sobre links e botões e encolhe no clique.
 * Só aparece com mouse; em toque e com movimento reduzido o cursor do sistema continua.
 */
export default function SpaceCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLSpanElement>(null);
  const orbitRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const star = starRef.current;
    const orbit = orbitRef.current;
    if (!wrap || !star || !orbit) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;

    const root = document.documentElement;
    root.classList.add("has-space-cursor");
    let x = -100;
    let y = -100;
    let ox = x;
    let oy = y;
    let raf = 0;

    const flag = (name: string, on: boolean) => {
      if (on) wrap.dataset[name] = "";
      else delete wrap.dataset[name];
    };

    const follow = () => {
      ox += (x - ox) * 0.2;
      oy += (y - oy) * 0.2;
      orbit.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - ox) + Math.abs(y - oy) > 0.2 ? requestAnimationFrame(follow) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!("visible" in wrap.dataset)) {
        ox = x;
        oy = y;
        flag("visible", true);
      }
      star.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const target = e.target instanceof Element ? e.target : null;
      flag("hover", !!target?.closest(INTERACTIVE));
      flag("text", !!target?.closest(TEXT_FIELD));
      if (!raf) raf = requestAnimationFrame(follow);
    };
    const onDown = () => flag("down", true);
    const onUp = () => flag("down", false);
    const onLeave = () => flag("visible", false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-space-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="space-cursor" aria-hidden="true">
      <span ref={orbitRef} className="space-cursor-orbit">
        <span className="space-cursor-ring">
          <span className="space-cursor-moon" />
        </span>
      </span>
      <span ref={starRef} className="space-cursor-star" />
    </div>
  );
}
