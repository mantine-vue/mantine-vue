<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useProgressContext } from '../Progress.context'
import type { ProgressLabelOwnProps, ProgressLabelSlots } from './ProgressLabel.types'

defineOptions({ name: 'ProgressLabel', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ProgressLabelOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  className: undefined,
  style: undefined,
})
defineSlots<ProgressLabelSlots>()
const attrs = useAttrs()
const props = useProps('ProgressLabel', null, rawProps)
const ctx = useProgressContext()
</script>

<template>
  <Box
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
