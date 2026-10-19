<script setup lang="ts">
import { scale } from '../utils/solar'

interface Bar {
  label: string
  sub: string
  value: number
  color: string
}

const props = withDefaults(defineProps<{
  bars: Bar[]
  // How many bars are revealed, left to right.
  shown?: number
  max?: number
  step?: number
  title?: string
  subtitle?: string
}>(), {
  shown: Infinity,
  max: 12,
  step: 3,
})

const W = 440
const H = 340
const base = 270
const top = 76
const y = scale(0, props.max, base, top)
const grid = Array.from({ length: props.max / props.step + 1 }, (_, i) => i * props.step)
const slot = (W - 56) / props.bars.length
const barW = 64
const cx = (i: number) => 56 + slot * (i + 0.5)

function column(i: number, v: number) {
  const x = cx(i) - barW / 2
  const yTop = y(v)
  const r = 4
  return `M${x},${base}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + barW - r}Q${x + barW},${yTop} ${x + barW},${yTop + r}V${base}Z`
}
</script>

<template>
  <svg
    class="bar-compare"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    :aria-label="props.title"
  >
    <text x="0" y="20" class="title">{{ props.title }}</text>
    <text x="0" y="44" class="subtitle">{{ props.subtitle }}</text>

    <g v-for="g in grid" :key="g">
      <line x1="48" :x2="W" :y1="y(g)" :y2="y(g)" :class="g === 0 ? 'baseline' : 'grid'" />
      <text x="40" :y="y(g) + 5" class="tick">{{ g }}%</text>
    </g>

    <g v-for="(b, i) in props.bars" :key="b.label" :class="['bar', { off: i >= props.shown }]">
      <path :d="column(i, b.value)" :fill="b.color" />
      <text :x="cx(i)" :y="y(b.value) - 12" class="value">{{ b.value.toFixed(2) }}%</text>
      <text :x="cx(i)" :y="base + 28" class="label">{{ b.label }}</text>
      <text :x="cx(i)" :y="base + 50" class="sub">{{ b.sub }}</text>
    </g>
  </svg>
</template>

<style scoped>
.bar-compare {
  display: block;
  max-width: 100%;
  height: auto;
}

.title {
  fill: var(--google-ink);
  font-size: 17px;
  font-weight: 600;
}

.subtitle {
  fill: var(--google-muted);
  font-size: 14px;
}

.grid {
  stroke: #eceff1;
  stroke-width: 1;
}

.baseline {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.tick {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: end;
}

.bar {
  transition: opacity 0.5s ease;
}

.bar path {
  transform-box: fill-box;
  transform-origin: bottom;
  transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar.off {
  opacity: 0;
}

.bar.off path {
  transform: scaleY(0);
}

.value {
  fill: var(--google-ink);
  font-size: 22px;
  font-weight: 700;
  text-anchor: middle;
}

.label {
  fill: var(--google-ink);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
}

.sub {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: middle;
}
</style>
