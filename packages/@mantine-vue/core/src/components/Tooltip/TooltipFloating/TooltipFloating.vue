<script lang="ts">
import type { VNode } from 'vue'
import { createVarsResolver, getDefaultZIndex, getRadius, getThemeColor } from '../../../core'

const defaults = {
  refProp: 'ref',
  withinPortal: true,
  offset: 10,
  position: 'right',
  zIndex: getDefaultZIndex('popover'),
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, props) => ({
  tooltip: {
    '--tooltip-radius': props.radius === undefined ? undefined : getRadius(props.radius),
    '--tooltip-bg': props.color ? getThemeColor(props.color, theme) : undefined,
    '--tooltip-color': props.color ? 'var(--mantine-color-white)' : undefined,
  },
}))

/**
 * The tooltip attaches itself to its child by cloning it, so there must be exactly one
 * real child. Fragments and comments produced by `v-if`/`v-for` are ignored.
 */
function one(slots: any): VNode {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []

  if (children.length !== 1) {
    throw new Error(
      'Tooltip.Floating component children should be a single element or component that accepts ref',
    )
  }

  return children[0]
}

/** Component refs resolve to instances, not elements; Floating UI needs the element. */
function asElement(node: any): HTMLElement | null {
  const candidate = node?.$el ?? node
  return typeof Element !== 'undefined' && candidate instanceof Element
    ? (candidate as HTMLElement)
    : null
}

export { defaults, varsResolver, one, asElement }
</script>

<script setup lang="ts">
import { shift, useFloating } from '@floating-ui/vue'
import { cloneVNode, computed, ref, useAttrs, useSlots, type VNodeChild } from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import { Box, resolveNode, useProps, useStyles } from '../../../core'
import { OptionalPortal } from '../../Portal'
import type { TooltipFloatingProps, TooltipFloatingSlots } from './TooltipFloating.types'
import classes from '../Tooltip.module.css'

defineOptions({
  name: 'TooltipFloating',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<TooltipFloatingProps>(), {
  withinPortal: undefined,
  disabled: false,
  defaultOpened: false,
  multiline: false,
  unstyled: false,
})

defineSlots<TooltipFloatingSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('TooltipFloating', defaults, rawProps)

const opened = ref(props.defaultOpened)
const boundary = ref<any>(null)
const floating = ref<HTMLElement | null>(null)

/**
 * The reference is a zero-sized virtual element at the cursor, which is what makes the
 * tooltip follow the pointer instead of anchoring to the target.
 */
const virtual = ref<any>(null)

const state = useFloating(virtual, floating, {
  placement: computed(() => props.position),
  // `crossAxis` lets the tooltip slide along the cursor axis rather than flipping.
  middleware: [shift({ crossAxis: true, padding: 5, rootBoundary: 'document' })],
})

const getStyles = useStyles({
  name: 'TooltipFloating',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

function move(event: MouseEvent) {
  const valueOffset = props.offset ?? 10

  // The offset is applied along whichever axis the resolved placement uses.
  const horizontal = state.placement.value.includes('right')
    ? valueOffset
    : state.placement.value.includes('left')
      ? -valueOffset
      : 0
  const vertical = state.placement.value.includes('bottom')
    ? valueOffset
    : state.placement.value.includes('top')
      ? -valueOffset
      : 0

  virtual.value = {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x: event.clientX,
      y: event.clientY,
      left: event.clientX + horizontal,
      top: event.clientY + vertical,
      right: event.clientX,
      bottom: event.clientY,
    }),
  }
}

function setFloating(node: any) {
  floating.value = asElement(node)
}

const tooltipStyles = computed(() => getStyles('tooltip', { className: attrs.class }))

const tooltipStyle = computed(() => [
  tooltipStyles.value.style,
  attrs.style,
  {
    zIndex: props.zIndex,
    // Hidden with CSS rather than unmounted, so the floating position survives.
    display: !props.disabled && opened.value ? 'block' : 'none',
    top: state.y.value == null ? '' : `${Math.round(state.y.value)}px`,
    left: state.x.value == null ? '' : `${Math.round(state.x.value)}px`,
  },
])

const label = computed(() => resolveNode(props.label, slots.label))

/** The label is renderable content, which cannot be interpolated as text. */
const renderLabel = () => label.value

/**
 * Rendered through `<component :is>`: the child has to be cloned so the boundary ref and
 * the pointer handlers can be merged into whatever it already declares.
 */
const renderReference = Object.assign(
  (slotProps: { nodes?: () => VNodeChild }): VNodeChild => {
    const child = one({ default: slotProps.nodes })

    return cloneVNode(
      child,
      {
        [props.refProp ?? 'ref']: mergeRefs(
          (node: any) => (boundary.value = asElement(node)),
          (child as any).ref,
        ),
        onMouseenter: (event: MouseEvent) => {
          move(event)
          opened.value = true
        },
        onMousemove: (event: MouseEvent) => {
          move(event)
        },
        onMouseleave: () => {
          opened.value = false
        },
      },
      true,
    )
  },
  // Declared so the slot does not fall through onto the cloned child as an attribute.
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Box
      :ref="setFloating"
      v-bind="{ ...attrs, ...tooltipStyles }"
      role="tooltip"
      :data-multiline="props.multiline || undefined"
      :style="tooltipStyle"
    >
      <component :is="renderLabel" />
    </Box>
  </OptionalPortal>

  <component :is="renderReference" :nodes="slots.default" />
</template>
