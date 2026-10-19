<script setup lang="ts">
import { bandPath, clock, linePath, profiles, sample, scale } from '../utils/solar'

const props = withDefaults(defineProps<{
  // Show the dispatcher's side: the supply plan for now vs. one hour later.
  plan?: boolean
}>(), {
  plan: false,
})

const W = 840
const H = 270
const now = 11
const from = 9
const to = 13
const base = 228

const x = scale(from, to, 20, 380)
const y = scale(0, 1.05, base, 48)
const ticks = [9, 10, 11, 12, 13]
const spread = (t: number) => 0.03 + 0.09 * (t - now)
const actual = linePath(sample(profiles.b, from, now), x, y)
const forecast = linePath(sample(profiles.bForecast, now, now + 1), x, y)
const band = bandPath(
  sample(t => profiles.bForecast(t) + spread(t), now, now + 1),
  sample(t => profiles.bForecast(t) - spread(t), now, now + 1),
  x,
  y,
)

// Supply stacks, in units of the demand line (1 = demand).
const colH = 168
const columns = [
  { label: '現在', x: 588, solar: 0.42 },
  { label: '一小時後', x: 728, solar: 0.16 },
]
const pv = (share: number) => share * colH
const minOther = 1 - columns[0].solar
</script>

<template>
  <svg
    class="dispatch"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="預估發電下降時，調度人員提前安排其他電源"
  >
    <text x="20" y="18" class="title">發電量預估</text>
    <rect :x="x(now)" y="40" :width="x(now + 1) - x(now)" :height="base - 40" class="window" />
    <line :x1="x(from)" :x2="x(to)" :y1="base" :y2="base" class="axis" />
    <path :d="actual" class="pv-line" />
    <path :d="band" class="band" />
    <path :d="forecast" class="pv-line dashed" />
    <line :x1="x(now)" :x2="x(now)" y1="30" :y2="base" class="now" />
    <text :x="x(now) - 8" y="40" class="small end">現在</text>
    <text :x="x(now) + 8" y="58" class="small">一小時後</text>
    <text :x="x(11.85) + 18" :y="y(profiles.bForecast(11.85)) + 30" class="label">預估出力下降</text>
    <text v-for="t in ticks" :key="t" :x="x(t)" :y="base + 22" class="tick">{{ clock(t) }}</text>

    <g :class="['layer', { off: !props.plan }]">
      <line x1="414" y1="138" x2="482" y2="138" class="arrow" />
      <path d="M474,130 L484,138 L474,146" class="arrow" />
      <text x="448" y="122" class="small center">提前告知</text>

      <text x="540" y="18" class="title">調度人員安排供電</text>
      <line x1="540" x2="822" :y1="base - colH" :y2="base - colH" class="demand" />
      <text x="822" :y="base - colH - 8" class="small end">用電需求</text>

      <g v-for="(c, i) in columns" :key="c.label">
        <rect :x="c.x" :y="base - pv(c.solar)" width="72" :height="pv(c.solar)" rx="3" class="solar" />
        <rect :x="c.x" :y="base - colH" width="72" :height="pv(minOther) - 2" rx="3" class="other" />
        <rect
          v-if="i === 1"
          :x="c.x"
          :y="base - colH + pv(minOther)"
          width="72"
          :height="pv(1 - minOther - c.solar) - 2"
          rx="3"
          class="extra"
        />
        <text :x="c.x + 36" :y="base + 22" class="tick">{{ c.label }}</text>
      </g>
      <text :x="columns[0].x + 36" :y="base - pv(columns[0].solar) / 2 + 5" class="in-bar">太陽光電</text>
      <text :x="columns[0].x + 36" :y="base - colH + pv(minOther) / 2 + 5" class="in-bar">其他電源</text>
      <text x="806" :y="base - colH + pv(minOther) + 26" class="small">提前</text>
      <text x="806" :y="base - colH + pv(minOther) + 44" class="small">準備</text>
    </g>
  </svg>
</template>

<style scoped>
.dispatch {
  display: block;
  max-width: 100%;
  height: auto;
}

.title {
  fill: var(--google-muted);
  font-size: 14px;
  font-weight: 600;
}

.window {
  fill: var(--google-blue-soft);
}

.axis {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.pv-line {
  fill: none;
  stroke: var(--google-blue);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

.pv-line.dashed {
  stroke-dasharray: 7 6;
}

.band {
  fill: var(--google-blue);
  opacity: 0.16;
}

.now {
  stroke: var(--google-ink);
  stroke-width: 1.5;
}

.label {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
}

.small {
  fill: var(--google-ink);
  font-size: 14px;
  font-weight: 600;
}

.small.end {
  text-anchor: end;
}

.small.center {
  text-anchor: middle;
}

.tick {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: middle;
}

.arrow {
  fill: none;
  stroke: var(--google-gray);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.demand {
  stroke: var(--google-ink);
  stroke-width: 1.5;
}

.solar {
  fill: var(--google-blue);
}

.other {
  fill: var(--google-gray);
}

.extra {
  fill: var(--google-gray);
  opacity: 0.45;
}

.in-bar {
  fill: white;
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
}

.layer {
  transition: opacity 0.6s ease;
}

.layer.off {
  opacity: 0;
}
</style>
