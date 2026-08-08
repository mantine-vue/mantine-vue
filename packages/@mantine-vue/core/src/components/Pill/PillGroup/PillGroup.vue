<script lang="ts">
import { createVarsResolver, getSize } from '../../../core'

export const varsResolver = createVarsResolver<any>((_, { gap }, ctx) => ({
  group: { '--pg-gap': gap !== undefined ? getSize(gap) : getSize(ctx.size, 'pg-gap') },
}))
</script>

<script setup lang="ts">
import { provide, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import { usePillsInputContext } from '../../PillsInput/PillsInput.context'
import { PillGroupContextKey } from './PillGroup.context'
import type { PillGroupOwnProps, PillGroupSlots } from './PillGroup.types'
import classes from '../Pill.module.css'

defineOptions({ name: 'PillGroup', inheritAttrs: false })

const rawProps = withDefaults(defineProps<PillGroupOwnProps>(), {
  gap: undefined,
  size: undefined,
  disabled: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<PillGroupSlots>()

const attrs = useAttrs()
const props = useProps('PillGroup', null, rawProps)
const pillsInputContext = usePillsInputContext()
const getSizeValue = () => pillsInputContext?.size || props.size || undefined
const getStyles = useStyles({
  name: 'PillGroup',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  stylesCtx: {
    get size() {
      return getSizeValue()
    },
  },
  rootSelector: 'group',
})

provide(PillGroupContextKey, {
  get size() {
    return getSizeValue()
  },
  get disabled() {
    return props.disabled
  },
})
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('group') }" component="div" :data-size="getSizeValue()">
    <slot />
  </Box>
</template>
