export type CategoryId = "belleza" | "gastronomia" | "artesania" | "saberes";

/** Material 3 light scheme generated from the profile photo (dynamic color). */
export interface Theme {
  seed: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  surface: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  onSurface: string;
  onSurfaceVariant: string;
  outlineVariant: string;
}

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export interface Contact {
  lead: string;
  whatsapp: string | null;
  whatsappLabel: string | null;
  instagram: string | null;
  notes: string[];
}

export interface Profile {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  role: string;
  story: string;
  activity: string;
  price: string | null;
  quote: string | null;
  contact: Contact | null;
  photo: ImageAsset;
  product: ImageAsset | null;
  theme: Theme;
}

export interface Network {
  name: string;
  title: string;
  paragraphs: string[];
}
