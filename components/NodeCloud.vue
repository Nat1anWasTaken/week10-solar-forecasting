<script setup lang="ts">
import { mulberry32 } from '../utils/solar'

const props = withDefaults(defineProps<{
  expanded?: boolean
}>(), {
  expanded: false,
})

const W = 480
const H = 330
const cx = W / 2
const cy = H / 2 + 18

const highlighted = [
  { label: 'A', x: cx - 70, y: cy + 8, color: 'var(--google-red)' },
  { label: 'B', x: cx, y: cy + 8, color: 'var(--google-blue)' },
  { label: 'C', x: cx + 70, y: cy + 8, color: 'var(--google-green-dark)' },
]

// Clustered like the paper's map: denser where more people live, sparse elsewhere.
const clusters = [
  [0.24, 0.42, 0.1],
  [0.42, 0.36, 0.12],
  [0.6, 0.3, 0.1],
  [0.78, 0.34, 0.09],
  [0.36, 0.62, 0.1],
  [0.66, 0.56, 0.12],
  [0.88, 0.6, 0.07],
]

function points(count: number) {
  const rand = mulberry32(304)
  const out: { x: number, y: number, delay: number }[] = []
  while (out.length < count) {
    let u: number, v: number
    if (rand() < 0.25) {
      u = rand()
      v = rand()
    }
    else {
      const [mx, my, s] = clusters[Math.floor(rand() * clusters.length)]
      const r = Math.sqrt(-2 * Math.log(rand() + 1e-9)) * s
      const a = 2 * Math.PI * rand()
      u = mx + r * Math.cos(a)
      v = my + r * Math.sin(a) * 0.8
    }
    const px = 16 + u * (W - 32)
    const py = 56 + v * (H - 80)
    const inside = ((px - cx) / (W / 2 - 10)) ** 2 + ((py - cy) / (H / 2 - 30)) ** 2 <= 1
    // Keep each highlighted node and its label free of dots.
    const clear = highlighted.every(h => Math.hypot(h.x - px, h.y - py) > 16
      && !(Math.abs(h.x - px) < 14 && py < h.y && py > h.y - 38))
    if (inside && clear)
      out.push({ x: px, y: py, delay: rand() * 1.1 })
  }
  return out
}

const others = points(301)
</script>

<template>
  <svg
    class="node-cloud"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="從 3 座電站擴展到 304 座電站的示意分布"
  >
    <text x="4" y="40" :class="['count', { off: props.expanded }]">3 座</text>
    <text x="4" y="40" :class="['count', { off: !props.expanded }]">304 座</text>

    <g :class="['others', { on: props.expanded }]">
      <circle
        v-for="(p, i) in others"
        :key="i"
        :cx="p.x"
        :cy="p.y"
        r="3.6"
        :style="{ transitionDelay: props.expanded ? `${p.delay}s` : '0s' }"
      />
    </g>

    <g v-for="h in highlighted" :key="h.label">
      <circle :cx="h.x" :cy="h.y" r="10" :fill="h.color" stroke="white" stroke-width="3" />
      <text :x="h.x" :y="h.y - 18" class="node-label">{{ h.label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.node-cloud {
  display: block;
  max-width: 100%;
  height: auto;
}

.count {
  fill: var(--google-blue-dark);
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.03em;
  transition: opacity 0.6s ease;
}

.count.off {
  opacity: 0;
}

.others circle {
  fill: var(--google-blue);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.others.on circle {
  opacity: 0.5;
}

.node-label {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
}
</style>
