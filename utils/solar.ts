// Illustrative PV output profiles shared by the deck's figures.
// These are hand-tuned shapes for teaching, not data from any real plant.

export type Profile = (t: number) => number
export type Sample = [t: number, p: number]

export const DAY_START = 5
export const DAY_END = 19

const SUNRISE = 6
const SUNSET = 18.25

/** Bell-shaped clear-sky output, normalized to 1 at solar noon. */
export function clearSky(t: number) {
  if (t <= SUNRISE || t >= SUNSET)
    return 0
  return Math.sin(Math.PI * (t - SUNRISE) / (SUNSET - SUNRISE)) ** 1.35
}

/** A cloud passing over a site: a Gaussian dip in output. */
export function cloud(t: number, center: number, width: number, depth: number) {
  return 1 - depth * Math.exp(-(((t - center) / width) ** 2))
}

/** Small deterministic ripple so the curves do not look machine-drawn. */
function ripple(t: number, seed: number) {
  return 1 + 0.018 * Math.sin(9.1 * t + seed) + 0.012 * Math.sin(23.7 * t + 2 * seed)
}

// One cloud drifts west to east and reaches A, then B, then C.
export const profiles = {
  a: (t: number) => 0.88 * clearSky(t) * cloud(t, 10.9, 0.32, 0.6) * ripple(t, 2),
  b: (t: number) => 0.92 * clearSky(t) * cloud(t, 11.75, 0.32, 0.62) * ripple(t, 1),
  c: (t: number) => 0.95 * clearSky(t) * cloud(t, 12.6, 0.32, 0.58) * ripple(t, 3),
  bYesterday: (t: number) => 0.95 * clearSky(t) * ripple(t, 4),
  bTwoDaysAgo: (t: number) => 0.84 * clearSky(t) * cloud(t, 14.6, 0.7, 0.35) * ripple(t, 5),
  bForecast: (t: number) => 0.92 * clearSky(t) * cloud(t, 11.85, 0.36, 0.5) * ripple(t, 1),
} satisfies Record<string, Profile>

export function sample(profile: Profile, from: number, to: number, step = 1 / 12): Sample[] {
  const points: Sample[] = []
  for (let t = from; t < to + step / 2; t += step)
    points.push([Math.min(t, to), profile(Math.min(t, to))])
  return points
}

export function scale(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + (v - d0) / (d1 - d0) * (r1 - r0)
}

type Scale = (v: number) => number

export function linePath(points: Sample[], x: Scale, y: Scale) {
  return points
    .map(([t, p], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(p).toFixed(1)}`)
    .join('')
}

/** Closed area between an upper and a lower series sampled on the same times. */
export function bandPath(upper: Sample[], lower: Sample[], x: Scale, y: Scale) {
  return `${linePath(upper, x, y)}${linePath([...lower].reverse(), x, y).replace(/^M/, 'L')}Z`
}

export function clock(t: number) {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Seeded PRNG so scattered node layouts stay identical between renders. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
