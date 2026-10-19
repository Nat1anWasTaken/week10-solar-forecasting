<script setup lang="ts">
const props = withDefaults(defineProps<{
  width?: number
  height?: number
  covered?: boolean
}>(), {
  width: 480,
  height: 168,
})

const sun = { x: 120, y: 52 }
const panel = { x: 400, y: 120 }
const rays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)
const beams = [-14, 0, 14]
</script>

<template>
  <svg
    class="cloud-scene"
    :viewBox="`0 0 ${props.width} ${props.height}`"
    :width="props.width"
    :height="props.height"
    role="img"
    aria-label="太陽、雲與太陽能板的示意圖"
  >
    <rect x="0" y="0" :width="props.width" :height="props.height - 22" rx="16" class="sky" />

    <g :class="['beams', { dim: props.covered }]">
      <line
        v-for="d in beams"
        :key="d"
        :x1="sun.x + 18"
        :y1="sun.y + 14 + d * 0.4"
        :x2="panel.x - 20 + d"
        :y2="panel.y - 8 + d * 0.3"
      />
    </g>

    <g class="sun">
      <line
        v-for="a in rays"
        :key="a"
        :x1="sun.x + Math.cos(a) * 30"
        :y1="sun.y + Math.sin(a) * 30"
        :x2="sun.x + Math.cos(a) * 40"
        :y2="sun.y + Math.sin(a) * 40"
      />
      <circle :cx="sun.x" :cy="sun.y" r="22" />
    </g>

    <g class="panel">
      <polygon :points="`${panel.x - 42},${panel.y + 18} ${panel.x + 46},${panel.y + 18} ${panel.x + 30},${panel.y - 18} ${panel.x - 26},${panel.y - 18}`" />
      <line :x1="panel.x - 34" :y1="panel.y" :x2="panel.x + 38" :y2="panel.y" />
      <line :x1="panel.x - 13" :y1="panel.y + 18" :x2="panel.x - 7" :y2="panel.y - 18" />
      <line :x1="panel.x + 13" :y1="panel.y + 18" :x2="panel.x + 11" :y2="panel.y - 18" />
      <rect :x="panel.x - 3" :y="panel.y + 18" width="6" height="10" class="stand" />
    </g>

    <g :class="['cloud', { covered: props.covered }]">
      <ellipse cx="0" cy="12" rx="58" ry="20" />
      <circle cx="-22" cy="2" r="22" />
      <circle cx="12" cy="-6" r="28" />
      <circle cx="38" cy="8" r="18" />
    </g>

    <text x="16" :y="props.height - 4" :class="['caption', { off: props.covered }]">日照充足 → 出力高</text>
    <text x="16" :y="props.height - 4" :class="['caption', { off: !props.covered }]">雲遮住陽光 → 日照下降 → 出力下降</text>
  </svg>
</template>

<style scoped>
.cloud-scene {
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
}

.sky {
  fill: #f1f6fe;
}

.sun circle {
  fill: var(--google-yellow);
}

.sun line,
.beams line {
  stroke: var(--google-yellow);
  stroke-linecap: round;
  stroke-width: 3;
}

.beams {
  opacity: 0.9;
  transition: opacity 1s ease 0.6s;
}

.beams line {
  stroke-dasharray: 4 7;
}

.beams.dim {
  opacity: 0.18;
}

.panel polygon {
  fill: var(--google-blue-dark);
}

.panel line {
  stroke: white;
  stroke-opacity: 0.55;
  stroke-width: 1.5;
}

.stand {
  fill: var(--google-muted);
}

.cloud {
  fill: #c4c7c5;
  transform: translate(62px, 110px);
  opacity: 0.55;
  transition: transform 1.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.6s ease;
}

.cloud.covered {
  transform: translate(262px, 84px);
  opacity: 1;
}

.caption {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
  transition: opacity 0.5s ease;
}

.caption.off {
  opacity: 0;
}
</style>
