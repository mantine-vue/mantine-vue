<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from '../../Spotlight.context'
import type { SpotlightFooterProps } from './SpotlightFooter.types'

defineOptions({ name: 'SpotlightFooter', inheritAttrs: false })
const rawProps = defineProps<SpotlightFooterProps>()
const attrs = useAttrs()
const props = useProps('SpotlightFooter', null, rawProps)
const ctx = useSpotlightContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('footer', {
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
