<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { formatNumber } from './format-number'
import type { NumberFormatterOwnProps } from './NumberFormatter.types'

defineOptions({ name: 'NumberFormatter', inheritAttrs: false })

const props = withDefaults(defineProps<NumberFormatterOwnProps>(), {
  value: undefined,
  allowNegative: true,
  decimalScale: undefined,
  decimalSeparator: '.',
  fixedDecimalScale: false,
  prefix: undefined,
  suffix: undefined,
  thousandsGroupStyle: 'thousand',
  thousandSeparator: undefined,
})
const attrs = useAttrs()
const formatted = computed(() =>
  props.value === undefined
    ? ''
    : formatNumber(props.value, {
        allowNegative: props.allowNegative,
        decimalScale: props.decimalScale,
        decimalSeparator: props.decimalSeparator,
        fixedDecimalScale: props.fixedDecimalScale,
        prefix: props.prefix,
        suffix: props.suffix,
        thousandsGroupStyle: props.thousandsGroupStyle,
        thousandSeparator: props.thousandSeparator,
      }),
)
</script>

<template>
  <span v-if="props.value !== undefined" v-bind="attrs">{{ formatted }}</span>
</template>
