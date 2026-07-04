import {
  cloneVNode,
  defineComponent,
  h,
  inject,
  nextTick,
  onUnmounted,
  provide,
  ref,
  type InjectionKey,
  type PropType,
} from 'vue'
import { Box, useStyles } from '../../core'
import { useDelayedHover } from '../../utils/Floating'
import { AccordionChevron } from '../Accordion'
import { Input } from '../Input'
import {
  Popover,
  PopoverContextMenu,
  PopoverDropdown,
  PopoverTarget,
  type PopoverProps,
} from '../Popover'
import { UnstyledButton } from '../UnstyledButton'
import { provideMenuContext, useMenuContext } from './Menu.context'
import classes from './Menu.module.css'

function call(handler: any, event: Event) {
  if (Array.isArray(handler)) handler.forEach((fn) => fn?.(event))
  else handler?.(event)
}
function menuItems(root: Element | null) {
  return Array.from(
    root?.querySelectorAll<HTMLElement>('[data-menu-item]:not([data-disabled])') ?? [],
  ).filter((node) => node.closest('[data-menu-dropdown]') === root)
}
function clearActive(root: Element | null) {
  root
    ?.querySelectorAll<HTMLElement>('[data-menu-active]')
    .forEach(
      (node) =>
        node.closest('[data-menu-dropdown]') === root && node.removeAttribute('data-menu-active'),
    )
}
function setActive(item: HTMLElement | null, root: Element | null) {
  clearActive(root)
  if (item) {
    item.setAttribute('data-menu-active', 'true')
    item.scrollIntoView?.({ block: 'nearest' })
  }
}
function getActiveIndex(items: HTMLElement[]) {
  return items.findIndex((item) => item.hasAttribute('data-menu-active'))
}
function focusAt(root: Element | null, current: HTMLElement | null, delta: number, loop: boolean) {
  const items = menuItems(root)
  if (!items.length) return
  let index = current ? items.indexOf(current) + delta : delta > 0 ? 0 : items.length - 1
  if (loop) index = (index + items.length) % items.length
  else index = Math.max(0, Math.min(items.length - 1, index))
  items[index]?.focus()
}

export interface MenuProps extends PopoverProps {
  closeOnItemClick?: boolean
  loop?: boolean
  trigger?: 'click' | 'hover' | 'click-hover'
  openDelay?: number
  closeDelay?: number
  menuItemTabIndex?: -1 | 0
  withInitialFocusPlaceholder?: boolean
  alignItemsLabels?: 'all' | 'with-indicators' | 'none'
  checkIcon?: any
}
const MenuBase = defineComponent({
  name: 'Menu',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, default: undefined },
    defaultOpened: Boolean,
    onChange: Function as PropType<(opened: boolean) => void>,
    onOpen: Function as PropType<() => void>,
    onClose: Function as PropType<() => void>,
    closeOnItemClick: { type: Boolean, default: true },
    loop: { type: Boolean, default: true },
    trigger: { type: String as PropType<'click' | 'hover' | 'click-hover'>, default: 'click' },
    openDelay: { type: Number, default: 0 },
    closeDelay: { type: Number, default: 100 },
    menuItemTabIndex: { type: Number as PropType<-1 | 0>, default: -1 },
    withInitialFocusPlaceholder: { type: Boolean, default: true },
    alignItemsLabels: {
      type: String as PropType<'all' | 'with-indicators' | 'none'>,
      default: 'with-indicators',
    },
    checkIcon: { default: undefined },
    classNames: [Object, Function],
    styles: [Object, Function],
    vars: [Object, Function],
    unstyled: Boolean,
  },
  setup(props, { attrs, slots }) {
    const internal = ref(props.defaultOpened)
    const searchCount = ref(0)
    const searchExitClear = ref<(() => void) | null>(null)
    const controlled = () => props.opened !== undefined
    const current = () => (controlled() ? !!props.opened : internal.value)
    const change = (value: boolean) => {
      if (!controlled()) internal.value = value
      props.onChange?.(value)
      if (value) props.onOpen?.()
      else {
        props.onClose?.()
        searchExitClear.value?.()
      }
    }
    const open = () => !current() && change(true)
    const close = () => current() && change(false)
    const toggle = () => (current() ? close() : open())
    const delayed = useDelayedHover({
      open,
      close,
      openDelay: props.openDelay,
      closeDelay: props.closeDelay,
    })
    const getStyles = useStyles({
      name: 'Menu',
      classes,
      props,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
    })
    provideMenuContext({
      get opened() {
        return current()
      },
      get hasSearch() {
        return searchCount.value > 0
      },
      registerSearch: () => {
        searchCount.value += 1
        return () => {
          searchCount.value = Math.max(0, searchCount.value - 1)
        }
      },
      setSearchExitClear: (callback) => {
        searchExitClear.value = callback
      },
      toggleDropdown: toggle,
      closeDropdownImmediately: close,
      openDropdown: props.trigger === 'click' ? open : delayed.openDropdown,
      closeDropdown: props.trigger === 'click' ? close : delayed.closeDropdown,
      get closeOnItemClick() {
        return props.closeOnItemClick
      },
      get loop() {
        return props.loop
      },
      get trigger() {
        return props.trigger
      },
      get menuItemTabIndex() {
        return props.menuItemTabIndex
      },
      getStyles,
      get unstyled() {
        return props.unstyled
      },
      get alignItemsLabels() {
        return props.alignItemsLabels
      },
      get checkIcon() {
        return props.checkIcon
      },
    })
    return () =>
      h(
        Popover,
        {
          ...attrs,
          opened: current(),
          onChange: (value: boolean) => change(value),
          defaultOpened: props.defaultOpened,
          trapFocus: (attrs as any).keepMounted ? false : ((attrs as any).trapFocus ?? true),
          returnFocus: (attrs as any).returnFocus ?? true,
          __staticSelector: 'Menu',
          classNames: props.classNames,
          styles: props.styles,
          unstyled: props.unstyled,
        },
        slots,
      )
  },
})

