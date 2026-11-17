// Different heights give the masonry grid its rhythm; the pattern repeats along the list.
// Each pair is [width, height] of the photo frame (the CSS aspect-ratio is width / height).
const RATIOS: [number, number][] = [
  [4, 4.6],
  [4, 5.8],
  [1, 1],
  [4, 5.2],
  [5, 5],
  [4, 6],
  [1, 1.1],
  [4, 4.8],
  [5, 5.6],
  [4, 5.4],
];

/** CSS aspect-ratio of the photo frame of the card at `index`. */
export const cardAspect = (index: number) => {
  const [w, h] = RATIOS[index % RATIOS.length];
  return `${w} / ${h}`;
};

// Approximate height of the name/role caption plus the gap below each card, in px.
const CAPTION = 110;

const cardHeight = (index: number, columnWidth: number) => {
  const [w, h] = RATIOS[index % RATIOS.length];
  return (columnWidth * h) / w + CAPTION;
};

/**
 * Splits `count` cards (in reading order) into `columns` consecutive groups, one per column, so
 * the columns end up as even as possible. Cards fill each column top to bottom, then the next
 * column. The last column always keeps at least two cards, so the last two cards are never
 * separated into different columns.
 *
 * Returns the indexes of the cards that start a new column (never 0).
 */
export function columnStarts(count: number, columns: number, columnWidth: number): number[] {
  if (count < 3 || columns < 2) return [];
  const groups = Math.min(columns, count - 1);

  const prefix = [0];
  for (let i = 0; i < count; i++) prefix.push(prefix[i] + cardHeight(i, columnWidth));
  const sum = (from: number, to: number) => prefix[to] - prefix[from];

  // best[g][j]: smallest possible tallest column when the first j cards fill g columns.
  const best: number[][] = Array.from({ length: groups + 1 }, () => Array(count + 1).fill(Infinity));
  const from: number[][] = Array.from({ length: groups + 1 }, () => Array(count + 1).fill(0));
  for (let j = 1; j <= count; j++) best[1][j] = sum(0, j);

  for (let g = 2; g <= groups; g++) {
    const last = g === groups;
    for (let j = g; j <= count; j++) {
      if (last && j !== count) continue;
      const maxStart = last ? count - 2 : j - 1; // last column keeps two or more cards
      for (let i = g - 1; i <= maxStart; i++) {
        const tallest = Math.max(best[g - 1][i], sum(i, j));
        if (tallest < best[g][j]) {
          best[g][j] = tallest;
          from[g][j] = i;
        }
      }
    }
  }

  const starts: number[] = [];
  let j = count;
  for (let g = groups; g >= 2; g--) {
    const i = from[g][j];
    starts.unshift(i);
    j = i;
  }
  return starts;
}
