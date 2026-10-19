<script setup lang="ts">
import { clock, linePath, profiles, sample, scale } from '../utils/solar'

const props = withDefaults(defineProps<{
  // Second state: the cloud drifts toward B and A becomes a clue for B.
  drift?: boolean
}>(), {
  drift: false,
})

const W = 840
const H = 290
const now = 11
const from = 8
const to = 13

const x = scale(from, to, 470, 810)
const ticks = [8, 10, 12]

const charts = [
  { key: 'a', name: 'A 電站', color: 'var(--google-red)', top: 0, note: '已開始下降', profile: profiles.a },
  { key: 'b', name: 'B 電站', color: 'var(--google-blue)', top: 142, note: '仍維持原本出力', profile: profiles.b },
].map((c) => {
  const y = scale(0, 1.05, c.top + 118, c.top + 30)
  return {
    ...c,
    y,
    path: linePath(sample(c.profile, from, now), x, y),
    endY: y(c.profile(now)),
    base: c.top + 118,
  }
})

const [chartA, chartB] = charts
const stations = [
  { name: 'A 電站', x: 96, color: 'var(--google-red)' },
  { name: 'B 電站', x: 272, color: 'var(--google-blue)' },
]
</script>

<template>
  <svg
    class="two-stations"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="A、B 兩座電站與移動中的雲"
  >
    <rect x="0" y="0" width="380" :height="H - 6" rx="16" class="map" />
    <text x="18" y="28" class="muted">雲的移動方向</text>
    <line x1="118" y1="23" x2="170" y2="23" class="wind" />
    <path d="M164,17 L172,23 L164,29" class="wind" />

    <line x1="20" y1="214" x2="360" y2="214" class="ground" />
    <g :class="['cloud-group', { drift: props.drift }]">
      <ellipse cx="96" cy="214" rx="54" ry="11" class="shadow" />
      <g class="cloud">
        <ellipse cx="96" cy="112" rx="62" ry="22" />
        <circle cx="72" cy="100" r="24" />
        <circle cx="108" cy="92" r="30" />
        <circle cx="136" cy="106" r="20" />
      </g>
    </g>

    <g v-for="s in stations" :key="s.name">
      <rect :x="s.x - 20" y="196" width="40" height="18" rx="3" :fill="s.color" />
      <line :x1="s.x - 20" y1="205" :x2="s.x + 20" y2="205" class="panel-line" />
      <text :x="s.x" y="246" class="station">{{ s.name }}</text>
    </g>

    <g :class="['layer', { off: !props.drift }]">
      <path d="M200,150 C228,150 258,166 268,184" class="hint" />
      <path d="M260,178 L268,186 L272,175" class="hint" />
      <text x="190" y="270" class="muted center">如果雲繼續往 B 移動……</text>
    </g>

    <g :class="['layer', { off: !props.drift }]">
      <rect :x="x(now)" :y="chartB.top + 24" :width="x(now + 1) - x(now)" :height="chartB.base - chartB.top - 24" class="window" />
      <text :x="x(now + 0.5)" :y="chartB.base - 14" class="question">?</text>
    </g>

    <g v-for="c in charts" :key="c.key">
      <circle :cx="x(from) + 6" :cy="c.top + 12" r="6" :fill="c.color" />
      <text :x="x(from) + 18" :y="c.top + 17" class="station start">{{ c.name }}</text>
      <line :x1="x(from)" :x2="x(to)" :y1="c.base" :y2="c.base" class="axis" />
      <path :d="c.path" class="curve" :stroke="c.color" />
      <circle :cx="x(now)" :cy="c.endY" r="5.5" :fill="c.color" stroke="white" stroke-width="2.5" />
      <text :x="x(now) + 12" :y="c.endY + 5" class="label">{{ c.note }}</text>
    </g>

    <g :class="['layer', { off: !props.drift }]">
      <path :d="`M${x(now) + 8},${chartA.endY + 12} C${x(now) + 30},${chartA.base} ${x(now + 0.5)},${chartA.base + 4} ${x(now + 0.5)},${chartB.top + 34}`" class="hint" />
      <path :d="`M${x(now + 0.5) - 6},${chartB.top + 27} L${x(now + 0.5)},${chartB.top + 35} L${x(now + 0.5) + 6},${chartB.top + 27}`" class="hint" />
      <text :x="x(now + 0.5) + 14" :y="chartA.base + 22" class="label">線索？</text>
    </g>

    <line :x1="x(now)" :x2="x(now)" :y1="chartA.top + 22" :y2="chartB.base" class="now" />
    <text :x="x(now)" :y="chartA.top + 17" class="label center">現在</text>
    <text v-for="t in ticks" :key="t" :x="x(t)" :y="chartB.base + 22" class="tick">{{ clock(t) }}</text>
  </svg>
</template>

<style scoped>
.two-stations {
  display: block;
  max-width: 100%;
  height: auto;
}

.map {
  fill: #f1f6fe;
}

.muted {
  fill: var(--google-muted);
  font-size: 14px;
  font-weight: 500;
}

.center {
  text-anchor: middle;
}

.wind {
  fill: none;
  stroke: var(--google-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.ground {
  stroke: var(--google-border);
  stroke-width: 2;
}

.cloud {
  fill: #c4c7c5;
}

.shadow {
  fill: var(--google-ink);
  opacity: 0.14;
}

.cloud-group {
  transition: transform 1.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.cloud-group.drift {
  transform: translateX(78px);
}

.panel-line {
  stroke: white;
  stroke-opacity: 0.6;
  stroke-width: 1.5;
}

.station {
  fill: var(--google-ink);
  font-size: 16px;
  font-weight: 600;
  text-anchor: middle;
}

.station.start {
  text-anchor: start;
}

.axis {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.curve {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

.label {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
}

.label.end {
  text-anchor: end;
}

.label.center {
  font-weight: 600;
  text-anchor: middle;
}

.tick {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: middle;
}

.now {
  stroke: var(--google-ink);
  stroke-width: 1.5;
}

.window {
  fill: var(--google-blue-soft);
}

.question {
  fill: var(--google-blue-dark);
  font-size: 34px;
  font-weight: 700;
  text-anchor: middle;
}

.hint {
  fill: none;
  stroke: var(--google-muted);
  stroke-dasharray: 5 5;
  stroke-linecap: round;
  stroke-width: 2;
}

.layer {
  transition: opacity 0.6s ease 0.4s;
}

.layer.off {
  opacity: 0;
  transition-delay: 0s;
}
</style>
