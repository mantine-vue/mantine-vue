<script lang="ts">
import { createVarsResolver, getRadius, getThemeColor } from '@mantine-vue/core'
const varsResolver = createVarsResolver<any>((theme, { background, radius }) => ({
  inlineCodeHighlight: {
    '--ch-background': background ? getThemeColor(background, theme) : undefined,
    '--ch-radius': typeof radius !== 'undefined' ? getRadius(radius) : undefined,
  },
}))
export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { useProps, useStyles } from '@mantine-vue/core'
import CodeHighlightComponent from './CodeHighlight.vue'
import type {
  InlineCodeHighlightFactory,
  InlineCodeHighlightProps,
} from './InlineCodeHighlight.types'
import classes from '../CodeHighlight.module.css'

defineOptions({ name: 'InlineCodeHighlight', inheritAttrs: false })
const rawProps = withDefaults(defineProps<InlineCodeHighlightProps>(), { withBorder: false })
const props = useProps('InlineCodeHighlight', null, rawProps)
const attrs = useAttrs()
const getStyles = useStyles<InlineCodeHighlightFactory>({
  name: 'InlineCodeHighlight',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  unstyled: props.unstyled,
  vars: props.vars,
  varsResolver,
  rootSelector: 'inlineCodeHighlight',
} as any)
</script>

<template>
  <CodeHighlightComponent
    v-bind="{ ...attrs, ...props, ...getStyles('inlineCodeHighlight') }"
    __inline
  />
</template>
