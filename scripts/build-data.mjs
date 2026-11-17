// Builds src/data/*.json and optimized images in public/ from the context folder
// (Excel + photos). Run with: pnpm build:data
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";
import XLSX from "xlsx";

// The ESM build of this package is not Node-compatible; load the CommonJS one.
const m3 = createRequire(import.meta.url)("@material/material-color-utilities");

const ROOT = process.cwd();
const CTX = path.join(ROOT, "Raíces en Red Contexto IA");
const PHOTO_DIR = path.join(CTX, "FOTO");
const PRODUCT_DIR = path.join(CTX, "FOTO PRODUCTO");
const OUT_DATA = path.join(ROOT, "src", "data");
const OUT_PROFILES = path.join(ROOT, "public", "profiles");
const OUT_PRODUCTS = path.join(ROOT, "public", "products");
const OUT_BRAND = path.join(ROOT, "public", "brand");

// The Excel has no category column; categories follow the reference catalog.
const CATEGORY_BY_SLUG = {
  "amalfi-cuenca": "saberes",
  "yuliana-andrea-cadavid": "belleza",
  "diana-marcela-moreno-gomez": "artesania",
  "rocio-cuenca-viafara": "gastronomia",
  "marolin-yaritza-martinez-cuenca": "gastronomia",
  "niyiret-martinez-cuenca": "belleza",
  "jina-rodriguez": "saberes",
  "yomaly-andrea-mejia": "saberes",
  "alexandra-cuenca-caicedo": "artesania",
  "maria-isabel-ordonez-bonilla": "gastronomia",
};

const norm = (s) => s.normalize("NFC").trim().toLowerCase();
const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function indexDir(dir) {
  const map = new Map();
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f);
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext.toLowerCase())) continue;
    map.set(norm(path.basename(f, ext)), path.join(dir, f));
  }
  return map;
}

