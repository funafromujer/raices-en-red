import type { CSSProperties } from "react";
import type { Theme } from "./types";

/** Maps a profile's generated Material 3 scheme onto the --md-* CSS tokens. */
export function themeVars(theme: Theme): CSSProperties {
  return {
    "--md-primary": theme.primary,
    "--md-on-primary": theme.onPrimary,
    "--md-primary-container": theme.primaryContainer,
    "--md-on-primary-container": theme.onPrimaryContainer,
    "--md-secondary-container": theme.secondaryContainer,
    "--md-on-secondary-container": theme.onSecondaryContainer,
    "--md-surface": theme.surface,
    "--md-surface-container-low": theme.surfaceContainerLow,
    "--md-surface-container": theme.surfaceContainer,
    "--md-surface-container-high": theme.surfaceContainerHigh,
    "--md-on-surface": theme.onSurface,
    "--md-on-surface-variant": theme.onSurfaceVariant,
    "--md-outline-variant": theme.outlineVariant,
  } as CSSProperties;
}
