<script setup lang="ts">
import { computed, useId } from 'vue'
import { bandPath, clearSky, clock, DAY_END, DAY_START, linePath, profiles, sample, scale } from '../utils/solar'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
  now?: number
  horizon?: number
  // The actual curve is revealed up to this time; animates when it changes.
  until?: number
  window?: boolean
  question?: boolean
  reference?: boolean
  history?: boolean
  forecast?: boolean
  dipNote?: string
}>(), {
  width: 820,
  height: 280,
  now: 11,
  horizon: 1,
  until: DAY_END,
})

const clipId = `power-curve-${useId()}`
const m = { top: 42, right: 20, bottom: 30, left: 20 }

const x = computed(() => scale(DAY_START, DAY_END, m.left, props.width - m.right))
const y = computed(() => scale(0, 1.08, props.height - m.bottom, m.top))
const baseline = computed(() => props.height - m.bottom)
const ticks = [6, 9, 12, 15, 18]

const actual = computed(() => linePath(sample(profiles.b, DAY_START, DAY_END), x.value, y.value))
const reference = computed(() => linePath(sample(t => 0.92 * clearSky(t), DAY_START, DAY_END), x.value, y.value))
const yesterday = computed(() => linePath(sample(profiles.bYesterday, DAY_START, DAY_END), x.value, y.value))
const twoDaysAgo = computed(() => linePath(sample(profiles.bTwoDaysAgo, DAY_START, DAY_END), x.value, y.value))

const forecastEnd = computed(() => props.now + props.horizon)
const spread = (t: number) => 0.03 + 0.09 * (t - props.now) / props.horizon
const forecastLine = computed(() => linePath(sample(profiles.bForecast, props.now, forecastEnd.value), x.value, y.value))
const forecastBand = computed(() => bandPath(
  sample(t => profiles.bForecast(t) + spread(t), props.now, forecastEnd.value),
  sample(t => Math.max(0, profiles.bForecast(t) - spread(t)), props.now, forecastEnd.value),
  x.value,
  y.value,
))

const nowX = computed(() => x.value(props.now))
const nowY = computed(() => y.value(profiles.b(props.now)))
const windowX = computed(() => x.value(forecastEnd.value))
const dipT = 11.75
</script>

<template>
  <svg
    class="power-curve"
    :viewBox="`0 0 ${props.width} ${props.height}`"
    :width="props.width"
    :height="props.height"
    role="img"
    aria-label="電站一天的發電功率曲線"
  >
    <defs>
      <clipPath :id="clipId">
        <rect x="0" y="0" :height="props.height" :style="{ width: `${x(props.until)}px` }" class="reveal" />
      </clipPath>
    </defs>

    <text :x="m.left" :y="m.top - 18" class="axis-title">發電功率</text>

    <g class="layer" :class="{ off: !props.window }">
      <rect :x="nowX" :y="m.top - 6" :width="windowX - nowX" :height="baseline - m.top + 6" class="window" />
      <text :x="nowX + 8" :y="m.top - 18" class="window-label">一小時後</text>
      <text
        class="question layer"
        :class="{ off: !props.question }"
        :x="(nowX + windowX) / 2"
        :y="(m.top + baseline) / 2 + 14"
      >?</text>
    </g>

    <g class="layer" :class="{ off: !props.reference }">
      <path :d="reference" class="reference" />
      <text :x="x(12.1)" :y="y(0.92) - 10" class="label muted">晴天時</text>
    </g>

    <g class="layer" :class="{ off: !props.history }">
      <path :d="twoDaysAgo" class="ghost faint" />
      <path :d="yesterday" class="ghost" />
      <text :x="x(16.2) + 12" :y="y(profiles.bYesterday(16.2))" class="label muted start">昨天</text>
      <text :x="x(14.6)" :y="y(profiles.bTwoDaysAgo(14.6)) + 24" class="label muted">前天</text>
    </g>

    <line :x1="m.left" :x2="props.width - m.right" :y1="baseline" :y2="baseline" class="axis" />
    <g v-for="t in ticks" :key="t">
      <line :x1="x(t)" :x2="x(t)" :y1="baseline" :y2="baseline + 5" class="axis" />
      <text :x="x(t)" :y="props.height - 6" class="tick">{{ clock(t) }}</text>
    </g>

    <path :d="actual" class="actual" :clip-path="`url(#${clipId})`" />

    <g class="layer" :class="{ off: !props.forecast }">
      <path :d="forecastBand" class="band" />
      <path :d="forecastLine" class="forecast" />
      <text :x="windowX + 10" :y="y(profiles.bForecast(forecastEnd)) + 5" class="label">模型預測</text>
    </g>

    <g class="layer" :class="{ off: !props.dipNote }">
      <line :x1="x(dipT)" :y1="y(profiles.b(dipT)) + 8" :x2="x(dipT) + 34" :y2="y(0.16)" class="leader" />
      <text :x="x(dipT) + 40" :y="y(0.16) + 5" class="label">{{ props.dipNote }}</text>
    </g>

    <line :x1="nowX" :x2="nowX" :y1="m.top - 26" :y2="baseline" class="now" />
    <text :x="nowX - 8" :y="m.top - 18" class="now-label">現在</text>
    <circle
      class="layer"
      :class="{ off: props.until > props.now }"
      :cx="nowX"
      :cy="nowY"
      r="6"
      fill="var(--google-blue)"
      stroke="white"
      stroke-width="2.5"
    />
  </svg>
</template>

<style scoped>
.power-curve {
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
  font-family: inherit;
}

.reveal {
  transition: width 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.layer {
  transition: opacity 0.5s ease;
}

.layer.off {
  opacity: 0;
}

.axis {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.tick {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: middle;
}

.axis-title {
  fill: var(--google-muted);
  font-size: 13px;
  font-weight: 500;
}

.window {
  fill: var(--google-blue-soft);
}

.window-label {
  fill: var(--google-blue-dark);
  font-size: 15px;
  font-weight: 600;
}

.question {
  fill: var(--google-blue-dark);
  font-size: 40px;
  font-weight: 700;
  text-anchor: middle;
}

.actual,
.ghost,
.forecast,
.reference {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.actual {
  stroke: var(--google-blue);
  stroke-width: 3.5;
}

.ghost {
  stroke: var(--google-gray);
  stroke-width: 2.5;
}

.ghost.faint {
  stroke: #c4c7c5;
}

.reference {
  stroke: var(--google-gray);
  stroke-width: 2;
  stroke-dasharray: 1 6;
}

.forecast {
  stroke: var(--google-blue);
  stroke-width: 3.5;
  stroke-dasharray: 7 6;
}

.band {
  fill: var(--google-blue);
  opacity: 0.16;
}

.label {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
}

.label.muted {
  fill: var(--google-muted);
  text-anchor: middle;
}

.label.muted.start {
  text-anchor: start;
}

.leader {
  stroke: var(--google-muted);
  stroke-width: 1.25;
}

.now {
  stroke: var(--google-ink);
  stroke-width: 1.5;
}

.now-label {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 600;
  text-anchor: end;
}
</style>
