<script lang="ts">
import { Comment, Fragment, type VNode } from 'vue'
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getSpacing,
  getThemeColor,
  rem,
} from '../../core'

const defaultProps = {
  orientation: 'horizontal',
  iconPosition: 'left',
  allowNextStepsSelect: true,
  wrap: true,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { color, iconSize, size, contentPadding, radius, autoContrast }) => ({
    root: {
      '--stepper-color': color ? getThemeColor(color, theme) : undefined,
      '--stepper-icon-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
      '--stepper-icon-size':
        iconSize === undefined ? getSize(size, 'stepper-icon-size') : rem(iconSize),
      '--stepper-content-padding': getSpacing(contentPadding),
      '--stepper-radius': radius === undefined ? undefined : getRadius(radius),
      '--stepper-fz': getFontSize(size),
      '--stepper-spacing': getSpacing(size),
    },
  }),
)

/** Reads the children a `Stepper.Step` or `Stepper.Completed` was given. */
function getSlotContent(vnode: VNode | undefined) {
  const children = vnode?.children as any
  return typeof children?.default === 'function' ? children.default() : children
}

/**
 * `v-for` and conditionals produce fragments, and whitespace/`v-if` produce comments.
 * Both have to be unwrapped before steps can be counted and indexed.
 */
function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) =>
    child.type === Fragment && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : child.type === Comment
        ? []
        : [child],
  )
}

export { defaultProps, varsResolver, getSlotContent, flattenChildren }
</script>

<script setup lang="ts">
import { computed, cloneVNode, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { provideStepperContext } from './Stepper.context'
import { StepperCompleted } from './StepperCompleted/StepperCompleted'
import type { StepperStepSlots } from './StepperStep/StepperStep'
import type { StepperEmits, StepperOwnProps, StepperSlots } from './Stepper.types'
import classes from './Stepper.module.css'

defineOptions({
  name: 'Stepper',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<StepperOwnProps>(), {
  allowNextStepsSelect: undefined,
  wrap: undefined,
  autoContrast: undefined,
  // `VNodeChild` includes `boolean`, so these would be cast as well.
  icon: undefined,
  completedIcon: undefined,
  progressIcon: undefined,
  keepMounted: false,
  unstyled: false,
})

defineSlots<StepperSlots>()

const emit = defineEmits<StepperEmits>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Stepper', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Stepper',
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

provideStepperContext({
  getStyles,
  get orientation() {
    return props.orientation
  },
  get iconPosition() {
    return props.iconPosition
  },
} as any)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

const stepsMod = computed(() => ({
  orientation: props.orientation,
  iconPosition: props.iconPosition,
  // Vertical steps are always stacked, so wrapping is meaningless there.
  wrap: props.wrap && props.orientation !== 'vertical',
}))

/** Splits the default slot into the steps and the optional completed node. */
function getChildren(nodes?: () => VNode[]) {
  const children = flattenChildren((nodes?.() ?? []) as VNode[])

  return {
    steps: children.filter((child) => child.type !== StepperCompleted),
    completed: children.find((child) => child.type === StepperCompleted),
  }
}

/**
 * Rendered through `<component :is>` so the VNode cloning stays out of the template
 * while remaining part of this component's render, which keeps it reactive.
 */
const renderItems = Object.assign(
  (slotProps: { nodes?: () => VNode[] }): VNodeChild => {
    const { steps } = getChildren(slotProps.nodes)
    const items: VNodeChild[] = []

    steps.forEach((item, index) => {
      const itemProps = (item.props ?? {}) as Record<string, any>
      // Slots declared on Stepper.Step itself. They must win over the fragments inherited from
      // Stepper, otherwise the injected props below would always shadow them.
      const itemSlots = (item.children ?? {}) as unknown as Partial<StepperStepSlots>
      const state =
        props.active === index
          ? 'stepProgress'
          : props.active > index
            ? 'stepCompleted'
            : 'stepInactive'
      const selectable =
        typeof itemProps.allowStepSelect === 'boolean'
          ? itemProps.allowStepSelect
          : state === 'stepCompleted' || props.allowNextStepsSelect

      items.push(
        cloneVNode(
          item,
          {
            icon: itemSlots.icon
              ? itemProps.icon
              : (itemProps.icon ??
                props.icon ??
                (slots.icon ? (payload: { step: number }) => slots.icon!(payload) : index + 1)),
            step: index,
            state,
            onClick: () => {
              if (!selectable) return
              emit('step-click', index)
              emit('update:active', index)
            },
            allowStepClick: selectable,
            completedIcon: itemSlots.completedIcon
              ? itemProps.completedIcon
              : (itemProps.completedIcon ??
                props.completedIcon ??
                (slots.completedIcon
                  ? (payload: { step: number }) => slots.completedIcon!(payload)
                  : undefined)),
            progressIcon: itemSlots.progressIcon
              ? itemProps.progressIcon
              : (itemProps.progressIcon ??
                props.progressIcon ??
                (slots.progressIcon
                  ? (payload: { step: number }) => slots.progressIcon!(payload)
                  : undefined)),
            color: itemProps.color ?? props.color,
            iconSize: props.iconSize,
            iconPosition: itemProps.iconPosition ?? props.iconPosition,
            orientation: props.orientation,
          },
          true,
        ),
      )

      // Vertical steppers draw their separator with CSS, horizontal ones need a node.
      if (props.orientation === 'horizontal' && index !== steps.length - 1) {
        items.push(
          h('div', {
            ...getStyles('separator'),
            'data-active': index < props.active || undefined,
            'data-orientation': props.orientation,
            key: `separator-${index}`,
          }),
        )
      }
    })

    return items
  },
  { props: { nodes: { type: Function, required: false } } },
)

/** Renders the panel of the active step, or every panel when `keepMounted` is set. */
const renderContents = Object.assign(
  (slotProps: { nodes?: () => VNode[] }): VNodeChild => {
    const { steps, completed } = getChildren(slotProps.nodes)

    if (props.keepMounted) {
      return [
        ...steps.map((step, index) =>
          h(
            'div',
            {
              ...getStyles('content'),
              style: [
                getStyles('content').style,
                props.active === index ? undefined : { display: 'none' },
              ],
              'aria-hidden': props.active === index ? undefined : 'true',
            },
            getSlotContent(step),
          ),
        ),
        completed
          ? h(
              'div',
              {
                ...getStyles('content'),
                style: [
                  getStyles('content').style,
                  props.active > steps.length - 1 ? undefined : { display: 'none' },
                ],
                'aria-hidden': props.active > steps.length - 1 ? undefined : 'true',
              },
              getSlotContent(completed),
            )
          : null,
      ]
    }

    const content =
      props.active > steps.length - 1
        ? getSlotContent(completed)
        : getSlotContent(steps[props.active])

    return content ? h('div', getStyles('content'), content) : null
  },
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <Box v-bind="{ ...attrs, ...rootStyles }" :mod="props.mod" :size="props.size">
    <Box v-bind="getStyles('steps')" :mod="stepsMod">
      <component :is="renderItems" :nodes="slots.default" />
    </Box>
    <component :is="renderContents" :nodes="slots.default" />
  </Box>
</template>
