import { useEffect, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "../lib/hooks";

interface Streak {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  duration: number;
}

/** De tempos em tempos, uma estrela cadente cruza o céu. Some com movimento reduzido. */
export default function ShootingStars() {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let id = 0;
    let timer = 0;

    const spawn = () => {
      if (document.visibilityState === "visible") {
        const streak: Streak = {
          id: id++,
          x: 5 + Math.random() * 70,
          y: Math.random() * 50,
          angle: 14 + Math.random() * 26,
          length: 90 + Math.random() * 110,
          duration: 0.9 + Math.random() * 0.8,
        };
        setStreaks((list) => [...list.slice(-2), streak]);
      }
      timer = window.setTimeout(spawn, 3800 + Math.random() * 6500);
    };

    timer = window.setTimeout(spawn, 1800 + Math.random() * 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {streaks.map((s) => (
        <span
          key={s.id}
          className="shooting-star"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              "--angle": `${s.angle}deg`,
              "--len": `${s.length}px`,
              animationDuration: `${s.duration}s`,
            } as CSSProperties
          }
          onAnimationEnd={() => setStreaks((list) => list.filter((x) => x.id !== s.id))}
        />
      ))}
    </div>
  );
}
