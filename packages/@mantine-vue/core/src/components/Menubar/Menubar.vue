<script lang="ts">
import { cloneVNode, Comment, Fragment, type VNode, type VNodeChild } from 'vue'

const defaultProps = {
  trigger: 'click',
  loop: true,
  position: 'bottom-start',
} as const

/**
 * Walks the default slot and stamps each `Menubar.Menu` with its position, flattening
 * fragments and skipping comments so conditional children do not shift the indexes.
 * This is VNode work a template cannot express, so it stays a function.
 */
function assignMenuIndexes(nodes: VNodeChild[], state: { i: number }, out: VNodeChild[]) {
  for (const node of nodes) {
    if (node == null || typeof node === 'boolean' || node === '') {
      continue
    }
    if (Array.isArray(node)) {
      assignMenuIndexes(node, state, out)
      continue
    }
    if (typeof node === 'string' || typeof node === 'number') {
      out.push(node)
      continue
    }
    const vnode = node as VNode
    if (vnode.type === Fragment) {
      const inner = Array.isArray(vnode.children)
        ? (vnode.children as VNodeChild[])
        : vnode.children
          ? [vnode.children as VNodeChild]
          : []
      assignMenuIndexes(inner, state, out)
      continue
    }
    if (vnode.type === Comment) {
      continue
    }
    if (typeof vnode.type === 'object' || typeof vnode.type === 'function') {
      out.push(cloneVNode(vnode, { __index: state.i++ }, true))
    } else {
      out.push(vnode)
    }
  }
}

export { defaultProps, assignMenuIndexes }
</script>

<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import { useSlotRevision } from '../../utils/use-slot-revision'
import { provideMenubarContext, type MenubarContextValue } from './Menubar.context'
import type { MenubarOwnProps, MenubarSlots } from './Menubar.types'
import classes from './Menubar.module.css'

defineOptions({
  name: 'Menubar',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<MenubarOwnProps>(), {
  openIndex: undefined,
  defaultOpenIndex: undefined,
  loop: undefined,
  unstyled: false,
})

defineSlots<MenubarSlots>()

const emit = defineEmits<{
  'update:openIndex': [index: number | null]
}>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Menubar', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Menubar',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
})

const instance = getCurrentInstance()
const rootRef = ref<HTMLDivElement | null>(null)
const setRootRef = (el: any) => {
  rootRef.value = (el?.$el ?? el) as HTMLDivElement | null
}
const menubarId = useId()
const revision = ref(0)

const [openIndexRef, setOpenIndex] = useUncontrolled<number | null>({
  value: () => props.openIndex,
  defaultValue: props.defaultOpenIndex ?? undefined,
  finalValue: null,
  onChange: (value) => emit('update:openIndex', value),
})

const activeIndex = ref(0)
const openSource = ref<'click' | 'hover' | null>(null)

const openMenu = (index: number, source: 'click' | 'hover') => {
  openSource.value = source
  setOpenIndex(index)
}

const closeMenu = () => {
  openSource.value = null
  setOpenIndex(null)
}

let closeTimeout = -1
const cancelClose = () => window.clearTimeout(closeTimeout)
const scheduleClose = () => {
  window.clearTimeout(closeTimeout)
  closeTimeout = window.setTimeout(closeMenu, 120)
}

const getOpenSource = () => openSource.value

// Holds the opened index from before the latest change so menus can skip enter/exit
// transitions when switching between siblings while the bar is already open.
const previousOpenIndex = ref<number | null>(openIndexRef.value)
watch(openIndexRef, (_value, oldValue) => {
  previousOpenIndex.value = oldValue
})
const getPreviousOpenIndex = () => previousOpenIndex.value

const getTargets = () =>
  Array.from(rootRef.value?.querySelectorAll<HTMLButtonElement>('[data-menubar-target]') ?? [])

const getMenuIndex = (id: string) =>
  getTargets().findIndex((node) => node.getAttribute('data-menubar-id') === id)

const getEnabledIndexes = () =>
  getTargets().reduce<number[]>((acc, node, index) => {
    if (!node.disabled && !node.hasAttribute('data-disabled')) {
      acc.push(index)
    }
    return acc
  }, [])

