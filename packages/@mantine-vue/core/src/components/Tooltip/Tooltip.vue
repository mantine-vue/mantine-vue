<script lang="ts">
import type { VNode } from 'vue'
import { createVarsResolver, getDefaultZIndex, getRadius } from '../../core'

const defaults = {
  position: 'top',
  refProp: 'ref',
  withinPortal: true,
  arrowSize: 4,
  arrowOffset: 5,
  arrowRadius: 0,
  arrowPosition: 'side',
  offset: 5,
  transitionProps: { duration: 100, transition: 'fade' },
  events: { hover: true, focus: false, touch: false },
  zIndex: getDefaultZIndex('popover'),
  middlewares: { flip: true, shift: true, inline: false },
  floatingStrategy: 'absolute',
  hideDetached: true,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, props) => {
  const colors = theme.variantColorResolver({
    theme,
    color: props.color || theme.primaryColor,
    autoContrast: props.autoContrast,
    variant: props.variant || 'filled',
  })

  return {
    tooltip: {
      '--tooltip-radius': props.radius === undefined ? undefined : getRadius(props.radius),
      '--tooltip-bg': props.color ? colors.background : undefined,
      '--tooltip-color': props.color ? colors.color : undefined,
    },
  }
})

/**
 * The tooltip attaches itself to its child by cloning it, so there must be exactly one
 * real child. Fragments and comments produced by `v-if`/`v-for` are ignored.
 */
function one(slots: any): VNode | null {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  return children.length === 1 ? children[0] : null
}

/** Component refs resolve to instances, not elements; Floating UI needs the element. */
function asElement(node: any): HTMLElement | null {
  const candidate = node?.inputElement ?? node?.$el ?? node
  return typeof Element !== 'undefined' && candidate instanceof Element
    ? (candidate as HTMLElement)
    : null
}

export { defaults, varsResolver, one, asElement }
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useSlots,
  type VNodeChild,
} from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import { Box, resolveNode, useDirection, useProps, useStyles } from '../../core'
import {
  FloatingArrow,
  getArrowMergeDropdownStyles,
  getFloatingPosition,
  type FloatingPosition,
} from '../../utils/Floating'
import { OptionalPortal } from '../Portal'
import { Transition as MantineTransitionComponent } from '../Transition'
import { useTooltip } from './use-tooltip'
import type { TooltipProps, TooltipSlots } from './Tooltip.types'
import classes from './Tooltip.module.css'

