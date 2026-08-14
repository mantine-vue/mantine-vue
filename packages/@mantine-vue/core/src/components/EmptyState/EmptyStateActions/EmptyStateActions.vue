<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type { EmptyStateActionsOwnProps, EmptyStateActionsSlots } from './EmptyStateActions.types'

defineOptions({ name: 'EmptyStateActions', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateActionsOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateActionsSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateActions', null, rawProps)
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
