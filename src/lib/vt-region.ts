/**
 * Where the profile photo sits inside the profile page, as insets (in % of the page) that the
 * view transition uses to crop the page snapshot (`object-view-box`) to the photo. That way the
 * page zooms into / out of the photo's own aspect ratio instead of showing a tiny full page.
 *
 * Mirrors the layout in globals.css (.detail, .detail__photo-col, .detail__media).
 */
export function setPhotoRegion(aspectRatio: number) {
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) return;
  const W = window.innerWidth;
  const H = window.innerHeight;
  let left: number;
  let top: number;
  let width: number;
  let height: number;

  if (W < 1139) {
    // Mobile: photo spans the full width at the top.
    left = 0;
    top = 0;
    width = W;
    height = Math.min(W / aspectRatio, H * 0.76);
  } else {
    // Desktop: left column of a 5fr / 6fr grid, below the app bar (28 + 48 + 20).
    const inner = Math.min(W, 1240);
    const colW = ((inner - 128) * 5) / 11;
    left = (W - inner) / 2 + 32;
    top = 96;
    width = colW;
    height = Math.min(colW / aspectRatio, H - 120);
  }

  const pct = (n: number) => `${Math.max(0, n).toFixed(2)}%`;
  const root = document.documentElement.style;
  root.setProperty("--vt-t", pct((top / H) * 100));
  root.setProperty("--vt-l", pct((left / W) * 100));
  root.setProperty("--vt-r", pct(((W - left - width) / W) * 100));
  root.setProperty("--vt-b", pct(((H - top - height) / H) * 100));
}
