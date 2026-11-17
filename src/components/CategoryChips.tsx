"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/profiles";
import type { CategoryId } from "@/lib/types";
import { MaterialIcon } from "./Icons";

interface Props {
  filter: CategoryId | "todas";
  onSelect: (id: CategoryId | "todas") => void;
  count: number;
}

/** Category filter chips. When the row overflows, arrow buttons appear on the side that can scroll. */
export default function CategoryChips({ filter, onSelect, count }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      const next = { left: row.scrollLeft > 4, right: row.scrollLeft < max - 4 };
      setCanScroll((prev) => (prev.left === next.left && prev.right === next.right ? prev : next));
    };

    // ResizeObserver reports the initial size too, so this also runs once on mount.
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(row);
    row.addEventListener("scroll", update, { passive: true });
    return () => {
      resizeObserver.disconnect();
      row.removeEventListener("scroll", update);
    };
  }, []);

  const scrollBy = (direction: -1 | 1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * Math.max(160, row.clientWidth * 0.6), behavior: "smooth" });
  };

  return (
    <div className="chips-wrap">
      <button
        type="button"
        className={`icon-btn chips-nav chips-nav--prev${canScroll.left ? " is-visible" : ""}`}
        aria-label="Ver categorías anteriores"
        tabIndex={canScroll.left ? 0 : -1}
        onClick={() => scrollBy(-1)}
      >
        <MaterialIcon name="chevron_left" />
      </button>

      <div className="chips" ref={rowRef} role="tablist" aria-label="Filtrar por categoría">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={filter === c.id}
            className={`chip${filter === c.id ? " is-active" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <span className="chip__check" aria-hidden="true">
              <MaterialIcon name="check" />
            </span>
            {c.label}
          </button>
        ))}
        <span className="chips__count" aria-live="polite">
          {count} {count === 1 ? "perfil" : "perfiles"}
        </span>
      </div>

      <button
        type="button"
        className={`icon-btn chips-nav chips-nav--next${canScroll.right ? " is-visible" : ""}`}
        aria-label="Ver más categorías"
        tabIndex={canScroll.right ? 0 : -1}
        onClick={() => scrollBy(1)}
      >
        <MaterialIcon name="chevron_right" />
      </button>
    </div>
  );
}
