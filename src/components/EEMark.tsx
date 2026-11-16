import { EE_H, EE_PATH, EE_W } from "../lib/ee";

export default function EEMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${EE_W} ${EE_H}`} className={className} aria-hidden="true" focusable="false">
      <path d={EE_PATH} fill="currentColor" />
    </svg>
  );
}
