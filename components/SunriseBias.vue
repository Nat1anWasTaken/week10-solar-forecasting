<script setup lang="ts">
import { bandPath, clearSky, clock, linePath, sample, scale } from '../utils/solar'

const W = 470
const H = 320
const from = 3
const to = 18.5
const base = 250
const x = scale(from, to, 8, W - 8)
const y = scale(0, 1, base, 60)
const ticks = [6, 9, 12, 15, 18]

// A cloudy day, and a 6-hour-ahead forecast that only "sees" the day once output is non-zero.
const actual = (t: number) => 0.3 * clearSky(t) * (1 + 0.08 * Math.sin(3.1 * t))
const highGuess = (t: number) => 0.8 * clearSky(t)
const corrected = (t: number) => 1.12 * actual(t)
function forecast(t: number) {
  const k = Math.min(1, Math.max(0, (t - 11.8) / 0.9))
  return (1 - k) * highGuess(t) + k * corrected(t)
}

const actualPath = linePath(sample(actual, from, to), x, y)
const forecastPath = linePath(sample(forecast, from, to), x, y)
const gap = bandPath(sample(forecast, 6, 12.6), sample(actual, 6, 12.6), x, y)
</script>

<template>
  <svg
    class="sunrise-bias"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="多雲日：提前 6 小時的預測在日出後高估出力的概念示意"
  >
    <g class="legend">
      <line x1="0" x2="28" y1="14" y2="14" class="actual" />
      <text x="36" y="19">實際出力（多雲日）</text>
      <line x1="196" x2="224" y1="14" y2="14" class="forecast" />
      <text x="232" y="19">提前 6 小時的預測</text>
    </g>

    <rect :x="x(from)" y="44" :width="x(6) - x(from)" :height="base - 44" class="night" />
    <text :x="(x(from) + x(6)) / 2" y="70" class="note center">夜間</text>
    <text :x="(x(from) + x(6)) / 2" y="92" class="note center">發電為 0</text>
    <line :x1="x(6)" :x2="x(6)" y1="44" :y2="base" class="sunrise" />
    <text :x="x(6) + 6" y="58" class="note">日出</text>

    <path :d="gap" class="gap" />
    <line :x1="x(from)" :x2="x(to)" :y1="base" :y2="base" class="axis" />
    <path :d="actualPath" class="actual" />
    <path :d="forecastPath" class="forecast" />

    <text :x="x(9.9)" :y="y(0.36)" class="note center">高估</text>
    <line :x1="x(12.4)" :y1="y(forecast(12.4)) - 8" :x2="x(13.25)" y2="104" class="leader" />
    <text :x="x(13.4)" y="78" class="note">收到當天出力後</text>
    <text :x="x(13.4)" y="98" class="note">才開始修正</text>

    <text v-for="t in ticks" :key="t" :x="x(t)" :y="base + 22" class="tick">{{ clock(t) }}</text>
    <text x="0" :y="H - 6" class="caption">依原文 Fig. 7(b) 的文字描述重繪，非原始數據</text>
  </svg>
</template>

<style scoped>
.sunrise-bias {
  display: block;
  max-width: 100%;
  height: auto;
}

.legend text {
  fill: var(--google-ink);
  font-size: 14px;
  font-weight: 500;
}

.night {
  fill: var(--google-surface);
}

.sunrise {
  stroke: var(--google-yellow);
  stroke-width: 2.5;
}

.axis {
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.actual,
.forecast {
  fill: none;
  stroke: var(--google-blue);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

.forecast {
  stroke-dasharray: 7 6;
}

.gap {
  fill: var(--google-red);
  opacity: 0.14;
}

.leader {
  stroke: var(--google-muted);
  stroke-width: 1.25;
}

.note {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
}

.note.center {
  text-anchor: middle;
}

.tick {
  fill: var(--google-muted);
  font-size: 13px;
  text-anchor: middle;
}

.caption {
  fill: var(--google-muted);
  font-size: 12px;
}
</style>
