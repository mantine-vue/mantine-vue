<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type { EmptyStateTitleOwnProps, EmptyStateTitleSlots } from './EmptyStateTitle.types'

defineOptions({ name: 'EmptyStateTitle', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateTitleOwnProps>(), {
  rootRef: undefined,
  order: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateTitleSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateTitle', null, rawProps)
const ctx = useEmptyStateContext()

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
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