const getAdjacentIndex = (current: number, direction: 1 | -1) => {
  const enabled = getEnabledIndexes()
  if (enabled.length === 0) {
    return current
  }
  const currentPosition = enabled.indexOf(current)
  let nextPosition = currentPosition === -1 ? 0 : currentPosition + direction
  if (props.loop) {
    nextPosition = (nextPosition + enabled.length) % enabled.length
  } else {
    nextPosition = Math.max(0, Math.min(enabled.length - 1, nextPosition))
  }
  return enabled[nextPosition] ?? current
}

const focusTarget = (index: number) => {
  getTargets()[index]?.focus({ preventScroll: true })
}

const focusMenuItem = (index: number, position: 'first' | 'last') => {
  window.setTimeout(() => {
    const target = getTargets()[index]
    const controls = target?.getAttribute('aria-controls')
    const dropdown = controls
      ? document.getElementById(controls)
      : document.querySelector<HTMLElement>(`[data-menubar-dropdown="${menubarId.value}"]`)
    const items = dropdown?.querySelectorAll<HTMLElement>('[data-menu-item]:not([data-disabled])')
    if (items && items.length > 0) {
      const item = position === 'first' ? items[0] : items[items.length - 1]
      item?.focus({ preventScroll: true })
    }
  }, 40)
}

// Keep the single menubar tab stop on an enabled target, mirroring React's roving-tabindex
// effect. While a menu is open the tab stop stays on the opened target.
const syncActiveIndex = () => {
  const enabled = getEnabledIndexes()
  if (enabled.length === 0) {
    return
  }
  const opened = openIndexRef.value
  if (opened !== null && enabled.includes(opened)) {
    if (activeIndex.value !== opened) {
      activeIndex.value = opened
    }
    return
  }
  if (!enabled.includes(activeIndex.value)) {
    activeIndex.value = enabled[0]
  }
}

let observer: MutationObserver | undefined
onMounted(() => {
  if (!rootRef.value) {
    rootRef.value = (instance?.proxy?.$el as HTMLDivElement | null) ?? null
  }
  revision.value += 1
  syncActiveIndex()
  if (typeof MutationObserver !== 'undefined' && rootRef.value) {
    observer = new MutationObserver(() => {
      revision.value += 1
    })
    observer.observe(rootRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'data-disabled'],
    })
  }
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.clearTimeout(closeTimeout)
})

watch([openIndexRef, revision], syncActiveIndex)

const context: MenubarContextValue = {
  getStyles,
  get id() {
    return menubarId.value
  },
  revision,
  get openIndex() {
    return openIndexRef.value
  },
  setOpenIndex,
  openMenu,
  closeMenu,
  scheduleClose,
  cancelClose,
  getOpenSource,
  getPreviousOpenIndex,
  get activeIndex() {
    return activeIndex.value
  },
  setActiveIndex: (index: number) => {
    activeIndex.value = index
  },
  get trigger() {
    return props.trigger as 'click' | 'hover'
  },
  get loop() {
    return props.loop as boolean
  },
  get position() {
    return props.position as string
  },
  get unstyled() {
    return props.unstyled
  },
  getMenuIndex,
  getTargets,
  getEnabledIndexes,
  getAdjacentIndex,
  focusTarget,
  focusMenuItem,
}

provideMenubarContext(context)
defineExpose({ getTargets, getEnabledIndexes })

const slotRevision = useSlotRevision()

/**
 * The children are cloned to carry their index, so they are produced from a functional
 * render root rather than a plain `<slot />`.
 *
 * That render root only re-runs for reactive state it read, and the slot it walks is not
 * reactive state, so `slotRevision` subscribes it to `Menubar` receiving new children —
 * without it the indexes are stamped once and a changed set of menus never re-renders.
 */
const renderChildren = () => {
  void slotRevision.value

  const rawChildren = slots.default?.() ?? []
  const children: VNodeChild[] = []

  assignMenuIndexes(Array.isArray(rawChildren) ? rawChildren : [rawChildren], { i: 0 }, children)

  return children
}
</script>

<template>
  <Box
    :ref="setRootRef"
    v-bind="{ ...attrs, ...getStyles('root') }"
    role="menubar"
    aria-orientation="horizontal"
    :mod="props.mod"
    data-menubar=""
  >
    <component :is="renderChildren" />
  </Box>
</template>
