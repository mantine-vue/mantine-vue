<script lang="ts">
import { Fragment, type VNode, type VNodeChild } from 'vue'
import { createVarsResolver, getSize } from '../../core'

const defaultProps = {
  size: 'md',
  align: 'center',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { size, variant, color }) => {
  // Without a variant the indicator has no background, so no colors are resolved.
  const colors = variant
    ? theme.variantColorResolver({ color: color || theme.primaryColor, theme, variant })
    : null

  return {
    root: {
      '--empty-state-indicator-size': getSize(size, 'empty-state-indicator-size'),
      '--empty-state-gap': getSize(size, 'empty-state-gap'),
      '--empty-state-title-fz': getSize(size, 'empty-state-title-fz'),
      '--empty-state-description-fz': getSize(size, 'empty-state-description-fz'),
      '--empty-state-indicator-bg': colors ? colors.background : undefined,
      '--empty-state-indicator-color': colors ? colors.color : undefined,
    },
  }
})

/**
 * `v-for` and conditionals produce fragments and arrays, which have to be unwrapped
 * before the indicator can be told apart from the rest of the children.
 */
function flattenChildren(nodes: VNodeChild[]): VNode[] {
  const flat: VNode[] = []

  const collect = (input: VNodeChild[]) => {
    input.forEach((child) => {
      if (child == null || typeof child === 'boolean') {
        return
      }

      if (Array.isArray(child)) {
        collect(child)
        return
      }

      if (typeof child === 'object' && (child as VNode).type === Fragment) {
        const inner = (child as VNode).children
        collect(Array.isArray(inner) ? (inner as VNodeChild[]) : [inner as VNodeChild])
        return
      }

      flat.push(child as VNode)
    })
  }

  collect(nodes)

  return flat
}

export { defaultProps, varsResolver, flattenChildren }
</script>

<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import { provideEmptyStateContext } from './EmptyState.context'
import { EmptyStateDescription } from './EmptyStateDescription/EmptyStateDescription'
import { EmptyStateIndicator } from './EmptyStateIndicator/EmptyStateIndicator'
import { EmptyStateTitle } from './EmptyStateTitle/EmptyStateTitle'
import type { EmptyStateOwnProps, EmptyStateSlots } from './EmptyState.types'
import classes from './EmptyState.module.css'

defineOptions({
  name: 'EmptyState',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<EmptyStateOwnProps>(), {
  title: undefined,
  description: undefined,
  icon: undefined,
  withIndicatorBackground: undefined,
  unstyled: false,
})

defineSlots<EmptyStateSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('EmptyState', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'EmptyState',
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

provideEmptyStateContext({
  getStyles,
  get withIndicatorBackground() {
    // A variant always paints a background, whether or not the prop is set.
    return props.withIndicatorBackground || !!props.variant
  },
})

const iconContent = computed(() => resolveNode(props.icon, slots.icon))
const titleContent = computed(() => resolveNode(props.title, slots.title))
const descriptionContent = computed(() => resolveNode(props.description, slots.description))

/**
 * An `EmptyState.Indicator` passed as a child is hoisted out of the body so it keeps
 * its place above the title, and is replaced entirely when `icon` is set.
 */
function splitChildren() {
  const rawChildren = slots.default?.() ?? []
  const children = flattenChildren(Array.isArray(rawChildren) ? rawChildren : [rawChildren])

  const bodyChildren: VNode[] = []
  let childrenIndicator: VNode | null = null

  children.forEach((child) => {
    if (child.type === (EmptyStateIndicator as any)) {
      childrenIndicator = child
    } else {
      bodyChildren.push(child)
    }
  })

  return { bodyChildren, childrenIndicator }
}

const rootStyles = computed(() => getStyles('root', { variant: props.variant }))

const rootMod = computed(() => [{ align: props.align }, props.mod])

/** Rendered through `<component :is>` so the VNode splitting stays out of the template. */
const renderIndicator = (): VNodeChild => {
  const icon = iconContent.value

  return hasNode(icon)
    ? h(EmptyStateIndicator, null, () => icon)
    : splitChildren().childrenIndicator
}

const renderBody = (): VNodeChild => {
  const { bodyChildren } = splitChildren()
  const title = titleContent.value
  const description = descriptionContent.value

  if (!hasNode(title) && !hasNode(description) && bodyChildren.length === 0) {
    return null
  }

  return h(Box, { ...getStyles('body') }, () => [
    hasNode(title) && h(EmptyStateTitle, null, () => title),
    hasNode(description) && h(EmptyStateDescription, null, () => description),
    bodyChildren,
  ])
}
</script>

<template>
  <Box v-bind="{ ...attrs, ...rootStyles }" :variant="props.variant" :mod="rootMod">
    <component :is="renderIndicator" />
    <component :is="renderBody" />
  </Box>
</template>
