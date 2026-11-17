"use client";

import { useRouter } from "next/navigation";
import { setPhotoRegion } from "@/lib/vt-region";
import { MaterialIcon } from "./Icons";

/** Set when a catalog card is opened: the catalog scroll position to come back to. */
export const FROM_CATALOG_KEY = "raices:from-catalog";
/** Set right before leaving a profile: tells the catalog to restore that scroll position. */
export const RESTORE_SCROLL_KEY = "raices:restore-scroll";

/**
 * Leaves the profile with an explicit navigation (type `nav-back`) so React runs the view
 * transition in reverse: the whole page scales back down into its catalog card. The browser's
 * own back button does not start a view transition, which is why this is not `router.back()`.
 */
export default function BackButton({ variant = "icon" }: { variant?: "icon" | "dock" }) {
  const router = useRouter();

  const goBack = () => {
    let scrollY: string | null = null;
    try {
      scrollY = sessionStorage.getItem(FROM_CATALOG_KEY);
      sessionStorage.removeItem(FROM_CATALOG_KEY);
      if (scrollY !== null) sessionStorage.setItem(RESTORE_SCROLL_KEY, scrollY);
    } catch {
      // Storage can be unavailable (private mode); use the fallback below.
    }

    const root = document.documentElement;
    const profile = document.querySelector<HTMLElement>(".profile");
    if (profile) setPhotoRegion(Number(getComputedStyle(profile).getPropertyValue("--ar")));
    // The profile keeps its scroll position on every viewport: nothing is reset before leaving.
    root.classList.add("is-leaving");
    // Safety net: never leave the scroll effects disabled if the navigation is interrupted.
    window.setTimeout(() => root.classList.remove("is-leaving"), 1500);

    if (scrollY !== null) router.replace("/", { scroll: false, transitionTypes: ["nav-back"] });
    else router.push("/#emprendedoras", { transitionTypes: ["nav-back"] });
  };

  return (
    <button
      type="button"
      className={variant === "dock" ? "dock__btn dock__btn--back" : "icon-btn"}
      onClick={goBack}
      aria-label="Volver al catálogo"
      title="Volver"
    >
      <MaterialIcon name="arrow_back" />
    </button>
  );
}
