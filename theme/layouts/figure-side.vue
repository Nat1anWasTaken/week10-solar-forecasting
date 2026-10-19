<script setup lang="ts">
const props = withDefaults(defineProps<{
  kicker?: string
  figureTag?: string
  figureWidth?: string
}>(), {
  figureWidth: '56%',
})
</script>

<template>
  <div class="slidev-layout figure-side" :style="{ '--google-figure-width': props.figureWidth }">
    <div class="google-figure-text">
      <div v-if="props.kicker" class="google-kicker">
        {{ props.kicker }}
      </div>
      <slot />
    </div>
    <div class="google-figure">
      <span v-if="props.figureTag" class="google-figure-tag">{{ props.figureTag }}</span>
      <slot name="figure" />
    </div>
    <div v-if="$slots.source" class="google-source">
      <slot name="source" />
    </div>
  </div>
</template>
