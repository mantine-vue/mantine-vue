<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getThemeColor,
  rem,
} from '../../core'
export const varsResolver = createVarsResolver<any>(
  (theme, { bulletSize, lineWidth, radius, color, autoContrast }) => ({
    root: {
      '--tl-bullet-size': rem(bulletSize),
      '--tl-line-width': rem(lineWidth),
      '--tl-radius': radius === undefined ? undefined : getRadius(radius),
      '--tl-color': color ? getThemeColor(color, theme) : undefined,
      '--tl-icon-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
    },
  }),
)
const defaultProps = { active: -1, align: 'left' } as const
</script>
<script setup lang="ts">
import { cloneVNode, h, useAttrs, useSlots, type VNode } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { provideTimelineContext } from './Timeline.context'
import type { TimelineOwnProps, TimelineSlots } from './Timeline.types'
import classes from './Timeline.module.css'
defineOptions({ name: 'Timeline', inheritAttrs: false })
const rawProps = withDefaults(defineProps<TimelineOwnProps>(), {
  active: undefined,
  color: undefined,
  radius: undefined,
  bulletSize: undefined,
  align: undefined,
  lineWidth: undefined,
  reverseActive: false,
  autoContrast: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<TimelineSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Timeline', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Timeline',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})
provideTimelineContext({ getStyles })

const renderTimeline = Object.assign(
  (slotProps: { nodes?: () => VNode[] }) => {
    const children = (slotProps.nodes?.() ?? []).filter(Boolean) as VNode[]
    const hasOpposite = children.some(
      (item) =>
        item.props?.opposite != null ||
        (item.children as Record<string, unknown> | null)?.opposite != null,
    )
    const active = props.active ?? defaultProps.active
    const items = children.map((item, index) => {
      const itemActive = props.reverseActive
        ? active >= children.length - index - 1
        : active >= index
      const lineActive = props.reverseActive
        ? active >= children.length - index - 1
        : active - 1 >= index
      return cloneVNode(
        item,
        {
          unstyled: props.unstyled,
          __align: props.align,
          __active: item.props?.active || itemActive,
          __lineActive: item.props?.lineActive || lineActive,
        },
        true,
      )
    })
    return h(
      Box,
      {
        ...attrs,
        mod: [{ align: props.align, opposite: hasOpposite }, props.mod],
        ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
      },
      () => items,
    )
  },
  // Declared so the slot does not fall through onto the root element as an attribute.
  { props: { nodes: { type: Function, required: false } } },
)
</script>
<template><component :is="renderTimeline" :nodes="slots.default" /></template>