export const MenuTarget = defineComponent({
  name: 'MenuTarget',
  inheritAttrs: false,
  props: { refProp: { type: String, default: 'ref' } },
  setup(props, { attrs, slots }) {
    const ctx = useMenuContext()
    return () =>
      h(
        PopoverTarget,
        { ...attrs, refProp: props.refProp },
        {
          default: () => {
            const children = slots.default?.() ?? []
            if (children.length !== 1) return children
            const child = children[0]
            return cloneVNode(
              child,
              {
                onClick:
                  ctx.trigger === 'click' || ctx.trigger === 'click-hover'
                    ? () => ctx.toggleDropdown()
                    : undefined,
                onMouseenter:
                  ctx.trigger === 'hover' || ctx.trigger === 'click-hover'
                    ? ctx.openDropdown
                    : undefined,
                onMouseleave: ctx.trigger === 'hover' ? ctx.closeDropdown : undefined,
                onKeydown: (event: KeyboardEvent) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    ctx.openDropdown()
                    nextTick(() =>
                      menuItems(document.querySelector('[data-menu-dropdown]'))[0]?.focus(),
                    )
                  }
                },
              },
              true,
            )
          },
        },
      )
  },
})

export const MenuDropdown = defineComponent({
  name: 'MenuDropdown',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const ctx = useMenuContext()
    let query = ''
    let queryTimer: ReturnType<typeof setTimeout> | undefined
    return () =>
      h(
        PopoverDropdown,
        {
          ...attrs,
          role: 'menu',
          'data-menu-dropdown': '',
          ...ctx.getStyles('dropdown', { className: attrs.class, style: attrs.style }),
          onMouseenter: ctx.trigger !== 'click' ? ctx.openDropdown : undefined,
          onMouseleave: ctx.trigger !== 'click' ? ctx.closeDropdown : undefined,
          onKeydown: (event: KeyboardEvent) => {
            call((attrs as any).onKeydown, event)
            if (event.defaultPrevented || ctx.hasSearch) {
              return
            }
            const root = event.currentTarget as HTMLElement
            const active = document.activeElement as HTMLElement
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              focusAt(root, active, 1, ctx.loop)
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              focusAt(root, active, -1, ctx.loop)
            } else if (event.key === 'Home') {
              event.preventDefault()
              menuItems(root)[0]?.focus()
            } else if (event.key === 'End') {
              event.preventDefault()
              menuItems(root).at(-1)?.focus()
            } else if (
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey
            ) {
              query += event.key.toLowerCase()
              clearTimeout(queryTimer)
              queryTimer = setTimeout(() => (query = ''), 500)
              const match = menuItems(root).find((item) =>
                item.textContent?.trim().toLowerCase().startsWith(query),
              )
              match?.focus()
            }
          },
        },
        slots,
      )
  },
})

