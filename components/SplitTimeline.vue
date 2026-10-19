<script setup lang="ts">
import { clearSky, clock, cloud, linePath, profiles, sample, scale } from '../utils/solar'

const props = withDefaults(defineProps<{
  // 0: train/test split · 1: zoom into one forecast in 2017 · 2: score it against the actual output
  stage?: number
}>(), {
  stage: 0,
})

const W = 900
const H = 330
const half = W / 2

// Year strip; the highlighted slice is one day in 2017 that the panel below zooms into.
const strip = { top: 0, height: 46 }
const sliceX = half + 3 + (half - 3) * (135 / 365)

// Zoomed panel: one test day, forecast issued at NOW for the next 6 hours.
const NOW = 13
const STEP = 0.25
const NIGHT = 18.25
const T0 = 5
const T1 = 19
const panel = { top: 112, bottom: 282, left: 20, right: W - 20 }
const x = scale(T0, T1, panel.left, panel.right)
const y = scale(0, 1.08, panel.bottom, panel.top + 20)

const actual = (t: number) => profiles.b(t) * cloud(t, 15.3, 0.4, 0.45)
const base = (t: number) => 0.92 * clearSky(t) * cloud(t, 15.7, 0.7, 0.22)
const forecast = (t: number) => Math.max(0, base(t) + (actual(NOW) - base(NOW)) * Math.exp(-2 * (t - NOW)))

const past = linePath(sample(actual, T0, NOW), x, y)
const future = linePath(sample(actual, NOW, T1), x, y)
const predicted = linePath(sample(forecast, NOW, T1), x, y)

const steps = Array.from({ length: 24 }, (_, i) => NOW + STEP * (i + 1))
const scored = steps.filter(t => t < NIGHT)
const ticks = [6, 9, 12, 15, 18]
</script>

<template>
  <svg
    class="split-timeline"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="2016 年訓練、2017 年測試，並放大 2017 年其中一天的預測與評分方式"
  >
    <!-- Year strip -->
    <rect x="0" :y="strip.top" :width="half - 3" :height="strip.height" rx="10" class="train" />
    <rect :x="half + 3" :y="strip.top" :width="half - 3" :height="strip.height" rx="10" class="test" />
    <text x="18" :y="strip.top + 30" class="bar-text"><tspan class="yr">2016</tspan>　訓練：模型從這一年學習</text>
    <text :x="half + 21" :y="strip.top + 30" class="bar-text"><tspan class="yr">2017</tspan>　測試：模型沒看過，拿來出題</text>

    <!-- Zoom from one 2017 day into the panel -->
    <g class="layer" :class="{ off: props.stage < 1 }">
      <rect :x="sliceX - 4" :y="strip.top - 4" width="8" :height="strip.height + 8" rx="3" class="slice" />
      <path
        :d="`M${sliceX - 4},${strip.height + 4} L${panel.left},${panel.top - 8} M${sliceX + 4},${strip.height + 4} L${panel.right},${panel.top - 8}`"
        class="zoom"
      />
      <text :x="sliceX + 12" :y="strip.height + 24" class="muted">2017 年的某一天</text>
    </g>

    <!-- Zoomed panel -->
    <g class="layer" :class="{ off: props.stage < 1 }">
      <rect :x="x(NOW)" :y="panel.top" :width="x(T1) - x(NOW)" :height="panel.bottom - panel.top" class="window" />
      <rect :x="x(NIGHT)" :y="panel.top" :width="x(T1) - x(NIGHT)" :height="panel.bottom - panel.top" class="night" />
      <line
        v-for="t in steps"
        :key="t"
        :x1="x(t)"
        :x2="x(t)"
        :y1="panel.top"
        :y2="panel.top + 7"
        class="step"
      />
      <text :x="x(NOW) + 8" :y="panel.top + 24" class="window-label">預測接下來 6 小時：每 15 分鐘一步，共 24 步</text>
      <text :x="(x(T0) + x(NOW)) / 2" :y="panel.top + 24" class="muted center">模型看得到的過去</text>

      <line :x1="panel.left" :x2="panel.right" :y1="panel.bottom" :y2="panel.bottom" class="axis" />
      <g v-for="t in ticks" :key="t">
        <line :x1="x(t)" :x2="x(t)" :y1="panel.bottom" :y2="panel.bottom + 5" class="axis" />
        <text :x="x(t)" :y="panel.bottom + 20" class="tick">{{ clock(t) }}</text>
      </g>

      <path :d="past" class="actual" />
      <path :d="predicted" class="forecast" />
      <text :x="x(16.4) + 6" :y="y(forecast(16.4)) - 12" class="label blue">模型預測</text>

      <line :x1="x(NOW)" :x2="x(NOW)" :y1="panel.top - 6" :y2="panel.bottom" class="now" />
      <text :x="x(NOW) - 8" :y="panel.top + 4" class="now-label">現在</text>
    </g>

    <!-- Scoring: reveal the actual output and the per-step errors -->
    <g class="layer" :class="{ off: props.stage < 2 }">
      <line
        v-for="t in scored"
        :key="t"
        :x1="x(t)"
        :x2="x(t)"
        :y1="y(forecast(t))"
        :y2="y(actual(t))"
        class="error"
      />
      <path :d="future" class="answer" />
      <text :x="x(15.3) + 4" :y="y(actual(15.3)) + 22" class="label green">實際出力（答案）</text>
      <text :x="x(12.2)" :y="y(0.2)" class="label red end">紅線＝每一步的誤差</text>
      <text :x="(x(NIGHT) + x(T1)) / 2" :y="panel.bottom - 12" class="muted center small">夜間</text>
      <text :x="(x(NIGHT) + x(T1)) / 2" :y="panel.bottom - 30" class="muted center small">不計分</text>
      <text x="0" :y="H - 2" class="footer">
        「現在」在 2017 年每 15 分鐘往後移一次、304 座電站各考一遍，誤差彙整起來就是下一頁的 NRMSE。
      </text>
    </g>
  </svg>
