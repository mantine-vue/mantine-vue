<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type {
  EmptyStateDescriptionOwnProps,
  EmptyStateDescriptionSlots,
} from './EmptyStateDescription.types'

defineOptions({ name: 'EmptyStateDescription', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateDescriptionOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateDescriptionSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateDescription', null, rawProps)
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
