"use client";

import { useLayoutEffect, useMemo, useSyncExternalStore } from "react";

// One random order per page load, shared by every component that lists profiles. It survives
// client-side navigation (so coming back from a profile shows the same order) but a reload
// reshuffles it.
let cachedOrder: string[] | null = null;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getSnapshot = () => cachedOrder;
const getServerSnapshot = () => null;

/** Fisher-Yates: every permutation is equally likely, so every profile has the same chance of
 *  landing in any position (including the first ones). */
function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function applyOrder<T extends { slug: string }>(items: T[], order: string[]): T[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const ordered = order.flatMap((slug) => bySlug.get(slug) ?? []);
  // Profiles added after the order was cached keep their place at the end.
  const known = new Set(order);
  return [...ordered, ...items.filter((item) => !known.has(item.slug))];
}

/**
 * Random order of `items` for this page load. The server render (and hydration) uses the given
 * order, then the list is shuffled before the first client paint.
 */
export function useShuffled<T extends { slug: string }>(items: T[]): T[] {
  const order = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useLayoutEffect(() => {
    if (cachedOrder && cachedOrder.length === items.length) return;
    cachedOrder = shuffled(items).map((item) => item.slug);
    listeners.forEach((listener) => listener());
  }, [items]);

  return useMemo(() => (order ? applyOrder(items, order) : items), [items, order]);
}
