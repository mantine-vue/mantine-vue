<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type {
  EmptyStateIndicatorOwnProps,
  EmptyStateIndicatorSlots,
} from './EmptyStateIndicator.types'

defineOptions({ name: 'EmptyStateIndicator', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateIndicatorOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateIndicatorSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateIndicator', null, rawProps)
const ctx = useEmptyStateContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('indicator', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    :mod="[{ 'with-background': ctx.withIndicatorBackground }, props.mod]"
  >
    <slot />
  </Box>
</template>
