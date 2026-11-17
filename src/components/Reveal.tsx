"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeReveal, supportsScrollTimeline } from "@/lib/scroll-reveal";

/**
 * Fades and lifts its children as they scroll into view, and reverses when scrolling back up.
 * CSS scroll-driven animations do the work where supported; JS covers the rest.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || supportsScrollTimeline()) return;
    return observeReveal([el], false);
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
