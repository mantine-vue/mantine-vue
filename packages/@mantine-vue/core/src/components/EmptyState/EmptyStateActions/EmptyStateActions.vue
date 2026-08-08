<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type { EmptyStateActionsOwnProps, EmptyStateActionsSlots } from './EmptyStateActions.types'

defineOptions({ name: 'EmptyStateActions', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateActionsOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateActionsSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateActions', null, rawProps)
const ctx = useEmptyStateContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('actions', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    :mod="props.mod"
  >
    <slot />
  </Box>
</template>
