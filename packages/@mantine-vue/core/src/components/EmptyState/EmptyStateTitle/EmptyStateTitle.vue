<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type { EmptyStateTitleOwnProps, EmptyStateTitleSlots } from './EmptyStateTitle.types'

defineOptions({ name: 'EmptyStateTitle', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateTitleOwnProps>(), {
  order: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateTitleSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateTitle', null, rawProps)
const ctx = useEmptyStateContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('title', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    :component="props.order ? `h${props.order}` : 'div'"
    :mod="props.mod"
  >
    <slot />
  </Box>
</template>
