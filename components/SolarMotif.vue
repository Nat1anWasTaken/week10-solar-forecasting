<script setup lang="ts">
import { bandPath, linePath, profiles, sample, scale } from '../utils/solar'

const W = 360
const H = 190
const now = 13
const x = scale(5.5, 18.75, 0, W)
const y = scale(0, 1, H - 10, 50)
const spread = (t: number) => 0.03 + 0.05 * (t - now)
const past = linePath(sample(profiles.bYesterday, 5.5, now), x, y)
const future = linePath(sample(profiles.bYesterday, now, 18.75), x, y)
const band = bandPath(
  sample(t => profiles.bYesterday(t) + spread(t), now, 18.75),
  sample(t => Math.max(0, profiles.bYesterday(t) - spread(t)), now, 18.75),
  x,
  y,
)
const dots = sample(profiles.bYesterday, 6.5, now, 0.5)
</script>

<template>
  <svg class="solar-motif" :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" aria-hidden="true">
    <circle :cx="x(15.6)" cy="34" r="20" class="sun" />
    <line x1="0" :x2="W" :y1="H - 10" :y2="H - 10" class="axis" />
    <path :d="band" class="band" />
    <path :d="past" class="line" />
    <path :d="future" class="line dashed" />
    <circle v-for="([t, p], i) in dots" :key="i" :cx="x(t)" :cy="y(p)" r="3.5" class="dot" />
  </svg>
</template>

<style scoped>
.solar-motif {
  position: absolute;
  right: 3.2rem;
  bottom: 3.4rem;
  z-index: -1;
}

.sun {
  fill: var(--google-yellow);
}

.axis {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.line {
  fill: none;
  stroke: var(--google-blue);
  stroke-linecap: round;
  stroke-width: 3.5;
}

.line.dashed {
  stroke-dasharray: 7 6;
}

.band {
  fill: var(--google-blue);
  opacity: 0.14;
}

.dot {
  fill: var(--google-blue);
  stroke: white;
  stroke-width: 2;
}
</style>