export const MenuItem = defineComponent({
  name: 'MenuItem',
  inheritAttrs: false,
  props: {
    component: { type: [String, Object, Function], default: 'button' },
    color: String,
    closeMenuOnClick: { type: Boolean, default: undefined },
    leftSection: { type: null as any, default: undefined },
    rightSection: { type: null as any, default: undefined },
    indicator: { type: null as any, default: undefined },
    disabled: Boolean,
    reserveIndicator: Boolean,
  },
  setup(props, { attrs, slots }) {
    const ctx = useMenuContext()
    return () => {
      const indicator = ctx.alignItemsLabels === 'all' || props.reserveIndicator
      return h(
        UnstyledButton,
        {
          ...attrs,
          component: props.component,
          type: props.component === 'button' ? 'button' : undefined,
          role: (attrs as any).role ?? 'menuitem',
          tabindex: ctx.menuItemTabIndex,
          disabled: props.disabled,
          'data-menu-item': '',
          'data-disabled': props.disabled || (attrs as any)['data-disabled'] || undefined,
          'data-mantine-stop-propagation': '',
          unstyled: ctx.unstyled,
          ...ctx.getStyles('item', { className: attrs.class, style: attrs.style }),
          onMousedown: (event: MouseEvent) => event.preventDefault(),
          onClick: (event: MouseEvent) => {
            call((attrs as any).onClick, event)
            if (
              !props.disabled &&
              !(attrs as any)['data-disabled'] &&
              (props.closeMenuOnClick ?? ctx.closeOnItemClick)
            )
              ctx.closeDropdownImmediately()
          },
        },
        () => [
          indicator && h('span', ctx.getStyles('itemIndicator'), props.indicator as any),
          props.leftSection != null &&
            h(
              'span',
              { ...ctx.getStyles('itemSection'), 'data-position': 'left' },
              props.leftSection as any,
            ),
          h('span', ctx.getStyles('itemLabel'), slots),
          props.rightSection != null &&
            h(
              'span',
              { ...ctx.getStyles('itemSection'), 'data-position': 'right' },
              props.rightSection as any,
            ),
        ],
      )
    }
  },
})
export const MenuLabel = defineComponent({
  name: 'MenuLabel',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const ctx = useMenuContext()
    return () =>
      h(
        Box,
        { ...attrs, ...ctx.getStyles('label', { className: attrs.class, style: attrs.style }) },
        slots,
      )
  },
})
export const MenuDivider = defineComponent({
  name: 'MenuDivider',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const ctx = useMenuContext()
    return () =>
      h(Box, {
        ...attrs,
        role: 'separator',
        ...ctx.getStyles('divider', { className: attrs.class, style: attrs.style }),
      })
  },
})
export const MenuSearch = defineComponent({
  name: 'MenuSearch',
  inheritAttrs: false,
  props: {
    clearSearchOnClose: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    const ctx = useMenuContext()
    const unregister = ctx.registerSearch()
    ctx.setSearchExitClear(
      props.clearSearchOnClose
        ? () => {
            clearActive(document.querySelector('[data-menu-dropdown]'))
            ;(attrs as any).onChange?.({
              currentTarget: { value: '' },
              target: { value: '' },
            })
          }
        : null,
    )
    onUnmounted(() => {
      unregister()
      ctx.setSearchExitClear(null)
    })

    return () => {
      const searchStyles = ctx.getStyles('search', { className: attrs.class, style: attrs.style })
      const forwarded = { ...attrs } as Record<string, any>
      delete forwarded.class
      delete forwarded.style
      delete forwarded.classNames
      delete forwarded.styles
      delete forwarded.onKeydown
      delete forwarded.onKeyDown
      delete forwarded.onChange
      delete forwarded.onInput

      const inputClassNames = (attrs as any).classNames as Record<string, any> | undefined
      const inputStyles = (attrs as any).styles as Record<string, any> | undefined

      return h(Input, {
        ...forwarded,
        type: 'search',
        'data-autofocus': '',
        'data-mantine-stop-propagation': '',
        __staticSelector: 'Menu',
        classNames: {
          ...inputClassNames,
          input: [searchStyles.class, inputClassNames?.input].filter(Boolean),
        },
        styles: {
          ...inputStyles,
          input: {
            ...searchStyles.style,
            ...inputStyles?.input,
          },
        },
        onInput: (event: Event) => {
          call((attrs as any).onInput, event)
          call((attrs as any).onChange, event)
          clearActive((event.currentTarget as HTMLElement).closest('[data-menu-dropdown]'))
        },
        onChange: (event: Event) => {
          call((attrs as any).onChange, event)
          clearActive((event.currentTarget as HTMLElement).closest('[data-menu-dropdown]'))
        },
        onKeydown: (event: KeyboardEvent) => {
          call((attrs as any).onKeydown ?? (attrs as any).onKeyDown, event)

          if (event.defaultPrevented) {
            return
          }

          const root = (event.currentTarget as HTMLElement).closest('[data-menu-dropdown]')
          const items = menuItems(root)
          const current = getActiveIndex(items)

          if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (items.length > 0) {
              const next = current >= items.length - 1 ? (ctx.loop ? 0 : current) : current + 1
              setActive(items[next] ?? null, root)
            }
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (items.length > 0) {
              const next =
                current <= 0
                  ? current === -1
                    ? items.length - 1
                    : ctx.loop
                      ? items.length - 1
                      : 0
                  : current - 1
              setActive(items[next] ?? null, root)
            }
          } else if (event.key === 'Home') {
            event.preventDefault()
            setActive(items[0] ?? null, root)
          } else if (event.key === 'End') {
            event.preventDefault()
            setActive(items.at(-1) ?? null, root)
          } else if (event.key === 'Enter') {
            if ((event as any).isComposing || (event as any).keyCode === 229) {
              return
            }

            const target = items[current]

            if (target) {
              event.preventDefault()

              if (target.hasAttribute('data-sub-menu-item')) {
                target.focus()
                target.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
                )
              } else {
                target.click()
              }
            }
          }
        },
      })
    }
  },
})

