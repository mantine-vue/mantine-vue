<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { provideScheduleHeaderLabels } from './ScheduleHeader.context'
import type { ScheduleHeaderOwnProps, ScheduleHeaderSlots } from './ScheduleHeader.types'
import classes from './ScheduleHeader.module.css'

defineOptions({
  name: 'ScheduleHeader',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ScheduleHeaderOwnProps>(), {
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ScheduleHeaderSlots>()

const attrs = useAttrs()

const props = useProps('ScheduleHeader', null, rawProps)

const getStyles = useStyles({
  name: 'ScheduleHeader',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'header',
})

provideScheduleHeaderLabels(() => props.labels)
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('header') }">
    <slot />
  </Box>
</template>
