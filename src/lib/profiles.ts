import profilesJson from "@/data/profiles.json";
import networkJson from "@/data/network.json";
import type { CategoryId, Network, Profile } from "./types";

// Alphabetical by name, ignoring case and accents (Spanish collation).
export const profiles = [...(profilesJson as Profile[])].sort((a, b) =>
  a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
);
export const network = networkJson as Network;

export const categories: { id: CategoryId | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "belleza", label: "Belleza" },
  { id: "gastronomia", label: "Gastronomía" },
  { id: "artesania", label: "Artesanía" },
  { id: "saberes", label: "Saberes" },
];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;
