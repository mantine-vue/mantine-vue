<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from '../../Spotlight.context'
import type { SpotlightEmptyProps } from './SpotlightEmpty.types'

defineOptions({ name: 'SpotlightEmpty', inheritAttrs: false })
const rawProps = defineProps<SpotlightEmptyProps>()
const attrs = useAttrs()
const props = useProps('SpotlightEmpty', null, rawProps)
const ctx = useSpotlightContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('empty', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
  >
    <slot />
  </Box>
</template>
