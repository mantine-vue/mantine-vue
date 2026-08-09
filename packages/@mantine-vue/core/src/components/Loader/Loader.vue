<script lang="ts">
import { createVarsResolver, getSize, getThemeColor } from '../../core'
import { Bars } from './loaders/Bars'
import { Dots } from './loaders/Dots'
import { Oval } from './loaders/Oval'
import type { MantineLoadersRecord } from './Loader.types'
export const defaultLoaders: MantineLoadersRecord = { bars: Bars, oval: Oval, dots: Dots }
export const varsResolver = createVarsResolver<any>((theme, { size, color }) => ({
  root: {
    '--loader-size': getSize(size, 'loader-size'),
    '--loader-color': color ? getThemeColor(color, theme) : undefined,
  },
}))
</script>
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { LoaderOwnProps, LoaderSlots } from './Loader.types'
import classes from './Loader.module.css'
defineOptions({ name: 'Loader', inheritAttrs: false })
const rawProps = withDefaults(defineProps<LoaderOwnProps>(), {
  size: undefined,
  color: undefined,
  type: undefined,
  loaders: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const slots = defineSlots<LoaderSlots>()
const attrs = useAttrs()
const props = useProps('Loader', { loaders: defaultLoaders, type: 'oval', size: 'md' }, rawProps)
const getStyles = useStyles({
  name: 'Loader',
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
const selectedLoader = computed(
  () => (props.loaders ?? defaultLoaders)[props.type ?? 'oval'] ?? defaultLoaders.oval,
)
</script>
<template>
  <Box v-if="slots.default" v-bind="{ ...attrs, ...getStyles('root') }"><slot /></Box
  ><Box
    v-else
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="selectedLoader"
    :size="props.size"
  />
</template>
