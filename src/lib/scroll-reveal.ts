/**
 * Browsers with scroll-driven animations (animation-timeline: view()) handle reveals in CSS,
 * which is reversible and runs off the main thread. This JS path is only a fallback for the rest.
 */
export function supportsScrollTimeline() {
  return typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
}

/**
 * Adds `is-in` when an element enters the viewport (staggered in reading order) and removes it
 * when the element goes back below the viewport, so scrolling up plays the animation in reverse.
 */
export function observeReveal(elements: HTMLElement[], stagger: boolean) {
  if (typeof IntersectionObserver === "undefined") {
    for (const el of elements) el.classList.add("is-in");
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
        .sort((a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft);
      entering.forEach((el, i) => {
        el.style.setProperty("--d", stagger ? `${Math.min(i * 120, 960)}ms` : "0ms");
        el.classList.add("is-in");
      });

      for (const e of entries) {
        const viewportHeight = e.rootBounds?.height ?? window.innerHeight;
        if (!e.isIntersecting && e.boundingClientRect.top > viewportHeight / 2) {
          (e.target as HTMLElement).style.setProperty("--d", "0ms");
          e.target.classList.remove("is-in");
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  for (const el of elements) observer.observe(el);
  return () => observer.disconnect();
}
