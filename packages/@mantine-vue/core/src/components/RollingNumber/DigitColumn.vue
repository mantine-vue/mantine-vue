<script lang="ts">
/**
 * `0`–`9` plus a repeated `0` and `1`, so a column rolling from `9` to `0` or `1` can
 * continue upward through the duplicates instead of snapping backwards.
 */
const STRIP_CELLS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1']

export { STRIP_CELLS }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type { DigitColumnProps } from './DigitColumn.types'

defineOptions({ name: 'RollingNumberDigitColumn' })

const props = withDefaults(defineProps<DigitColumnProps>(), {
  previousDigit: null,
  empty: false,
})

const digitIndex = computed(() => Number.parseInt(props.digit, 10))

const previousDigitIndex = computed(() =>
  props.previousDigit !== null ? Number.parseInt(props.previousDigit, 10) : digitIndex.value,
)

/** Rolling up past `9` lands on a duplicate cell so the animation keeps going forward. */
const animateToIndex = computed(() => {
  const wrapsForward =
    props.valueDirection === 'up' &&
    props.previousDigit !== null &&
    digitIndex.value < previousDigitIndex.value &&
    digitIndex.value <= 1

  return wrapsForward ? digitIndex.value + 10 : digitIndex.value
})

const direction = computed(() => (digitIndex.value >= previousDigitIndex.value ? 'up' : 'down'))

const columnStyles = computed(() => props.getStyles('digitColumn'))

const columnStyle = computed(() => ({
  ...columnStyles.value.style,
  transform: `translateY(${-digitIndex.value}em)`,
  '--rn-roll-from': `translateY(${-previousDigitIndex.value}em)`,
  '--rn-roll-to': `translateY(${-animateToIndex.value}em)`,
}))
</script>

<template>
  <span v-bind="props.getStyles('digit')" :data-empty="props.empty || undefined" aria-hidden="true">
    <span :key="props.digit" v-bind="columnStyles" :style="columnStyle" :data-direction="direction">
      <span v-for="(cell, index) in STRIP_CELLS" :key="index">{{ cell }}</span>
    </span>
  </span>
</template>
