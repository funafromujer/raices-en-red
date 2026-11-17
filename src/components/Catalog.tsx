"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { categories, categoryLabel } from "@/lib/profiles";
import { observeReveal, supportsScrollTimeline } from "@/lib/scroll-reveal";
import { useShuffled } from "@/lib/shuffle";
import { setPhotoRegion } from "@/lib/vt-region";
import type { CategoryId, Profile } from "@/lib/types";
import { FROM_CATALOG_KEY, RESTORE_SCROLL_KEY } from "./BackButton";
import { MaterialIcon } from "./Icons";
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
          <div className="chips" role="tablist" aria-label="Filtrar por categoría">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                className={`chip${filter === c.id ? " is-active" : ""}`}
                onClick={() => select(c.id)}
              >
                <span className="chip__check" aria-hidden="true">
                  <MaterialIcon name="check" />
                </span>
                {c.label}
              </button>
            ))}
            <span className="chips__count" aria-live="polite">
              {visible.length} {visible.length === 1 ? "perfil" : "perfiles"}
            </span>
          </div>
        </Reveal>

        <div className="grid" key={filter} ref={gridRef} data-swap={swapped ? "" : undefined} onClickCapture={markFromCatalog}>
          {visible.map((p, i) => (
            <ProfileCard key={p.slug} profile={p} index={i} categoryLabel={categoryLabel(p.category)} />
          ))}
        </div>
      </div>
    </section>
  );
}