// ---------- color helpers ----------
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const hex = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`;
}

const isSkin = (h, s, l) => h >= 4 && h <= 45 && s >= 0.2 && s <= 0.85 && l >= 0.15 && l <= 0.72;

async function extractTheme(file) {
  const { data, info } = await sharp(file)
    .rotate()
    .resize(96, 96, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Background: average of the outer ring (sides and top). Accent: hue histogram
  // weighted by saturation, with skin tones down-weighted.
  let br = 0;
  let bg = 0;
  let bb = 0;
  let bn = 0;
  const bins = Array.from({ length: 24 }, () => ({ wgt: 0, r: 0, g: 0, b: 0 }));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const edge = x < w * 0.12 || x > w * 0.88 || y < h * 0.1;
      if (edge && y < h * 0.7) {
        br += r;
        bg += g;
        bb += b;
        bn++;
      }
      const [hh, ss, ll] = rgbToHsl(r, g, b);
      if (ss < 0.28 || ll < 0.2 || ll > 0.85) continue;
      let wgt = ss * (1 - Math.abs(ll - 0.5));
      if (isSkin(hh, ss, ll)) wgt *= 0.03;
      const bin = bins[Math.floor(hh / 15) % 24];
      bin.wgt += wgt;
      bin.r += r * wgt;
      bin.g += g * wgt;
      bin.b += b * wgt;
    }
  }
  const [bh, bs] = rgbToHsl(br / bn, bg / bn, bb / bn);
  const top = bins.reduce((a, c) => (c.wgt > a.wgt ? c : a), bins[0]);
  let ah;
  let as;
  if (top.wgt > 0.5) {
    [ah, as] = rgbToHsl(top.r / top.wgt, top.g / top.wgt, top.b / top.wgt);
  } else {
    [ah, as] = [bh, Math.max(bs, 0.35)];
  }
  const accS = Math.min(0.78, Math.max(as, 0.45));

  // Material 3 dynamic color: a tonal-spot scheme generated from the photo's accent hue.
  const seed = hslToHex(ah, accS, 0.4);
  const theme = m3.themeFromSourceColor(m3.argbFromHex(seed));
  const light = theme.schemes.light;
  const neutral = theme.palettes.neutral;
  const hex = m3.hexFromArgb;
  return {
    seed,
    primary: hex(light.primary),
    onPrimary: hex(light.onPrimary),
    primaryContainer: hex(light.primaryContainer),
    onPrimaryContainer: hex(light.onPrimaryContainer),
    secondaryContainer: hex(light.secondaryContainer),
    onSecondaryContainer: hex(light.onSecondaryContainer),
    surface: hex(neutral.tone(98)),
    surfaceContainerLow: hex(neutral.tone(96)),
    surfaceContainer: hex(neutral.tone(94)),
    surfaceContainerHigh: hex(neutral.tone(92)),
    onSurface: hex(light.onSurface),
    onSurfaceVariant: hex(light.onSurfaceVariant),
    outlineVariant: hex(light.outlineVariant),
  };
}

// ---------- description parsing ----------
function parseDescription(text) {
  const blocks = text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const [tagline, role, ...rest] = blocks;
  let contactBlock = null;
  const body = [];
  for (const b of rest) {
    if (/(WhatsApp|Instagram)\s*:\s*[@\d]/i.test(b) && !/^precios?/i.test(b)) contactBlock = b;
    else body.push(b);
  }
  const priceIdx = body.findIndex((b) => /\$\s?\d/.test(b) || /^precios?\b/i.test(b));
  const price = priceIdx >= 0 ? body.splice(priceIdx, 1)[0] : null;
  const [story, activity, ...more] = body;
  const quote = more.length ? more[more.length - 1] : null;

  let contact = null;
  if (contactBlock) {
    const wa = contactBlock.match(/WhatsApp\s*:\s*([\d ]{10,})/i);
    const ig = contactBlock.match(/Instagram\s*:\s*@?([\w.]+)/i);
    const clean = (s) => s.replace(/[^\p{L}\p{N}\s.,:@$¿?¡!()/-]/gu, "").trim();
    const lead = clean(contactBlock.split(/\n|WhatsApp|Instagram/i)[0]);
    const notes = contactBlock
      .split("\n")
      .map(clean)
      .filter((l) => l && !/whatsapp|instagram/i.test(l) && l !== lead);
    contact = {
      lead: lead.replace(/:$/, ""),
      whatsapp: wa ? wa[1].replace(/\s/g, "") : null,
      whatsappLabel: wa ? wa[1].trim() : null,
      instagram: ig ? ig[1] : null,
      notes,
    };
  }
  return { tagline, role, story, activity, price, quote, contact };
}

// ---------- main ----------
async function main() {
  fs.mkdirSync(OUT_DATA, { recursive: true });
  for (const d of [OUT_PROFILES, OUT_PRODUCTS, OUT_BRAND]) fs.mkdirSync(d, { recursive: true });

  const wb = XLSX.readFile(path.join(CTX, "Raíces en Red.xlsx"));
  const rows = XLSX.utils
    .sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: null })
    .slice(1)
    .filter((r) => r[0] && r[1]);

  const photos = indexDir(PHOTO_DIR);
  const products = indexDir(PRODUCT_DIR);

  const [intro, ...people] = rows;
  const introBlocks = String(intro[1])
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const [introTitle, ...introRest] = introBlocks[0].split("\n");
  const network = {
    name: String(intro[0]).trim(),
    title: introTitle.trim(),
    paragraphs: [...introRest, ...introBlocks.slice(1)].map((s) => s.trim()).filter(Boolean),
  };

  const profiles = [];
  for (const row of people) {
    const name = String(row[0]).trim();
    const slug = slugify(name);
    const parsed = parseDescription(String(row[1]));

    const photoSrc = row[2] ? photos.get(norm(String(row[2]))) : null;
    if (!photoSrc) throw new Error(`No portrait for ${name}`);
    const photoInfo = await sharp(photoSrc)
      .rotate()
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(OUT_PROFILES, `${slug}.webp`));
    const theme = await extractTheme(photoSrc);

    let product = null;
    const prodSrc = row[3] ? products.get(norm(String(row[3]))) : null;
    if (prodSrc) {
      const info = await sharp(prodSrc)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(OUT_PRODUCTS, `${slug}.webp`));
      product = { src: `/products/${slug}.webp`, width: info.width, height: info.height };
    }

    const category = CATEGORY_BY_SLUG[slug];
    if (!category) throw new Error(`No category for ${slug}`);

    profiles.push({
      slug,
      name,
      category,
      ...parsed,
      photo: { src: `/profiles/${slug}.webp`, width: photoInfo.width, height: photoInfo.height },
      product,
      theme,
    });
    console.log(`ok ${name} [${category}]${product ? " + product" : ""} seed=${theme.seed}`);
  }

  fs.writeFileSync(path.join(OUT_DATA, "profiles.json"), JSON.stringify(profiles, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DATA, "network.json"), JSON.stringify(network, null, 2) + "\n");

  // Brand assets
  await sharp(path.join(PHOTO_DIR, "funamujer-logo-white-512-1.png")).png().toFile(path.join(OUT_BRAND, "funamujer-logo-white.png"));
  await sharp(path.join(PHOTO_DIR, "RAICES EN RED.svg"), { density: 192 })
    .resize({ width: 900 })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_BRAND, "raices-en-red.webp"));
  console.log(`Done: ${profiles.length} profiles`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
