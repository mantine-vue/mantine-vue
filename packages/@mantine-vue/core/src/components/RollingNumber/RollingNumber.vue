<script lang="ts">
import { createVarsResolver } from '../../core'

const defaultProps = {
  animationDuration: 600,
  timingFunction: 'ease',
  decimalSeparator: '.',
  tabularNumbers: true,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { animationDuration, timingFunction }) => ({
  root: {
    '--rn-duration': `${animationDuration}ms`,
    '--rn-timing-function': timingFunction,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { buildValue } from './build-value'
import { DigitColumn } from './DigitColumn'
import { getDigitParts } from './get-digit-parts'
import { getRenderSlots } from './get-render-slots'
import type { RollingNumberOwnProps } from './RollingNumber.types'
import classes from './RollingNumber.module.css'

defineOptions({
  name: 'RollingNumber',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<RollingNumberOwnProps>(), {
  fixedDecimalScale: false,
  tabularNumbers: undefined,
  withLiveRegion: false,
  unstyled: false,
})

const attrs = useAttrs()
const props = useProps('RollingNumber', defaultProps, rawProps)

/** Kept so each digit knows where it is rolling from. */
const previousValue = ref(props.value)

watch(
  () => props.value,
  (_, oldValue) => {
    previousValue.value = oldValue
  },
  { flush: 'post' },
)

const getStyles = useStyles({
  name: 'RollingNumber',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const valueDirection = computed(() => (props.value >= previousValue.value ? 'up' : 'down'))

/**
 * The rendered characters, aligned against the previous value so a digit that did not
 * change is not animated and a newly added one rolls in from empty.
 */
const renderSlots = computed(() => {
  const digitPartsOptions = {
    decimalScale: props.decimalScale,
    fixedDecimalScale: props.fixedDecimalScale,
  }

  return getRenderSlots({
    current: getDigitParts({ value: props.value, ...digitPartsOptions }),
    previous: getDigitParts({ value: previousValue.value, ...digitPartsOptions }),
    prefix: props.prefix,
    suffix: props.suffix,
    decimalSeparator: props.decimalSeparator,
    thousandSeparator: props.thousandSeparator,
  })
})

/** The digits are `aria-hidden`, so the whole number is exposed through this label. */
const accessibleValue = computed(() =>
  buildValue({
    value: props.value,
    prefix: props.prefix,
    suffix: props.suffix,
    decimalSeparator: props.decimalSeparator,
    thousandSeparator: props.thousandSeparator,
    decimalScale: props.decimalScale,
    fixedDecimalScale: props.fixedDecimalScale,
  }),
)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :mod="[{ tabularNumbers: props.tabularNumbers }, props.mod]"
    :role="props.withLiveRegion ? 'status' : 'img'"
    :aria-label="accessibleValue"
  >
    <template v-for="slot in renderSlots" :key="slot.key">
      <DigitColumn
        v-if="slot.type === 'digit'"
        :digit="slot.digit"
        :previous-digit="slot.previousDigit"
        :get-styles="getStyles"
        :empty="slot.empty"
        :value-direction="valueDirection"
      />

      <span
        v-else
        v-bind="getStyles('char')"
        :data-empty="slot.empty || undefined"
        aria-hidden="true"
        >{{ slot.char }}</span
      >
    </template>
  </Box>
</template>
