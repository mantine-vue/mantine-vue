<script lang="ts">
import { createVarsResolver } from '../../core'
import { getTitleSize } from './get-title-size'
const defaultProps = { order: 1 } as const
const varsResolver = createVarsResolver<any>((_, { order, size, lineClamp, textWrap }) => {
  const values = getTitleSize(order || 1, size)
  return {
    root: {
      '--title-fw': values.fontWeight,
      '--title-lh': values.lineHeight,
      '--title-fz': values.fontSize,
      '--title-line-clamp': typeof lineClamp === 'number' ? lineClamp.toString() : undefined,
      '--title-text-wrap': textWrap,
    },
  }
})
export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { TitleOwnProps } from './Title.types'
import classes from './Title.module.css'

defineOptions({ name: 'Title', inheritAttrs: false })
const rawProps = withDefaults(defineProps<TitleOwnProps>(), {
  order: undefined,
  lineClamp: undefined,
  textWrap: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
const attrs = useAttrs()
const props = useProps('Title', defaultProps, rawProps)
const order = computed(() => props.order ?? 1)
const validOrder = computed(() => [1, 2, 3, 4, 5, 6].includes(order.value))
const getStyles = useStyles({
  name: 'Title',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
</script>

<template>
  <Box
    v-if="validOrder"
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="`h${order}`"
    :mod="{ order, lineClamp: typeof props.lineClamp === 'number' }"
    ><slot
  /></Box>
</template>
