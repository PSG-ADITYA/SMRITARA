/**
 * Mulberry32 32-bit PRNG for deterministic, reproducible cognitive game puzzles.
 */
export function createSeededRandom(seed?: number | string): () => number {
  let s: number;
  if (typeof seed === 'string') {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
    }
    s = hash >>> 0;
  } else if (typeof seed === 'number') {
    s = seed >>> 0;
  } else {
    s = Math.floor(Math.random() * 0xffffffff) >>> 0;
  }

  // Ensure non-zero state
  if (s === 0) s = 1;

  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(min: number, max: number, rng: () => number = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Shuffles an array in place using Fisher-Yates and a provided RNG
 */
export function shuffleArray<T>(array: T[], rng: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Picks a random item from an array
 */
export function pickRandom<T>(array: T[], rng: () => number = Math.random): T {
  const idx = Math.floor(rng() * array.length);
  return array[idx];
}

/**
 * Samples N unique items from an array without replacement
 */
export function sampleMultiple<T>(array: T[], count: number, rng: () => number = Math.random): T[] {
  const shuffled = shuffleArray(array, rng);
  return shuffled.slice(0, Math.min(count, array.length));
}
