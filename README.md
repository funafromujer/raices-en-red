# Raíces en Red

Catalog of women entrepreneur profiles from Puerto Tejada (Cauca, Colombia), an initiative of
[Funamujer](https://funamujer.org). Built with Next.js (App Router) and TypeScript.

- The catalog grid is filterable by category. Each profile is a full page (`/perfil/[slug]`) with a back
  button; the card photo morphs into the page hero using React View Transitions, and the page uses a
  palette extracted from the profile photo.
- Profiles are listed in a random order on every page load (Fisher-Yates), so each one has the same
  chance of appearing first; the order stays stable while navigating to a profile and back.
- The product/service photo is shown in the detail when the entrepreneur has one.
- Header and mobile menu follow the Funamujer site design (glass pill on desktop, bottom bar + sheet on mobile).
- Profiles are statically generated routes, so they can be shared and work with the browser back button.

## Development

```bash
pnpm install
pnpm dev
```

## Content

Profiles live in `src/data/profiles.json` (texts, contact, category and the Material 3 color scheme
generated from each photo) and `src/data/network.json` (intro text). Their optimized images are in
`public/profiles/` and `public/products/`. To add or edit a profile, edit the JSON and drop the WebP
photos in those folders.

`pnpm build:data` (`scripts/build-data.mjs`) is the original importer from an Excel file plus photo
folders. It expects a `Raíces en Red Contexto IA/` folder at the repo root (not included).
