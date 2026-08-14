<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'
import type {
  EmptyStateIndicatorOwnProps,
  EmptyStateIndicatorSlots,
} from './EmptyStateIndicator.types'

defineOptions({ name: 'EmptyStateIndicator', inheritAttrs: false })

const rawProps = withDefaults(defineProps<EmptyStateIndicatorOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<EmptyStateIndicatorSlots>()

const attrs = useAttrs()
const props = useProps('EmptyStateIndicator', null, rawProps)
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
