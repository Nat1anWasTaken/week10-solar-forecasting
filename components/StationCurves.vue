<script setup lang="ts">
import { clock, linePath, profiles, sample, scale } from '../utils/solar'

const props = withDefaults(defineProps<{
  // Show the reference lines that line up each station's dip.
  aligned?: boolean
}>(), {
  aligned: false,
})

const W = 480
const H = 344
const from = 8
const to = 15
const x = scale(from, to, 78, W - 12)
const ticks = [8, 10, 12, 14]
const rowH = 84
const firstRow = 50

const rows = [
  { name: 'A 電站', color: 'var(--google-red)', profile: profiles.a, dip: 10.9 },
  { name: 'B 電站', color: 'var(--google-blue)', profile: profiles.b, dip: 11.75 },
  { name: 'C 電站', color: 'var(--google-green-dark)', profile: profiles.c, dip: 12.6 },
].map((r, i) => {
  const top = firstRow + i * (rowH + 8)
  const base = top + rowH
  const y = scale(0, 1.05, base, top + 6)
  return { ...r, top, base, path: linePath(sample(r.profile, from, to), x, y), dipY: y(r.profile(r.dip)) }
})

const bottom = rows[rows.length - 1].base
</script>

<template>
  <svg
    class="station-curves"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="A、B、C 三座電站在同一時間軸上的發電曲線"
  >
    <g :class="['layer', { off: !props.aligned }]">
      <text :x="(x(rows[0].dip) + x(rows[2].dip)) / 2" y="16" class="label center">雲依序經過 A → B → C</text>
      <line :x1="x(rows[0].dip)" :x2="x(rows[2].dip) - 4" y1="30" y2="30" class="arrow" />
      <path :d="`M${x(rows[2].dip) - 10},24 L${x(rows[2].dip) - 2},30 L${x(rows[2].dip) - 10},36`" class="arrow" />
      <line
        v-for="r in rows"
        :key="r.name"
        :x1="x(r.dip)"
        :x2="x(r.dip)"
        :y1="38"
        :y2="bottom"
        :stroke="r.color"
        class="guide"
      />
    </g>

    <g v-for="r in rows" :key="r.name">
      <circle cx="8" :cy="r.top + rowH / 2" r="6" :fill="r.color" />
      <text x="20" :y="r.top + rowH / 2 + 5" class="label">{{ r.name }}</text>
      <line :x1="x(from)" :x2="x(to)" :y1="r.base" :y2="r.base" class="axis" />
      <path :d="r.path" :stroke="r.color" class="curve" />
      <circle
        :class="['layer', { off: !props.aligned }]"
        :cx="x(r.dip)"
        :cy="r.dipY"
        r="5.5"
        :fill="r.color"
        stroke="white"
        stroke-width="2.5"
      />
    </g>

    <text v-for="t in ticks" :key="t" :x="x(t)" :y="bottom + 22" class="tick">{{ clock(t) }}</text>
  </svg>
</template>

<style scoped>
.station-curves {
  display: block;
  max-width: 100%;
  height: auto;
}

.axis {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.curve {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.guide {
  stroke-width: 1.5;
  stroke-opacity: 0.75;
}

.arrow {
  fill: none;
  stroke: var(--google-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.label {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 600;
}

.label.center {
  font-weight: 500;
  text-anchor: middle;
}

.tick {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: middle;
}

.layer {
  transition: opacity 0.6s ease;
}

.layer.off {
  opacity: 0;
}
</style>
