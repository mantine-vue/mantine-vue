<script lang="ts">
import { createVarsResolver, getFontSize, getLineHeight, getSpacing } from '../../core'

const defaultProps = { orientation: 'horizontal' } as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size, gap, labelWidth }) => ({
  root: {
    '--data-list-fz': getFontSize(size),
    '--data-list-lh': getLineHeight(size),
    '--data-list-gap': getSpacing(gap),
    '--data-list-label-width':
      labelWidth !== undefined
        ? typeof labelWidth === 'number'
          ? `${labelWidth}px`
          : labelWidth
        : undefined,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { provideDataListContext } from './DataList.context'
import type { DataListOwnProps, DataListSlots } from './DataList.types'
import classes from './DataList.module.css'

defineOptions({
  name: 'DataList',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<DataListOwnProps>(), {
  withDivider: undefined,
  unstyled: false,
})

defineSlots<DataListSlots>()

const attrs = useAttrs()
const props = useProps('DataList', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'DataList',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

provideDataListContext({ getStyles })
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    component="dl"
    :mod="[{ orientation: props.orientation, 'with-divider': props.withDivider }, props.mod]"
  >
    <slot />
  </Box>
</template>
