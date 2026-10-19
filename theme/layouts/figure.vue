<script setup lang="ts">
defineProps<{
  kicker?: string
  figureTag?: string
}>()
</script>

<template>
  <div class="slidev-layout figure">
    <div class="google-layout-header">
      <div v-if="kicker" class="google-kicker">
        {{ kicker }}
      </div>
      <slot />
    </div>
    <div class="google-figure">
      <span v-if="figureTag" class="google-figure-tag">{{ figureTag }}</span>
      <slot name="figure" />
    </div>
    <div v-if="$slots.source" class="google-source">
      <slot name="source" />
    </div>
  </div>
</template>
