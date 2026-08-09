<script lang="ts">
import type { VNode } from 'vue'
import { rem } from '@mantine-vue/utils'
import { createVarsResolver, getThemeColor } from '../../core'

const defaultProps = {
  orientation: 'horizontal',
  lineSize: 2,
  withHandle: true,
  resetOnDoubleClick: true,
  step: 1,
  shiftStep: 10,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { lineSize, handleColor }) => ({
  root: {
    '--splitter-line-size': rem(lineSize),
    '--splitter-handle-color': handleColor ? getThemeColor(handleColor, theme) : undefined,
  },
}))

/**
 * `v-for` and conditionals wrap children in fragments, whose `type` is a symbol. They
 * have to be unwrapped so the panes can be counted and indexed.
 */
function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) =>
    typeof child.type === 'symbol' && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : [child],
  )
}

export { defaultProps, varsResolver, flattenChildren }
</script>

<script setup lang="ts">
import { cloneVNode, computed, h, shallowRef, useAttrs, useSlots, type VNodeChild } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, resolveNode, useDirection, useProps, useStyles } from '../../core'
import { GripHorizontalIcon, GripVerticalIcon } from './GripIcon'
import { provideSplitterContext } from './Splitter.context'
import { useSplitter } from './use-splitter'
import type { SplitterEmits, SplitterOwnProps, SplitterSlots } from './Splitter.types'
import classes from './Splitter.module.css'

defineOptions({
  name: 'Splitter',
  inheritAttrs: false,
})

/**
 * Intentionally undefined to preserve downstream defaults.
 */
const rawProps = withDefaults(defineProps<SplitterOwnProps>(), {
  withHandle: undefined,
  resetOnDoubleClick: undefined,
  handleIcon: undefined,
  unstyled: false,
})

defineSlots<SplitterSlots>()

const emit = defineEmits<SplitterEmits>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Splitter', defaultProps, rawProps)

const { dir } = useDirection()

/**
 * The pane configuration lives on the children, so it can only be read from their
 * vnodes. This is refreshed on every render, before the handles are built.
 */
const paneChildren = shallowRef<VNode[]>([])

const panels = computed(() =>
  paneChildren.value.map((child) => ({
    defaultSize: Number(
      (child.props as any)?.defaultSize ?? (child.props as any)?.['default-size'] ?? 0,
    ),
    min: (child.props as any)?.min,
    max: (child.props as any)?.max,
    collapsible: (child.props as any)?.collapsible,
    collapseThreshold:
      (child.props as any)?.collapseThreshold ?? (child.props as any)?.['collapse-threshold'],
  })),
)

const splitter = useSplitter({
  panels,
  orientation: () => props.orientation ?? 'horizontal',
  sizes: () => props.sizes,
  onSizeChange: (sizes) => {
    emit('update:sizes', sizes)
    emit('size-change', sizes)
  },
  onResizeStart: (index) => emit('resize-start', index),
  onResizeEnd: (index, sizes) => emit('resize-end', index, sizes),
  onCollapseChange: (index, collapsed) => emit('collapse-change', index, collapsed),
  redistribute: () => props.redistribute,
  step: () => props.step ?? 1,
  shiftStep: () => props.shiftStep ?? 10,
  dir: () => dir.value,
  resetOnDoubleClick: () => props.resetOnDoubleClick ?? true,
})

assignRef(props.splitterRef, splitter)
defineExpose(splitter)

const getStyles = useStyles({
  name: 'Splitter',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

provideSplitterContext({
  getStyles,
  get sizes() {
    return splitter.sizes
  },
  get collapsed() {
    return splitter.collapsed
  },
  get orientation() {
    return props.orientation ?? 'horizontal'
  },
})

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

const rootMod = computed(() => [{ orientation: props.orientation }, props.mod])

/**
 * Rendered through `<component :is>`: the panes have to be cloned with their index
 * injected and a handle interleaved between each pair, which is not expressible in a
 * template. It stays part of this component's render, so reactivity is unaffected.
 */
const renderItems = (): VNodeChild => {
  paneChildren.value = flattenChildren((slots.default?.() ?? []) as VNode[])

  const items: VNode[] = []

  paneChildren.value.forEach((child, index) => {
    // A handle goes before every pane except the first.
    if (index > 0) {
      const handleIndex = index - 1

      items.push(
        h(
          Box,
          {
            key: `handle-${handleIndex}`,
            ...getStyles('handle'),
            ...splitter.getHandleProps(handleIndex),
          },
          () =>
            props.withHandle
              ? h(
                  'div',
                  {
                    ...getStyles('thumb'),
                    'data-orientation': props.orientation,
                    'data-active': splitter.activeHandle === handleIndex || undefined,
                  },
                  [
                    props.handleIcon !== undefined || slots.handleIcon
                      ? resolveNode(props.handleIcon, slots.handleIcon)
                      : // The grip runs across the handle, so it is perpendicular to it.
                        h(props.orientation === 'vertical' ? GripHorizontalIcon : GripVerticalIcon),
                  ],
                )
              : undefined,
        ),
      )
    }

    items.push(cloneVNode(child, { key: `pane-${index}`, __index: index }, true))
  })

  return items
}
</script>

<template>
  <Box :ref="splitter.setContainer" v-bind="{ ...attrs, ...rootStyles }" :mod="rootMod">
    <component :is="renderItems" />
  </Box>
</template>
