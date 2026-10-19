<script setup lang="ts">
import { mulberry32 } from '../utils/solar'

const props = withDefaults(defineProps<{
  // 0: stations only, 1: nearest-neighbour edges, 2: learned edge weights
  stage?: number
}>(), {
  stage: 2,
})

const W = 840
const H = 300
const panelW = 360
const panelH = 220
const rightX = W - panelW

const sites = [
  [0.08, 0.3],
  [0.22, 0.12],
  [0.3, 0.5],
  [0.14, 0.78],
  [0.45, 0.26],
  [0.53, 0.7],
  [0.64, 0.12],
  [0.71, 0.46],
  [0.83, 0.82],
  [0.9, 0.24],
  [0.38, 0.9],
  [0.95, 0.6],
].map(([u, v]) => ({ x: 24 + u * (panelW - 48), y: 48 + v * (panelH - 52) }))

// Each station links to its two nearest neighbours; the union keeps edges symmetric.
const edgeKeys = new Set<string>()
sites.forEach((s, i) => {
  sites
    .map((t, j) => ({ j, d: Math.hypot(s.x - t.x, s.y - t.y) }))
    .filter(n => n.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .forEach(({ j }) => edgeKeys.add([Math.min(i, j), Math.max(i, j)].join('-')))
})

const rand = mulberry32(7)
const edges = [...edgeKeys].map((k) => {
  const [a, b] = k.split('-').map(Number)
  return { a: sites[a], b: sites[b], w: 0.15 + 0.85 * rand() }
})
</script>

<template>
  <svg
    class="graph-build"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="把電站的真實位置轉換成節點與連線構成的圖"
  >
    <text x="0" y="18" class="title">電站的真實位置</text>
    <rect x="0" y="28" :width="panelW" :height="panelH" rx="16" class="map" />
    <path d="M10,190 C80,150 120,210 190,170 S300,120 350,150" class="contour" />
    <path d="M10,110 C70,80 150,130 220,96 S320,70 350,84" class="contour" />
    <g v-for="(s, i) in sites" :key="i">
      <rect :x="s.x - 10" :y="s.y - 6" width="20" height="12" rx="2" class="panel" />
    </g>
    <text x="0" :y="H - 22" class="caption">每一座電站 → 圖上的一個節點（node）</text>
    <text x="0" :y="H - 2" class="caption muted">連線代表資料上的關係，不是輸電線路</text>

    <line :x1="panelW + 22" :x2="rightX - 26" :y1="28 + panelH / 2" :y2="28 + panelH / 2" class="arrow" />
    <path :d="`M${rightX - 34},${20 + panelH / 2} L${rightX - 24},${28 + panelH / 2} L${rightX - 34},${36 + panelH / 2}`" class="arrow" />

    <text :x="rightX" y="18" class="title">轉換成圖（Graph）</text>
    <rect :x="rightX" y="28" :width="panelW" :height="panelH" rx="16" class="panel-bg" />
    <g :transform="`translate(${rightX}, 0)`">
      <line
        v-for="(e, i) in edges"
        :key="i"
        :x1="e.a.x"
        :y1="e.a.y"
        :x2="e.b.x"
        :y2="e.b.y"
        :class="['edge', { off: props.stage < 1 }]"
        :style="props.stage >= 2
          ? { strokeWidth: 1.5 + 6 * e.w, stroke: 'var(--google-blue)', strokeOpacity: 0.3 + 0.6 * e.w }
          : {}"
      />
      <circle v-for="(s, i) in sites" :key="i" :cx="s.x" :cy="s.y" r="8" class="node" />
    </g>
    <text :x="rightX" :y="H - 22" :class="['caption', 'step', { off: props.stage < 1 }]">① 先依地理距離，連接最近的鄰站</text>
    <text :x="rightX" :y="H - 2" :class="['caption', 'step', { off: props.stage < 2 }]">② 訓練時再調整連線權重（越粗＝影響越大）</text>
  </svg>
</template>

<style scoped>
.graph-build {
  display: block;
  max-width: 100%;
  height: auto;
}

.title {
  fill: var(--google-muted);
  font-size: 14px;
  font-weight: 600;
}

.map {
  fill: #f1f6fe;
}

.panel-bg {
  fill: var(--google-surface);
}

.contour {
  fill: none;
  stroke: #c9d8f5;
  stroke-width: 2;
}

.panel {
  fill: var(--google-blue-dark);
}

.arrow {
  fill: none;
  stroke: var(--google-gray);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.edge {
  stroke: var(--google-gray);
  stroke-linecap: round;
  stroke-width: 2;
  transition: opacity 0.6s ease, stroke-width 0.8s ease, stroke 0.8s ease, stroke-opacity 0.8s ease;
}

.edge.off,
.step.off {
  opacity: 0;
}

.node {
  fill: var(--google-blue);
  stroke: white;
  stroke-width: 3;
}

.caption {
  fill: var(--google-ink);
  font-size: 15px;
  font-weight: 500;
}

.caption.muted {
  fill: var(--google-muted);
}

.step {
  transition: opacity 0.6s ease;
}
</style>
