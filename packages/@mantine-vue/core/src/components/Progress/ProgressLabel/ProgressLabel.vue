<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useProgressContext } from '../Progress.context'
import type { ProgressLabelOwnProps, ProgressLabelSlots } from './ProgressLabel.types'

defineOptions({ name: 'ProgressLabel', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ProgressLabelOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  className: undefined,
  style: undefined,
})
defineSlots<ProgressLabelSlots>()
const attrs = useAttrs()
const props = useProps('ProgressLabel', null, rawProps)
const ctx = useProgressContext()

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
      ...ctx.getStyles('label', {
        className: [props.className, attrs.class],
        style: [props.style, attrs.style],
        props,
      }),
    }"
    ><slot
  /></Box>
</template>
