<script lang="ts">
import { createVarsResolver, getDefaultZIndex, getRadius, getShadow } from '../../core'

const defaults = {
  position: 'bottom',
  offset: 8,
  width: 'max-content',
  withArrow: false,
  arrowSize: 7,
  arrowOffset: 5,
  arrowRadius: 0,
  arrowPosition: 'side',
  withinPortal: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: false,
  withRoles: true,
  returnFocus: false,
  keepMounted: false,
  zIndex: getDefaultZIndex('popover'),
  floatingStrategy: 'absolute',
  transitionProps: { transition: 'fade', duration: 150 },
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, props) => ({
  dropdown: {
    '--popover-radius': props.radius === undefined ? undefined : getRadius(props.radius),
    '--popover-shadow': getShadow(props.shadow),
  },
}))

export { defaults, varsResolver }
</script>

<script setup lang="ts">
import {
  arrow,
  autoUpdate,
  flip,
  hide,
  inline,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  type Middleware,
} from '@floating-ui/vue'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useClickOutside, useId } from '@mantine-vue/hooks'
import { useDirection, useProps, useStyles } from '../../core'
import { getFloatingPosition, type FloatingPosition } from '../../utils/Floating'
import { Overlay } from '../Overlay'
import { OptionalPortal } from '../Portal'
import { Transition as MantineTransitionComponent } from '../Transition'
import { providePopoverContext } from './Popover.context'
import { asElement } from './popover-utils'
import type { PopoverProps, PopoverSlots } from './Popover.types'
import classes from './Popover.module.css'

