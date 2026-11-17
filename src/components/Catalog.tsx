"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { categoryLabel } from "@/lib/profiles";
import { columnStarts } from "@/lib/masonry";
import { observeReveal, supportsScrollTimeline } from "@/lib/scroll-reveal";
import { useShuffled } from "@/lib/shuffle";
import { setPhotoRegion } from "@/lib/vt-region";
import type { CategoryId, Profile } from "@/lib/types";
import { FROM_CATALOG_KEY, RESTORE_SCROLL_KEY } from "./BackButton";
import CategoryChips from "./CategoryChips";
import ProfileCard from "./ProfileCard";
import Reveal from "./Reveal";

const markFromCatalog = (event: React.MouseEvent) => {
  const card = (event.target as Element).closest<HTMLElement>(".card");
  if (card) setPhotoRegion(Number(card.dataset.ar));
  try {
    // Remember where the catalog was so "Volver" can bring the same cards back into place.
    sessionStorage.setItem(FROM_CATALOG_KEY, String(Math.round(window.scrollY)));
  } catch {
    // Storage can be unavailable (private mode).
  }
};

export default function Catalog({ profiles }: { profiles: Profile[] }) {
  const [filter, setFilter] = useState<CategoryId | "todas">("todas");
  // After the first filter change, cards re-enter with a staggered animation.
  const [swapped, setSwapped] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  // Random order per page load, so every profile has the same chance of appearing first.
  const ordered = useShuffled(profiles);
  const visible = filter === "todas" ? ordered : ordered.filter((p) => p.category === filter);
  // Consecutive groups per column count (2 / 3 / 4), balanced by height, last two cards together.
  const starts = {
    two: new Set(columnStarts(visible.length, 2, 170)),
    three: new Set(columnStarts(visible.length, 3, 250)),
    four: new Set(columnStarts(visible.length, 4, 300)),
  };

  // Coming back from a profile: put the catalog at the scroll position it had, in the same
  // commit as the navigation, so the card is already where the page will shrink to.
  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem(RESTORE_SCROLL_KEY);
      if (saved === null) return;
      sessionStorage.removeItem(RESTORE_SCROLL_KEY);
      window.scrollTo({ top: Number(saved), left: 0, behavior: "instant" });
    } catch {
      // Storage can be unavailable (private mode).
    }
  }, []);

  // Scroll reveal is pure CSS (scroll-driven, reversible). This is only the fallback.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || supportsScrollTimeline()) return;
    return observeReveal(Array.from(grid.querySelectorAll<HTMLElement>(".card")), true);
  }, [filter]);

  const select = (id: CategoryId | "todas") => {
    if (id === filter) return;
    setFilter(id);
    setSwapped(true);
  };

  return (
    <section id="emprendedoras" className="catalog">
      <div className="catalog__inner">
        <Reveal>
          <header className="catalog__head">
            <p className="eyebrow">Nuestras emprendedoras</p>
            <h2 className="catalog__title">Toca un perfil para conocer su historia</h2>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <CategoryChips filter={filter} onSelect={select} count={visible.length} />
        </Reveal>

        <div className="grid" key={filter} ref={gridRef} data-swap={swapped ? "" : undefined} onClickCapture={markFromCatalog}>
          {visible.map((p, i) => (
            <ProfileCard
              key={p.slug}
              profile={p}
              index={i}
              categoryLabel={categoryLabel(p.category)}
              startsColumn={{ two: starts.two.has(i), three: starts.three.has(i), four: starts.four.has(i) }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
