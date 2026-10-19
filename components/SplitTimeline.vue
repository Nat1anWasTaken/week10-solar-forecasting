<script setup lang="ts">
const W = 860
const H = 196
const mid = W / 2
const facts = ['304 座電站', '每 15 分鐘一筆', '預測 15 分鐘～6 小時後', '夜間不計入誤差']
const refits = Array.from({ length: 26 }, (_, i) => mid + 6 + i * ((W - mid - 12) / 25))
</script>

<template>
  <div class="split-timeline">
    <ul class="facts">
      <li v-for="f in facts" :key="f">
        {{ f }}
      </li>
    </ul>
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" role="img" aria-label="2016 年訓練、2017 年測試的時間軸">
      <text x="0" y="16" class="heading">GCLSTM</text>
      <rect x="0" y="28" :width="mid - 3" height="52" rx="10" class="train" />
      <rect :x="mid + 3" y="28" :width="mid - 3" height="52" rx="10" class="test" />
      <text x="20" y="61" class="bar-text">2016　訓練（Training）</text>
      <text :x="mid + 23" y="61" class="bar-text">2017　測試（Testing）</text>
      <text x="0" y="106" class="note">模型從這一年的資料學習</text>
      <text :x="mid + 3" y="106" class="note">用模型沒看過的一年，檢驗預測準不準</text>

      <text x="0" y="158" class="heading">比較基準 STAR</text>
      <line :x1="mid + 3" :x2="W" y1="152" y2="152" class="rail" />
      <line v-for="(x, i) in refits" :key="i" :x1="x" :x2="x" y1="145" y2="159" class="tick" />
      <text :x="mid + 3" y="184" class="note small">訓練方式不同：用最近 2 個月的資料擬合，每 2 週重新估計一次</text>
    </svg>
  </div>
</template>

<style scoped>
.split-timeline {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1.1rem;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.facts li {
  margin: 0;
  padding: 0.3rem 0.9rem;
  border: 1px solid var(--google-border);
  border-radius: 99px;
  background: var(--google-surface);
  color: var(--google-ink);
  font-size: 16px;
  font-weight: 600;
}

svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.heading {
  fill: var(--google-muted);
  font-size: 14px;
  font-weight: 600;
}

.train {
  fill: var(--google-blue);
}

.test {
  fill: var(--google-green-dark);
}

.bar-text {
  fill: white;
  font-size: 18px;
  font-weight: 600;
}

.note {
  fill: var(--google-ink);
  font-size: 15px;
}

.note.small {
  fill: var(--google-muted);
  font-size: 14px;
}

.rail {
  stroke: var(--google-border);
  stroke-width: 2;
}

.tick {
  stroke: var(--google-gray);
  stroke-width: 2;
}
</style>