defineOptions({
  name: 'Popover',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<PopoverProps>(), {
  opened: undefined,
  withArrow: undefined,
  withinPortal: undefined,
  closeOnClickOutside: undefined,
  closeOnEscape: undefined,
  trapFocus: undefined,
  withRoles: undefined,
  returnFocus: undefined,
  keepMounted: undefined,
  defaultOpened: false,
  disabled: false,
  withOverlay: false,
  unstyled: false,
  __staticSelector: 'Popover',
})

defineSlots<PopoverSlots>()

const emit = defineEmits<{
  'update:opened': [opened: boolean]
  open: []
  close: []
  dismiss: []
}>()

const props = useProps('Popover', defaults, rawProps)

const { dir } = useDirection()
const id = useId(props.id)

const internal = ref(props.defaultOpened)

// Deliberately the raw prop: `useProps` cannot tell "not set" from "set to false", and
// an undefined `opened` is what makes the popover uncontrolled.
const isControlled = computed(() => rawProps.opened !== undefined)
const opened = computed(() => (isControlled.value ? !!rawProps.opened : internal.value))

const reference = ref<any>(null)
const floating = ref<HTMLElement | null>(null)
const arrowElement = ref<HTMLElement | null>(null)

/** Only needed for `width: 'target'`, and kept in step with a `ResizeObserver`. */
const targetWidth = ref<number | undefined>()
let resizeObserver: ResizeObserver | undefined

function updateTargetWidth() {
  const width = reference.value?.getBoundingClientRect?.().width
  targetWidth.value = typeof width === 'number' ? width : undefined
}

const placement = computed(() => getFloatingPosition(dir.value, props.position as FloatingPosition))

const middleware = computed<Middleware[]>(() => {
  const result: Middleware[] = [
    // The arrow sits between the dropdown and the target, so it has to be offset around.
    offset(
      typeof props.offset === 'number'
        ? props.offset + (props.withArrow ? (props.arrowSize ?? 7) / 2 : 0)
        : (props.offset as any),
    ),
    hide(),
  ]

  if (props.middlewares?.flip !== false) {
    result.push(flip(typeof props.middlewares?.flip === 'object' ? props.middlewares.flip : {}))
  }

  if (props.middlewares?.shift !== false) {
    result.push(
      shift((state) => {
        const shiftOptions =
          typeof props.middlewares?.shift === 'object' ? props.middlewares.shift : {}
        const isVerticalPlacement =
          state.placement.startsWith('top') || state.placement.startsWith('bottom')

        return {
          limiter: limitShift(),
          padding: 5,
          // A target-width dropdown is exactly as wide as its target, so shifting it
          // along the main axis would only misalign it.
          ...(props.width === 'target' && isVerticalPlacement ? { mainAxis: false } : null),
          ...shiftOptions,
        }
      }),
    )
  }

  if (props.middlewares?.inline) {
    result.push(
      inline(typeof props.middlewares.inline === 'object' ? props.middlewares.inline : undefined),
    )
  }

  result.push(arrow({ element: arrowElement, padding: props.arrowOffset }))

  if (props.middlewares?.size || props.width === 'target') {
    result.push(
      size({
        ...(typeof props.middlewares?.size === 'object' ? props.middlewares.size : {}),
        apply: ({ rects, availableWidth, availableHeight, elements, ...rest }) => {
          const userSize = props.middlewares?.size

          if (userSize) {
            if (typeof userSize === 'object' && userSize.apply) {
              userSize.apply({ rects, availableWidth, availableHeight, elements, ...rest })
            } else {
              Object.assign(elements.floating.style, {
                maxWidth: `${availableWidth}px`,
                maxHeight: `${availableHeight}px`,
              })
            }
          }

          if (props.width === 'target') {
            elements.floating.style.width = `${rects.reference.width}px`
          }
        },
      }),
    )
  }

  return result
})

const floatingState = useFloating(reference, floating, {
  open: opened,
  placement,
  strategy: computed(() => props.floatingStrategy),
  middleware,
  whileElementsMounted: autoUpdate,
})

// The target may have been laid out only as the dropdown opened, so it is measured
// again after the DOM has settled.
watch(opened, async (value) => {
  if (value) {
    updateTargetWidth()
    await nextTick()
    updateTargetWidth()
    floatingState.update()
  }
})

watch(reference, (node) => {
  resizeObserver?.disconnect()
  updateTargetWidth()

  if (
    typeof Element !== 'undefined' &&
    node instanceof Element &&
    typeof ResizeObserver !== 'undefined'
  ) {
    resizeObserver = new ResizeObserver(updateTargetWidth)
    resizeObserver.observe(node)
  }
})

onBeforeUnmount(() => resizeObserver?.disconnect())

function setOpened(value: boolean) {
  if (props.disabled) {
    return
  }

  if (!isControlled.value) {
    internal.value = value
  }

  emit('update:opened', value)
}

function close() {
  if (!opened.value || props.disabled) {
    return
  }

  setOpened(false)
  emit('close')
}

function toggle() {
  const next = !opened.value
  setOpened(next)

  if (next) {
    emit('open')
  } else {
    emit('close')
  }
}

const targetNode = computed(() => reference.value?.$el ?? reference.value ?? null)
const dropdownNode = computed(() => (floating.value as any)?.$el ?? floating.value ?? null)

useClickOutside(
  () => {
    if (props.closeOnClickOutside) {
      close()
      emit('dismiss')
    }
  },
  undefined,
  () => [targetNode.value, dropdownNode.value],
  () => opened.value,
)

const getStyles = useStyles({
  // Components built on `Popover` – `Menu`, `Select`, `ColorInput` – generate their own
  // class names through this selector.
  name: props.__staticSelector ?? 'Popover',
  classes,
  props,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

providePopoverContext({
  get opened() {
    return opened.value
  },
  get controlled() {
    return isControlled.value
  },
  get disabled() {
    return props.disabled
  },
  get withRoles() {
    return props.withRoles ?? true
  },
  get withArrow() {
    return props.withArrow ?? false
  },
  get arrowSize() {
    return props.arrowSize ?? 7
  },
  get arrowOffset() {
    return props.arrowOffset ?? 5
  },
  get arrowRadius() {
    return props.arrowRadius ?? 0
  },
  get arrowPosition() {
    return props.arrowPosition ?? 'side'
  },
  get placement() {
    return floatingState.placement.value as FloatingPosition
  },
  get x() {
    return floatingState.x.value ?? 0
  },
  get y() {
    return floatingState.y.value ?? 0
  },
  get targetWidth() {
    return targetWidth.value
  },
  get arrowX() {
    return floatingState.middlewareData.value.arrow?.x
  },
  get arrowY() {
    return floatingState.middlewareData.value.arrow?.y
  },
  reference: (node) => {
    reference.value = asElement(node)
  },
  floating: (node) => {
    floating.value = asElement(node)
  },
  arrowRef: (node) => {
    arrowElement.value = asElement(node)
  },
  onToggle: toggle,
  onClose: close,
  onDismiss: () => emit('dismiss'),
  getTargetId: () => `${id.value}-target`,
  getDropdownId: () => `${id.value}-dropdown`,
  get targetProps() {
    return props.targetProps || {}
  },
  get transitionProps() {
    return props.transitionProps
  },
  get withinPortal() {
    return props.withinPortal ?? true
  },
  get portalProps() {
    return props.portalProps
  },
  get trapFocus() {
    return props.trapFocus ?? false
  },
  get closeOnEscape() {
    return props.closeOnEscape ?? true
  },
  get returnFocus() {
    return props.returnFocus ?? false
  },
  get keepMounted() {
    return props.keepMounted ?? false
  },
  get width() {
    return props.width ?? 'max-content'
  },
  get zIndex() {
    return props.zIndex ?? getDefaultZIndex('popover')
  },
  get floatingStrategy() {
    return props.floatingStrategy ?? 'absolute'
  },
  getStyles,
})

// A controlled popover never runs `toggle`, so the open/close callbacks are fired from
// the prop instead.
watch(
  () => rawProps.opened,
  (value, old) => {
    if (value === old || value === undefined) {
      return
    }

    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  },
)

const overlayDuration = computed(() => props.transitionProps?.duration || 250)
const overlayExitDuration = computed(() => props.transitionProps?.exitDuration || 250)

const overlayBindings = (transitionStyle: any) => ({
  ...props.overlayProps,
  ...getStyles('overlay', {
    className: props.overlayProps?.class,
    style: [transitionStyle, props.overlayProps?.style],
  }),
})
</script>

<template>
  <slot />

  <!-- Aliased: a bare `<Transition>` in a template resolves to Vue's built-in. -->
  <MantineTransitionComponent
    v-if="props.withOverlay"
    :mounted="opened"
    transition="fade"
    :duration="overlayDuration"
    :exit-duration="overlayExitDuration"
  >
    <template #default="transitionStyle">
      <OptionalPortal :within-portal="props.withinPortal">
        <Overlay v-bind="overlayBindings(transitionStyle)" />
      </OptionalPortal>
    </template>
  </MantineTransitionComponent>
</template>