defineOptions({
  name: 'Tooltip',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<TooltipProps>(), {
  withinPortal: undefined,
  opened: undefined,
  offset: undefined,
  hideDetached: undefined,
  multiline: false,
  disabled: false,
  defaultOpened: false,
  withArrow: false,
  inline: false,
  keepMounted: false,
  autoContrast: false,
  unstyled: false,
})

const emit = defineEmits<{
  'position-change': [position: FloatingPosition]
}>()

defineSlots<TooltipSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Tooltip', defaults, rawProps)

let interactiveCloseTimer: ReturnType<typeof setTimeout> | undefined
const cancelInteractiveClose = () => {
  clearTimeout(interactiveCloseTimer)
  interactiveCloseTimer = undefined
}
const closeFromPointer = () => {
  cancelInteractiveClose()
  if (props.interactive) {
    interactiveCloseTimer = setTimeout(tooltip.close, 50)
  } else {
    tooltip.close()
  }
}

const { dir } = useDirection()

const tooltip = useTooltip({
  position: () => getFloatingPosition(dir.value, props.position ?? 'top'),
  // Deliberately the raw prop: `useProps` cannot tell "not set" from "set to false" here,
  // and an undefined `opened` is what makes the tooltip uncontrolled.
  opened: () => rawProps.opened,
  defaultOpened: props.defaultOpened,
  disabled: () => props.disabled,
  openDelay: () => props.openDelay,
  closeDelay: () => props.closeDelay,
  // The arrow sits between the tooltip and the target, so it has to be offset around.
  offset: () =>
    typeof props.offset === 'number'
      ? props.offset + (props.withArrow ? (props.arrowSize ?? 4) / 2 : 0)
      : (props.offset ?? 5),
  arrowOffset: () => props.arrowOffset ?? 5,
  events: () => props.events ?? { hover: true, focus: false, touch: false },
  strategy: () => props.floatingStrategy ?? 'absolute',
  middlewares: () => props.middlewares,
  hideDetached: () => props.hideDetached,
  onPositionChange: (position) => emit('position-change', position),
})

const getStyles = useStyles({
  name: 'Tooltip',
  classes,
  props,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

const referenceHandlers = () => ({
  onMouseenter: () => {
    if ((props.events ?? defaults.events).hover) {
      cancelInteractiveClose()
      tooltip.open()
    }
  },
  onMouseleave: () => {
    if ((props.events ?? defaults.events).hover) {
      closeFromPointer()
    }
  },
  onFocus: () => {
    if ((props.events ?? defaults.events).focus) {
      tooltip.open()
    }
  },
  onBlur: () => {
    if ((props.events ?? defaults.events).focus) {
      tooltip.close()
    }
  },
})

const interactionHandlers = referenceHandlers()

function attachReferenceHandlers(el: HTMLElement) {
  el.addEventListener('mouseenter', interactionHandlers.onMouseenter as any)
  el.addEventListener('mouseleave', interactionHandlers.onMouseleave as any)
  el.addEventListener('focus', interactionHandlers.onFocus as any)
  el.addEventListener('blur', interactionHandlers.onBlur as any)
}

function detachReferenceHandlers(el: HTMLElement) {
  el.removeEventListener('mouseenter', interactionHandlers.onMouseenter as any)
  el.removeEventListener('mouseleave', interactionHandlers.onMouseleave as any)
  el.removeEventListener('focus', interactionHandlers.onFocus as any)
  el.removeEventListener('blur', interactionHandlers.onBlur as any)
}

let external: HTMLElement | null = null

const resolveTarget = () =>
  typeof props.target === 'string'
    ? asElement(document.querySelector(props.target))
    : asElement(props.target?.value ?? props.target)

function bindExternal() {
  external = resolveTarget()

  if (!external) {
    return
  }

  attachReferenceHandlers(external)
  tooltip.reference.value = external
}

function unbindExternal() {
  if (!external) {
    return
  }

  detachReferenceHandlers(external)
  external = null
}

let boundChild: HTMLElement | null = null

function setChildReference(node: any) {
  const element = asElement(node)

  if (boundChild !== element) {
    if (boundChild) {
      detachReferenceHandlers(boundChild)
    }

    boundChild = element

    if (boundChild) {
      attachReferenceHandlers(boundChild)
    }
  }

  tooltip.reference.value = element
}

onMounted(() => props.target && bindExternal())
onBeforeUnmount(() => {
  cancelInteractiveClose()
  unbindExternal()

  if (boundChild) {
    detachReferenceHandlers(boundChild)
    boundChild = null
  }
})

const arrowPosition = computed(() => props.arrowPosition ?? 'side')

/** `merge` draws the arrow as part of the tooltip body, which needs extra styles. */
const mergeStyles = computed(() =>
  arrowPosition.value === 'merge' && props.withArrow
    ? getArrowMergeDropdownStyles({
        position: tooltip.placement.value as FloatingPosition,
        dir: dir.value,
      })
    : undefined,
)

const mounted = computed(() => tooltip.opened.value)

function setFloating(node: any) {
  tooltip.floating.value = asElement(node)
}

function setArrow(node: any) {
  tooltip.arrowRef.value = asElement(node)
}

const tooltipStyles = (transitionStyle: any) =>
  getStyles('tooltip', {
    className: attrs.class,
    style: [
      attrs.style,
      transitionStyle,
      mergeStyles.value,
      {
        zIndex: props.zIndex,
        top: `${tooltip.y.value ?? 0}px`,
        left: `${tooltip.x.value ?? 0}px`,
        display: tooltip.referenceHidden.value ? 'none' : undefined,
      },
    ],
  })

const label = computed(() => resolveNode(props.label, slots.label))

/** The label is renderable content, which cannot be interpolated as text. */
const renderLabel = () => label.value

const renderReference = Object.assign(
  (slotProps: { nodes?: () => VNodeChild }): VNodeChild => {
    if (props.target) {
      return null
    }

    const child = one({ default: slotProps.nodes })

    if (!child) {
      throw new Error(
        'Tooltip component children should be a single element or component that accepts ref',
      )
    }

    return cloneVNode(
      child,
      {
        [props.refProp ?? 'ref']: mergeRefs(setChildReference, (child as any).ref),
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
    <!-- Aliased: a bare `<Transition>` in a template resolves to Vue's built-in. -->
    <MantineTransitionComponent
      v-bind="props.transitionProps"
      :mounted="mounted"
      :keep-mounted="props.keepMounted"
    >
      <template #default="transitionStyle">
        <Box
          :ref="setFloating"
          v-bind="{ ...attrs, ...tooltipStyles(transitionStyle) }"
          role="tooltip"
          :data-multiline="props.multiline || undefined"
          :data-fixed="props.floatingStrategy === 'fixed' || undefined"
          :data-interactive="props.interactive && mounted ? true : undefined"
          @mouseenter="props.interactive && (cancelInteractiveClose(), tooltip.open())"
          @mouseleave="props.interactive && closeFromPointer()"
        >
          <component :is="renderLabel" />
          <FloatingArrow
            :ref="setArrow"
            v-bind="getStyles('arrow')"
            :visible="props.withArrow"
            :position="tooltip.placement.value as FloatingPosition"
            :arrow-size="props.arrowSize ?? 4"
            :arrow-offset="props.arrowOffset ?? 5"
            :arrow-radius="props.arrowRadius ?? 0"
            :arrow-position="arrowPosition"
            :arrow-x="tooltip.arrowX.value"
            :arrow-y="tooltip.arrowY.value"
          />
        </Box>
      </template>
    </MantineTransitionComponent>
  </OptionalPortal>

  <component :is="renderReference" :nodes="slots.default" />
</template>
