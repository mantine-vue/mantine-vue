import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
  type SlotsType,
  type VNode,
  type VNodeChild,
} from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { withBoxProps, Box, useProps, useStyles } from '../../core'
import { provideMenubarContext, type MenubarContextValue } from './Menubar.context'
import { MenubarDropdown } from './MenubarDropdown/MenubarDropdown'
import { MenubarMenu } from './MenubarMenu/MenubarMenu'
import { MenubarTarget } from './MenubarTarget/MenubarTarget'
import classes from './Menubar.module.css'

export type MenubarStylesNames = 'root' | 'target'

export interface MenubarProps {
  /** Index of the controlled opened menu, `null` closes all menus */
  openIndex?: number | null

  /** Index of the opened menu for uncontrolled component @default `null` */
  defaultOpenIndex?: number | null

  /** Called when the opened menu changes with its index or `null` when all menus are closed */
  onOpenChange?: (index: number | null) => void

  /** Event that opens a menu when none of the menus is opened. `'click'` opens a menu on target
   * click and then switches menus on hover (desktop application pattern), `'hover'` opens a menu
   * when the target is hovered @default `'click'` */
  trigger?: 'click' | 'hover'

  /** If set, arrow key navigation wraps from last to first menu and vice versa @default `true` */
  loop?: boolean

  /** Dropdown position relative to the target element @default `'bottom-start'` */
  position?: string

  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  mod?: any
  [key: string]: any
}

export interface MenubarSlots {
  default?: () => VNodeChild
}

const defaultProps = {
  trigger: 'click',
  loop: true,
  position: 'bottom-start',
} satisfies Partial<MenubarProps>

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

const MenubarBase = defineComponent({
  name: 'Menubar',
  inheritAttrs: false,
  slots: Object as SlotsType<MenubarSlots>,
  props: {
    openIndex: { type: null as unknown as PropType<number | null>, default: undefined },
    defaultOpenIndex: { type: null as unknown as PropType<number | null>, default: undefined },
    onOpenChange: {
      type: Function as PropType<(index: number | null) => void>,
      default: undefined,
    },
    trigger: { type: String as PropType<'click' | 'hover'>, default: undefined },
    loop: { type: Boolean, default: undefined },
    position: { type: String, default: undefined },
    mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots, expose }) {
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
      onChange: (value) => props.onOpenChange?.(value),
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
        const items = dropdown?.querySelectorAll<HTMLElement>(
          '[data-menu-item]:not([data-disabled])',
        )
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
    expose({ getTargets, getEnabledIndexes })

    return () => {
      const rawChildren = slots.default?.() ?? []
      const children: VNodeChild[] = []
      assignMenuIndexes(
        Array.isArray(rawChildren) ? rawChildren : [rawChildren],
        { i: 0 },
        children,
      )

      return h(
        Box,
        {
          ...attrs,
          ref: setRootRef,
          role: 'menubar',
          'aria-orientation': 'horizontal',
          mod: props.mod,
          ...getStyles('root'),
          'data-menubar': '',
        },
        () => children,
      )
    }
  },
})

export const Menubar = withBoxProps(
  Object.assign(MenubarBase, {
    classes,
    Menu: MenubarMenu,
    Target: MenubarTarget,
    Dropdown: MenubarDropdown,
  }),
)
