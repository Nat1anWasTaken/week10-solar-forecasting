<script setup lang="ts">
import { bandPath, linePath, profiles, sample, scale } from '../utils/solar'

const props = defineProps<{
  kind: 'history' | 'model' | 'forecast'
}>()

const W = 220
const H = 84

const x = scale(7, 16, 4, W - 4)
const lanes = [
  { color: 'var(--google-red)', profile: profiles.a },
  { color: 'var(--google-blue)', profile: profiles.b },
  { color: 'var(--google-green-dark)', profile: profiles.c },
].map((l, i) => ({ ...l, path: linePath(sample(l.profile, 7, 16), x, scale(0, 1, 24 + i * 28, 4 + i * 28)) }))

const fy = scale(0, 1.05, H - 4, 6)
const spread = (t: number) => 0.03 + 0.05 * (t - 11)
const past = linePath(sample(profiles.b, 7, 11), x, fy)
const future = linePath(sample(profiles.bForecast, 11, 16), x, fy)
const band = bandPath(
  sample(t => profiles.bForecast(t) + spread(t), 11, 16),
  sample(t => Math.max(0, profiles.bForecast(t) - spread(t)), 11, 16),
  x,
  fy,
)

const nodes = [[40, 22], [92, 14], [150, 26], [196, 46], [66, 62], [124, 58], [176, 74]]
const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [6, 3], [1, 5]]
</script>

<template>
  <svg class="flow-glyph" :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" aria-hidden="true">
    <template v-if="props.kind === 'history'">
      <path v-for="l in lanes" :key="l.color" :d="l.path" :stroke="l.color" class="line" />
    </template>
    <template v-else-if="props.kind === 'model'">
      <line
        v-for="([a, b], i) in edges"
        :key="i"
        :x1="nodes[a][0]"
        :y1="nodes[a][1]"
        :x2="nodes[b][0]"
        :y2="nodes[b][1]"
        class="edge"
      />
      <circle v-for="([cx, cy], i) in nodes" :key="i" :cx="cx" :cy="cy" r="7" class="node" />
    </template>
    <template v-else>
      <line :x1="x(11)" :x2="x(11)" y1="0" :y2="H" class="now" />
      <path :d="band" class="band" />
      <path :d="past" stroke="var(--google-blue)" class="line" />
      <path :d="future" stroke="var(--google-blue)" class="line dashed" />
    </template>
  </svg>
</template>

<style scoped>
.flow-glyph {
  display: block;
  width: 100%;
  height: auto;
  margin: 0.2rem 0 0.6rem;
}

.line {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.5;
}

.line.dashed {
  stroke-dasharray: 6 5;
}

.band {
  fill: var(--google-blue);
  opacity: 0.16;
}

.now {
  stroke: var(--google-ink);
  stroke-width: 1.25;
}

.edge {
  stroke: var(--google-gray);
  stroke-width: 2;
}

.node {
  fill: var(--google-blue);
  stroke: white;
  stroke-width: 2.5;
}
</style>
