<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import {
  Box,
  filterProps,
  hashStyleProps,
  InlineStyles,
  parseStyleProps,
  useMantineDeduplicateInlineStyles,
  useMantineTheme,
  useProps,
  useRandomClassName,
  useStyles,
} from '../../core'
import type { FlexOwnProps } from './Flex.types'
import { FLEX_STYLE_PROPS_DATA } from './flex-props'
import classes from './Flex.module.css'

defineOptions({ name: 'Flex', inheritAttrs: false })
const rawProps = withDefaults(defineProps<FlexOwnProps>(), {
  rootRef: undefined,
  component: 'div',
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
const attrs = useAttrs()
const props = useProps('Flex', null, rawProps)
const theme = useMantineTheme()
const deduplicateInlineStyles = useMantineDeduplicateInlineStyles()
const randomClassName = useRandomClassName()
const getStyles = useStyles({
  name: 'Flex',
  classes,
  props,
  className: undefined,
  style: undefined,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
})
const parsedStyleProps = computed(() =>
  parseStyleProps({
    styleProps: {
      gap: props.gap,
      rowGap: props.rowGap,
      columnGap: props.columnGap,
      align: props.align,
      justify: props.justify,
      wrap: props.wrap,
      direction: props.direction,
    },
    theme: theme.value,
    data: FLEX_STYLE_PROPS_DATA,
  }),
)
const responsiveClassName = computed(() =>
  deduplicateInlineStyles && parsedStyleProps.value.hasResponsiveStyles
    ? hashStyleProps(parsedStyleProps.value.styles, parsedStyleProps.value.media)
    : randomClassName,
)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <InlineStyles
    v-if="parsedStyleProps.hasResponsiveStyles"
    :selector="`.${responsiveClassName}`"
    :styles="parsedStyleProps.styles"
    :media="parsedStyleProps.media"
    :deduplicate="deduplicateInlineStyles"
  />
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', {
        className: [
          attrs.class,
          parsedStyleProps.hasResponsiveStyles ? responsiveClassName : undefined,
        ],
        style: [attrs.style, filterProps(parsedStyleProps.inlineStyles)],
      }),
    }"
    :component="props.component"
    :rootRef="setRootRef"
    ><slot
  /></Box>
</template>