</template>

<style scoped>
.split-timeline {
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
  font-family: inherit;
}

.layer {
  transition: opacity 0.5s ease;
}

.layer.off {
  opacity: 0;
}

.train {
  fill: var(--google-blue);
}

.test {
  fill: var(--google-green-dark);
}

.bar-text {
  fill: white;
  font-size: 16px;
  font-weight: 500;
}

.yr {
  font-size: 20px;
  font-weight: 700;
}

.slice {
  fill: var(--google-yellow);
  stroke: white;
  stroke-width: 2;
}

.zoom {
  fill: none;
  stroke: var(--google-gray);
  stroke-width: 1.25;
  stroke-dasharray: 4 4;
}

.window {
  fill: var(--google-blue-soft);
}

.night {
  fill: var(--google-surface);
}

.step {
  stroke: var(--google-blue);
  stroke-width: 1.5;
}

.window-label {
  fill: var(--google-blue-dark);
  font-size: 14px;
  font-weight: 600;
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

.actual,
.answer,
.forecast {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

.actual {
  stroke: var(--google-gray);
}

.answer {
  stroke: var(--google-green-dark);
}

.forecast {
  stroke: var(--google-blue);
  stroke-dasharray: 7 6;
}

.error {
  stroke: var(--google-red);
  stroke-width: 2;
}

.now {
  stroke: var(--google-ink);
  stroke-width: 1.5;
}

.now-label {
  fill: var(--google-ink);
  font-size: 14px;
  font-weight: 600;
  text-anchor: end;
}

.label {
  font-size: 15px;
  font-weight: 600;
}

.label.blue {
  fill: var(--google-blue-dark);
}

.label.green {
  fill: var(--google-green-dark);
}

.label.red {
  fill: var(--google-red);
}

.label.end {
  text-anchor: end;
}

.muted {
  fill: var(--google-muted);
  font-size: 14px;
}

.center {
  text-anchor: middle;
}

.small {
  font-size: 12px;
}

.footer {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
}
</style>
