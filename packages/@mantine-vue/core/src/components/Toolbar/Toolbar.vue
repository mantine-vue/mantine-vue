<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../core'
const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, color, variant, autoContrast }) => {
    const activeColors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'filled',
      autoContrast,
    })
    return {
      root: {
        '--toolbar-toggle-size':
          size !== undefined ? getSize(size, 'toolbar-toggle-size') : undefined,
        '--toolbar-padding': size !== undefined ? getSize(size, 'toolbar-padding') : undefined,
        '--toolbar-gap': size !== undefined ? getSize(size, 'toolbar-gap') : undefined,
        '--toolbar-radius': radius !== undefined ? getRadius(radius) : undefined,
      },
      toggle: {
        '--toolbar-toggle-active-bg': activeColors.background,
        '--toolbar-toggle-active-hover': activeColors.hover,
        '--toolbar-toggle-active-color': activeColors.color,
      },
    }
  },
)
export { varsResolver }
</script>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, omitAttrs, useDirection, useProps, useStyles } from '../../core'
import { provideToolbarContext } from './Toolbar.context'
import type { ToolbarOwnProps, ToolbarSlots } from './Toolbar.types'
import classes from './Toolbar.module.css'

defineOptions({ name: 'Toolbar', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ToolbarOwnProps>(), {
  orientation: undefined,
  loop: undefined,
  withBorder: undefined,
  autoContrast: undefined,
  unstyled: false,
  variant: undefined,
})
defineSlots<ToolbarSlots>()
const attrs = useAttrs()
const props = useProps(
  'Toolbar',
  { orientation: 'horizontal', loop: true, withBorder: true, variant: 'filled' } as const,
  rawProps,
)
const { dir } = useDirection()
const getStyles = useStyles({
  name: 'Toolbar',
  classes,
  props,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})
provideToolbarContext({
  getStyles,
  get orientation() {
    return props.orientation!
  },
})
const rootElement = ref<HTMLElement | null>(null)
let observer: MutationObserver | undefined
let activeItem: HTMLElement | null = null
const items = () =>
  Array.from(
    rootElement.value?.querySelectorAll<HTMLElement>(
      '[data-toolbar-toggle]:not([data-disabled])',
    ) ?? [],
  )
function syncTabIndex() {
  const list = items()
  const stop = activeItem && list.includes(activeItem) ? activeItem : list[0]
  list.forEach((item) => (item.tabIndex = item === stop ? 0 : -1))
}
function onFocus(event: FocusEvent) {
  const target = event.target as HTMLElement
  if (items().includes(target)) {
    activeItem = target
    syncTabIndex()
  }
}
function onKeydown(event: KeyboardEvent) {
  const list = items()
  const current = list.indexOf(document.activeElement as HTMLElement)
  if (current < 0) return
  const forward =
    props.orientation === 'vertical'
      ? 'ArrowDown'
      : dir.value === 'rtl'
        ? 'ArrowLeft'
        : 'ArrowRight'
  const backward =
    props.orientation === 'vertical' ? 'ArrowUp' : dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
  let next: number | null = null
  if (event.key === forward) next = current < list.length - 1 ? current + 1 : props.loop ? 0 : null
  else if (event.key === backward)
    next = current > 0 ? current - 1 : props.loop ? list.length - 1 : null
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = list.length - 1
  if (next !== null) {
    event.preventDefault()
    list[next]?.focus()
  }
}
function setRootRef(node: any) {
  rootElement.value = node?.$el ?? node ?? null
  assignRef(props.rootRef, rootElement.value)
}
onMounted(() => {
  syncTabIndex()
  if (rootElement.value) {
    observer = new MutationObserver(syncTabIndex)
    observer.observe(rootElement.value, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-disabled'],
    })
  }
})
onBeforeUnmount(() => observer?.disconnect())
defineExpose({ rootElement })
</script>
<template>
  <Box
    v-bind="{ ...omitAttrs(attrs, ['onKeydown', 'onFocusin']), ...getStyles('root') }"
    :root-ref="setRootRef"
    role="toolbar"
    :aria-orientation="props.orientation"
    :data-orientation="props.orientation"
    :data-with-border="props.withBorder || undefined"
    :variant="props.variant"
    :size="props.size"
    @keydown="onKeydown"
    @focusin="onFocus"
    ><slot
  /></Box>
</template>
