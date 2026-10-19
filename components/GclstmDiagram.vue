<script setup lang="ts">
const props = withDefaults(defineProps<{
  // 0: inputs, 1: + time (LSTM), 2: + space (graph convolution), 3: + output
  stage?: number
}>(), {
  stage: 3,
})

const W = 860
const H = 290

const inputs = [
  { title: '過去的發電功率', sub: '每 15 分鐘一筆' },
  { title: '前兩天的平均出力', sub: '移動平均' },
  { title: '晴空輻照度', sub: '由位置與時間計算' },
]

const cell = { x: 284, y: 26, w: 320, h: 236 }
const inner = { x: 306, y: 140, w: 276, h: 104 }
const nodes = [[332, 212], [360, 188], [390, 220], [418, 194], [372, 232]]
const links = [[0, 1], [1, 2], [2, 3], [1, 3], [0, 4], [4, 2]]
</script>

<template>
  <svg
    class="gclstm"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W"
    :height="H"
    role="img"
    aria-label="GCLSTM 教學簡化圖：輸入、含圖卷積的 LSTM 單元、未來出力"
  >
    <text x="0" y="16" class="heading">輸入（每座電站）</text>
    <g v-for="(item, i) in inputs" :key="item.title">
      <rect x="0" :y="28 + i * 64" width="220" height="54" rx="10" class="chip" />
      <text x="16" :y="51 + i * 64" class="chip-title">{{ item.title }}</text>
      <text x="16" :y="71 + i * 64" class="chip-sub">{{ item.sub }}</text>
    </g>
    <rect x="0" y="232" width="220" height="34" rx="17" class="no-nwp" />
    <text x="110" y="254" class="no-nwp-text">不使用數值天氣預報（NWP）</text>

    <line x1="232" y1="144" x2="270" y2="144" class="arrow" />
    <path d="M262,136 L272,144 L262,152" class="arrow" />

    <rect :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" rx="18" :class="['cell', { lit: props.stage >= 1 }]" />
    <text :x="cell.x + 20" :y="cell.y + 30" class="cell-title">GCLSTM 單元</text>

    <g :class="['layer', { off: props.stage < 1 }]">
      <text :x="cell.x + 20" :y="cell.y + 62" class="part-title">LSTM → 時間變化</text>
      <text :x="cell.x + 20" :y="cell.y + 86" class="part-sub">沿著時間一步步更新「記憶」</text>
      <path
        :d="`M${cell.x + cell.w - 64},${cell.y} C${cell.x + cell.w - 64},${cell.y - 26} ${cell.x + cell.w + 10},${cell.y - 26} ${cell.x + cell.w - 6},${cell.y + 18}`"
        class="loop"
      />
      <path :d="`M${cell.x + cell.w - 16},${cell.y + 10} L${cell.x + cell.w - 6},${cell.y + 20} L${cell.x + cell.w + 2},${cell.y + 8}`" class="loop" />
    </g>

    <g :class="['layer', { off: props.stage < 2 }]">
      <rect :x="inner.x" :y="inner.y" :width="inner.w" :height="inner.h" rx="12" class="inner" />
      <text :x="inner.x + 16" :y="inner.y + 26" class="part-title">圖卷積 → 空間關係</text>
      <line
        v-for="([a, b], i) in links"
        :key="i"
        :x1="nodes[a][0]"
        :y1="nodes[a][1]"
        :x2="nodes[b][0]"
        :y2="nodes[b][1]"
        class="edge"
      />
      <circle v-for="([cx, cy], i) in nodes" :key="i" :cx="cx" :cy="cy" r="6.5" class="node" />
      <text :x="inner.x + 140" :y="inner.y + 60" class="part-sub">每一步更新時，</text>
      <text :x="inner.x + 140" :y="inner.y + 82" class="part-sub">都混合鄰站資訊</text>
    </g>

    <g :class="['layer', { off: props.stage < 3 }]">
      <line :x1="cell.x + cell.w + 12" y1="144" :x2="cell.x + cell.w + 50" y2="144" class="arrow" />
      <path :d="`M${cell.x + cell.w + 42},136 L${cell.x + cell.w + 52},144 L${cell.x + cell.w + 42},152`" class="arrow" />
      <rect x="666" y="92" width="194" height="104" rx="12" class="out" />
      <text x="682" y="124" class="out-title">各站未來 6 小時出力</text>
      <text x="682" y="148" class="out-sub">共 24 步，每步 15 分鐘</text>
      <text x="682" y="176" class="out-sub">一次輸出整段預測</text>
    </g>
  </svg>
</template>

<style scoped>
.gclstm {
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
}

.heading {
  fill: var(--google-muted);
  font-size: 14px;
  font-weight: 600;
}

.chip {
  fill: white;
  stroke: var(--google-border);
  stroke-width: 1.5;
}

.chip-title {
  fill: var(--google-ink);
  font-size: 16px;
  font-weight: 600;
}

.chip-sub,
.part-sub,
.out-sub {
  fill: var(--google-muted);
  font-size: 14px;
}

.no-nwp {
  fill: var(--google-surface);
}

.no-nwp-text {
  fill: var(--google-ink);
  font-size: 14px;
  font-weight: 500;
  text-anchor: middle;
}

.arrow,
.loop {
  fill: none;
  stroke: var(--google-gray);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.loop {
  stroke: var(--google-blue);
  stroke-width: 2.5;
}

.cell {
  fill: white;
  stroke: var(--google-border);
  stroke-width: 2;
  transition: fill 0.5s ease, stroke 0.5s ease;
}

.cell.lit {
  fill: var(--google-blue-soft);
  stroke: var(--google-blue);
}

.cell-title {
  fill: var(--google-ink);
  font-size: 19px;
  font-weight: 700;
}

.part-title {
  fill: var(--google-ink);
  font-size: 16px;
  font-weight: 600;
}

.inner {
  fill: white;
  stroke: var(--google-green-dark);
  stroke-width: 2;
}

.edge {
  stroke: var(--google-gray);
  stroke-width: 2;
}

.node {
  fill: var(--google-green-dark);
  stroke: white;
  stroke-width: 2;
}

.out {
  fill: white;
  stroke: var(--google-blue);
  stroke-width: 2;
}

.out-title {
  fill: var(--google-ink);
  font-size: 17px;
  font-weight: 700;
}

.layer {
  transition: opacity 0.6s ease;
}

.layer.off {
  opacity: 0;
}
</style>