interface SelectContext {
  value: any
  setValue: (value: any) => void
}
const CheckboxGroupKey: InjectionKey<SelectContext> = Symbol('MenuCheckboxGroup')
const RadioGroupKey: InjectionKey<SelectContext> = Symbol('MenuRadioGroup')
function group(key: InjectionKey<SelectContext>, multiple: boolean) {
  return defineComponent({
    inheritAttrs: false,
    props: {
      modelValue: { default: undefined },
      value: { default: undefined },
      defaultValue: { default: multiple ? () => [] : undefined },
      onChange: Function,
    },
    setup(props, { slots }) {
      const local = ref(props.defaultValue)
      const current = () => props.modelValue ?? props.value ?? local.value
      const setValue = (value: any) => {
        if (props.modelValue === undefined && props.value === undefined) local.value = value
        ;(props.onChange as any)?.(value)
      }
      provide(key, {
        get value() {
          return current()
        },
        setValue,
      })
      return () => slots.default?.()
    },
  })
}
export const MenuCheckboxGroup = group(CheckboxGroupKey, true)
export const MenuRadioGroup = group(RadioGroupKey, false)
export const MenuCheckboxItem = defineComponent({
  name: 'MenuCheckboxItem',
  inheritAttrs: false,
  props: {
    value: String,
    checked: { type: Boolean, default: undefined },
    defaultChecked: Boolean,
    onChange: Function,
    checkIcon: { default: undefined },
    closeMenuOnClick: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const group = inject(CheckboxGroupKey, null)
    const menu = useMenuContext()
    const local = ref(props.defaultChecked)
    return () => {
      const checked =
        group && props.value != null
          ? (group.value || []).includes(props.value)
          : (props.checked ?? local.value)
      const toggle = () => {
        const next = !checked
        if (group && props.value != null)
          group.setValue(
            next
              ? [...(group.value || []), props.value]
              : (group.value || []).filter((v: string) => v !== props.value),
          )
        else if (props.checked === undefined) local.value = next
        ;(props.onChange as any)?.(next)
      }
      return h(
        MenuItem,
        {
          ...attrs,
          role: 'menuitemcheckbox',
          'aria-checked': checked,
          reserveIndicator: menu.alignItemsLabels !== 'none' || checked,
          indicator: checked ? (props.checkIcon ?? menu.checkIcon ?? '✓') : undefined,
          closeMenuOnClick: props.closeMenuOnClick,
          onClick: toggle,
        },
        slots,
      )
    }
  },
})
export const MenuRadioItem = defineComponent({
  name: 'MenuRadioItem',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    checked: { type: Boolean, default: undefined },
    onChange: Function,
    closeMenuOnClick: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const group = inject(RadioGroupKey, null)
    const menu = useMenuContext()
    return () => {
      const checked = group ? group.value === props.value : !!props.checked
      const select = () => {
        group?.setValue(props.value)
        ;(props.onChange as any)?.(props.value)
      }
      return h(
        MenuItem,
        {
          ...attrs,
          role: 'menuitemradio',
          'aria-checked': checked,
          reserveIndicator: menu.alignItemsLabels !== 'none' || checked,
          indicator: checked ? (menu.checkIcon ?? '✓') : undefined,
          closeMenuOnClick: props.closeMenuOnClick,
          onClick: select,
        },
        slots,
      )
    }
  },
})
export const MenuContextMenu = defineComponent({
  name: 'MenuContextMenu',
  inheritAttrs: false,
  props: { disabled: Boolean, longPressDelay: Number },
  setup(props, { attrs, slots }) {
    const ctx = useMenuContext()
    return () =>
      h(
        PopoverContextMenu,
        { ...attrs, disabled: props.disabled, longPressDelay: props.longPressDelay },
        {
          default: () => {
            const children = slots.default?.() ?? []
            return children.length === 1
              ? cloneVNode(children[0], { onClick: ctx.closeDropdownImmediately }, true)
              : children
          },
        },
      )
  },
})

