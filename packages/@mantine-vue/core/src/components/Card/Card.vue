<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'
export const varsResolver = createVarsResolver<any>((_, { padding }) => ({
  root: { '--card-padding': getSpacing(padding) },
}))
const defaultProps = { orientation: 'vertical' } as const
</script>
<script setup lang="ts">
import { cloneVNode, h, useAttrs, useSlots, type VNode } from 'vue'
import { useProps, useStyles } from '../../core'
import { Paper } from '../Paper'
import { CardSection } from './CardSection/CardSection'
import { provideCardContext } from './Card.context'
import type { CardOwnProps, CardSlots } from './Card.types'
import classes from './Card.module.css'
defineOptions({ name: 'Card', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CardOwnProps>(), {
  component: 'div',
  shadow: undefined,
  radius: undefined,
  withBorder: false,
  padding: undefined,
  orientation: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<CardSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Card', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Card',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
provideCardContext({ getStyles })
const isCardSection = (child: VNode) =>
  child.type === CardSection ||
  (typeof child.type === 'object' && (child.type as any).name === 'CardSection')

const renderCard = Object.assign(
  (slotProps: { nodes?: () => VNode[] }) => {
    const children = slotProps.nodes?.() ?? []
    const content = children.map((child, index) =>
      isCardSection(child)
        ? cloneVNode(child, {
            'data-orientation': props.orientation,
            'data-first-section': index === 0 ? '' : undefined,
            'data-last-section': index === children.length - 1 ? '' : undefined,
          })
        : child,
    )
    return h(
      Paper,
      {
        ...attrs,
        ...getStyles('root'),
        component: props.component,
        shadow: props.shadow,
        radius: props.radius,
        withBorder: props.withBorder,
        unstyled: props.unstyled,
        'data-orientation': props.orientation,
      },
      () => content,
    )
  },
  { props: { nodes: { type: Function, required: false } } },
)
</script>
<template><component :is="renderCard" :nodes="slots.default" /></template>
