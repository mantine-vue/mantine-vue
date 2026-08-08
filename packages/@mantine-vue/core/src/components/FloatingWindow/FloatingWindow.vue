<script lang="ts">
import { getDefaultZIndex } from '../../core'

const defaultProps = {
  constrainToViewport: true,
  withinPortal: true,
  zIndex: getDefaultZIndex('overlay'),
} as const

/** The initial size is clamped so it cannot start outside the configured bounds. */
function clampDimension(value: number, min?: number, max?: number) {
  let result = value

  if (min != null) {
    result = Math.max(result, min)
  }

  if (max != null) {
    result = Math.min(result, max)
  }

  return result
}

export { defaultProps, clampDimension }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { assignRef, useFloatingWindow } from '@mantine-vue/hooks'
import type { FloatingWindowPosition } from '@mantine-vue/hooks'
import { useProps, useStyles } from '../../core'
import { Paper } from '../Paper'
import { OptionalPortal } from '../Portal'
import { provideFloatingWindowContext, type FloatingWindowSize } from './FloatingWindow.context'
import type { FloatingWindowOwnProps, FloatingWindowSlots } from './FloatingWindow.types'
import classes from './FloatingWindow.module.css'

defineOptions({
  name: 'FloatingWindow',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<FloatingWindowOwnProps>(), {
  enabled: undefined,
  constrainToViewport: undefined,
  withinPortal: undefined,
  withBorder: false,
  unstyled: false,
})

defineSlots<FloatingWindowSlots>()

const emit = defineEmits<{
  'position-change': [position: FloatingWindowPosition]
  'drag-start': []
  'drag-end': []
  'size-change': [size: FloatingWindowSize]
  'resize-start': []
  'resize-end': []
}>()

const attrs = useAttrs()
const props = useProps('FloatingWindow', defaultProps, rawProps)

/**
 * A `Proxy` rather than a spread: the hook reads options lazily on every drag/resize
 * event, so overriding only the callback keys has to keep the rest of `props` reactive
 * instead of snapshotting it once.
 */
const floatingOptions = new Proxy(props, {
  get(target, key, receiver) {
    if (key === 'onPositionChange') {
      return (position: FloatingWindowPosition) => emit('position-change', position)
    }
    if (key === 'onDragStart') {
      return () => emit('drag-start')
    }
    if (key === 'onDragEnd') {
      return () => emit('drag-end')
    }
    return Reflect.get(target, key, receiver)
  },
})

const floating = useFloatingWindow<HTMLDivElement>(floatingOptions)
const rootRef = ref<HTMLDivElement | null>(null)

assignRef(props.setPositionRef, floating.setPosition)
defineExpose({ setPosition: floating.setPosition })

const getStyles = useStyles({
  name: 'FloatingWindow',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
})

/** The resize handle needs the root element and the resize configuration. */
provideFloatingWindowContext({
  rootRef,
  get dimensions() {
    return props.dimensions
  },
  get constrainToViewport() {
    return props.constrainToViewport
  },
  get constrainOffset() {
    return props.constrainOffset
  },
  onSizeChange: (size) => emit('size-change', size),
  onResizeStart: () => emit('resize-start'),
  onResizeEnd: () => emit('resize-end'),
})

function setRootRef(value: any) {
  const node = value?.$el ?? value
  rootRef.value = node
  floating.ref(node)
}

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

const rootMod = computed(() => [{ dragging: floating.isDragging.value }, props.mod])

const rootStyle = computed(() => [
  getStyles('root').style,
  {
    '--floating-window-z-index': String(props.zIndex),
    '--floating-window-width':
      props.dimensions?.initialWidth == null
        ? undefined
        : `${clampDimension(
            props.dimensions.initialWidth,
            props.dimensions.minWidth,
            props.dimensions.maxWidth,
          )}px`,
    '--floating-window-height':
      props.dimensions?.initialHeight == null
        ? undefined
        : `${clampDimension(
            props.dimensions.initialHeight,
            props.dimensions.minHeight,
            props.dimensions.maxHeight,
          )}px`,
  },
  attrs.style,
])
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Paper
      :ref="setRootRef"
      v-bind="{ ...attrs, ...rootStyles }"
      :shadow="props.shadow"
      :radius="props.radius"
      :with-border="props.withBorder"
      :mod="rootMod"
      :style="rootStyle"
    >
      <slot />
    </Paper>
  </OptionalPortal>
</template>