const MenuSubBase = defineComponent({
  name: 'MenuSub',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, default: undefined },
    defaultOpened: Boolean,
    onChange: Function,
    openDelay: { type: Number, default: 100 },
    closeDelay: { type: Number, default: 100 },
    position: { type: String, default: 'right-start' },
    offset: { type: [Number, Object], default: 0 },
    transitionProps: { type: Object, default: () => ({ duration: 0 }) },
    middlewares: {
      type: Object,
      default: () => ({ shift: { crossAxis: true } }),
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        MenuBase,
        {
          ...attrs,
          opened: props.opened,
          defaultOpened: props.defaultOpened,
          onChange: props.onChange as any,
          trigger: 'hover',
          openDelay: props.openDelay,
          closeDelay: props.closeDelay,
          position: props.position,
          offset: props.offset,
          transitionProps: props.transitionProps,
          middlewares: props.middlewares,
          closeOnItemClick: false,
          withinPortal: (attrs as any).withinPortal ?? false,
        },
        slots,
      )
  },
})
export const MenuSubTarget = MenuTarget
export const MenuSubDropdown = MenuDropdown
export const MenuSubItem = defineComponent({
  name: 'MenuSubItem',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        MenuItem,
        {
          ...attrs,
          'data-sub-menu-item': '',
          rightSection: h(AccordionChevron, { class: classes.chevron, size: 14 }),
        },
        slots,
      )
  },
})
export const MenuSub = Object.assign(MenuSubBase, {
  Target: MenuSubTarget,
  Dropdown: MenuSubDropdown,
  Item: MenuSubItem,
})

export const Menu = Object.assign(MenuBase, {
  classes,
  Item: MenuItem,
  Label: MenuLabel,
  Dropdown: MenuDropdown,
  Target: MenuTarget,
  Divider: MenuDivider,
  Search: MenuSearch,
  Sub: MenuSub,
  CheckboxItem: MenuCheckboxItem,
  CheckboxGroup: MenuCheckboxGroup,
  RadioItem: MenuRadioItem,
  RadioGroup: MenuRadioGroup,
  ContextMenu: MenuContextMenu,
})
export type MenuStylesNames =
  | 'item'
  | 'itemLabel'
  | 'itemSection'
  | 'itemIndicator'
  | 'label'
  | 'divider'
  | 'chevron'
  | 'search'
  | 'dropdown'
  | 'arrow'
  | 'overlay'
export interface MenuItemProps {
  color?: string
  closeMenuOnClick?: boolean
  leftSection?: any
  rightSection?: any
  disabled?: boolean
  [key: string]: any
}
export interface MenuLabelProps {
  [key: string]: any
}
export interface MenuDividerProps {
  [key: string]: any
}
export interface MenuDropdownProps {
  [key: string]: any
}
export interface MenuTargetProps {
  refProp?: string
  [key: string]: any
}
export interface MenuSearchProps {
  [key: string]: any
}
export interface MenuCheckboxItemProps {
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  checkIcon?: any
  closeMenuOnClick?: boolean
  [key: string]: any
}
export interface MenuCheckboxGroupProps {
  modelValue?: string[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}
export interface MenuRadioItemProps {
  value: string
  checked?: boolean
  onChange?: (value: string) => void
  closeMenuOnClick?: boolean
  [key: string]: any
}
export interface MenuRadioGroupProps {
  modelValue?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}
export interface MenuContextMenuProps {
  disabled?: boolean
  longPressDelay?: number
  [key: string]: any
}
export interface MenuSubProps {
  opened?: boolean
  defaultOpened?: boolean
  onChange?: (opened: boolean) => void
  openDelay?: number
  closeDelay?: number
  [key: string]: any
}
export type MenuSubTargetProps = MenuTargetProps
export type MenuSubDropdownProps = MenuDropdownProps
export type MenuSubItemProps = MenuItemProps
