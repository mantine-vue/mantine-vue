<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from '../../Spotlight.context'
import type { SpotlightActionsGroupProps } from './SpotlightActionsGroup.types'

defineOptions({ name: 'SpotlightActionsGroup', inheritAttrs: false })
const rawProps = defineProps<SpotlightActionsGroupProps>()
const attrs = useAttrs()
const props = useProps('SpotlightActionsGroup', null, rawProps)
const ctx = useSpotlightContext()
const groupStyles = computed(() =>
  ctx.getStyles('actionsGroup', {
    className: attrs.class,
    style: attrs.style,
    classNames: props.classNames,
    styles: props.styles,
  }),
)
const labelVariable = computed(() => ({
  '--spotlight-label': `'${props.label?.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`,
}))
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...groupStyles }"
    :style="[groupStyles.style, attrs.style, labelVariable]"
  >
    <slot />
  </Box>
</template>
