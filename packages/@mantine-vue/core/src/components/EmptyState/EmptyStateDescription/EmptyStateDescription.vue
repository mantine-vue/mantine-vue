<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type {
  EmptyStateDescriptionOwnProps,
  EmptyStateDescriptionSlots,
} from './EmptyStateDescription.types'

defineOptions({ name: 'EmptyStateDescription', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateDescriptionOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateDescriptionSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateDescription', null, rawProps)
const ctx = useEmptyStateContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('description', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    component="p"
    :mod="props.mod"
  >
    <slot />
  </Box>
</template>
