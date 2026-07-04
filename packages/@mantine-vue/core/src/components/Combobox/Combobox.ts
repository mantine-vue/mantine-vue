import { cloneVNode, defineComponent, h, onMounted, type PropType, type VNode } from 'vue'
import { mergeRefs, useId } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getFontSize,
  getSize,
  getThemeColor,
  rem,
  useStyles,
  type Primitive,
} from '../../core'
import { Input, InputClearButton } from '../Input'
import { Popover, PopoverDropdown, PopoverTarget, type PopoverProps } from '../Popover'
import { provideComboboxContext, useComboboxContext } from './Combobox.context'
import classes from './Combobox.module.css'
import { useCombobox, type ComboboxStore } from './use-combobox/use-combobox'
import { useComboboxTargetProps } from './use-combobox-target-props/use-combobox-target-props'

export interface ComboboxOptionProps {
  value: Primitive
  active?: boolean
  disabled?: boolean
  selected?: boolean
  [key: string]: any
}
export interface ComboboxProps extends PopoverProps {
  store?: ComboboxStore
  onOptionSubmit?: (value: string, props: ComboboxOptionProps) => void
  size?: string
  dropdownPadding?: string | number
  resetSelectionOnOptionHover?: boolean
  readOnly?: boolean
  floatingHeight?: 'viewport'
  __staticSelector?: string
}
const varsResolver = createVarsResolver<any>((_, props) => ({
  options: {
    '--combobox-option-fz': getFontSize(props.size),
    '--combobox-option-padding': getSize(props.size, 'combobox-option-padding'),
  },
  dropdown: {
    '--combobox-padding':
      props.dropdownPadding === undefined ? undefined : rem(props.dropdownPadding),
    '--combobox-option-fz': getFontSize(props.size),
    '--combobox-option-padding': getSize(props.size, 'combobox-option-padding'),
  },
}))
const chevronVarsResolver = createVarsResolver<any>((theme, props) => ({
  chevron: {
    '--combobox-chevron-size': getSize(props.size, 'combobox-chevron-size'),
    '--combobox-chevron-color': props.color ? getThemeColor(props.color, theme) : undefined,
  },
}))
function childrenOne(slots: any, name: string): VNode {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  if (children.length !== 1)
    throw new Error(
      `${name} component children should be a single element or component that accepts ref`,
    )
  return children[0]
}

const ComboboxBase = defineComponent({
  name: 'Combobox',
  inheritAttrs: false,
  props: {
    store: Object as PropType<ComboboxStore>,
    onOptionSubmit: Function as PropType<(value: string, props: ComboboxOptionProps) => void>,
    size: { type: String, default: 'sm' },
    dropdownPadding: [String, Number],
    resetSelectionOnOptionHover: Boolean,
    readOnly: Boolean,
    floatingHeight: String as PropType<'viewport'>,
    __staticSelector: { type: String, default: 'Combobox' },
    classNames: [Object, Function],
    styles: [Object, Function],
    vars: [Object, Function],
    unstyled: Boolean,
  },
  setup(props, { attrs, slots }) {
    const uncontrolled = useCombobox()
    const store = props.store || uncontrolled
    const getStyles = useStyles({
      name: props.__staticSelector,
      classes,
      props,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
      varsResolver,
    })
    provideComboboxContext({
      getStyles,
      store,
      get onOptionSubmit() {
        return props.onOptionSubmit
      },
      get size() {
        return props.size
      },
      get resetSelectionOnOptionHover() {
        return props.resetSelectionOnOptionHover
      },
      get readOnly() {
        return props.readOnly
      },
      get floatingHeight() {
        return props.floatingHeight
      },
    })
    return () =>
      h(
        Popover,
        {
          keepMounted: true,
          withinPortal: true,
          width: 'target',
          transitionProps: { transition: 'fade', duration: 0 },
          ...attrs,
          opened: store.dropdownOpened,
          onChange: (opened: boolean) => {
            if (!opened) {
              ;(attrs as any).onClose?.()
              store.closeDropdown()
            }
          },
          withRoles: false,
          unstyled: props.unstyled,
          __staticSelector: props.__staticSelector,
        },
        slots,
      )
  },
})

function targetComponent(name: string, withPopover: boolean) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      refProp: { type: String, default: 'ref' },
      withKeyboardNavigation: { type: Boolean, default: true },
      withAriaAttributes: { type: Boolean, default: true },
      withExpandedAttribute: Boolean,
      targetType: { type: String as PropType<'button' | 'input'>, default: 'input' },
      autoComplete: { type: String, default: 'off' },
    },
    setup(props, { attrs, slots }) {
      const ctx = useComboboxContext()
      const child = () => childrenOne(slots, name)
      const targetProps = useComboboxTargetProps({
        targetType: props.targetType,
        withAriaAttributes: props.withAriaAttributes,
        withKeyboardNavigation: props.withKeyboardNavigation,
        withExpandedAttribute: props.withExpandedAttribute,
        autoComplete: props.autoComplete,
      })
      return () => {
        const vnode = child()
        const cloned = cloneVNode(
          vnode,
          {
            ...attrs,
            ...targetProps,
            [props.refProp]: mergeRefs(
              (node: any) => {
                const root = node?.$el ?? node
                ctx.store.targetRef.value = root?.matches?.('input,button,[tabindex]')
                  ? root
                  : (root?.querySelector?.('input,button,[tabindex]') ?? root)
              },
              (vnode as any).ref,
            ),
          },
          true,
        )
        return withPopover ? h(PopoverTarget, { refProp: props.refProp }, () => cloned) : cloned
      }
    },
  })
}
export const ComboboxTarget = targetComponent('ComboboxTarget', true)
export const ComboboxEventsTarget = targetComponent('ComboboxEventsTarget', false)
export const ComboboxDropdownTarget = defineComponent({
  name: 'ComboboxDropdownTarget',
  inheritAttrs: false,
  props: { refProp: { type: String, default: 'ref' } },
  setup(props, { attrs, slots }) {
    return () => h(PopoverTarget, { ...attrs, refProp: props.refProp }, slots)
  },
})

export const ComboboxDropdown = defineComponent({
  name: 'ComboboxDropdown',
  inheritAttrs: false,
  props: { hidden: Boolean },
  setup(props, { attrs, slots }) {
    const ctx = useComboboxContext()
    return () =>
      h(
        PopoverDropdown,
        {
          ...attrs,
          role: 'presentation',
          'data-hidden': props.hidden || undefined,
          'data-floating-height': ctx.floatingHeight || undefined,
          ...ctx.getStyles('dropdown', { className: attrs.class, style: attrs.style }),
        },
        slots,
      )
  },
})
export const ComboboxOptions = defineComponent({
  name: 'ComboboxOptions',
  inheritAttrs: false,
  props: { id: String, labelledBy: String },
  setup(props, { attrs, slots }) {
    const ctx = useComboboxContext()
    const id = useId(props.id)
    onMounted(() => ctx.store.setListId(id.value))
    return () =>
      h(
        Box,
        {
          ...attrs,
          id: id.value,
          role: 'listbox',
          'aria-labelledby': props.labelledBy,
          ...ctx.getStyles('options', { className: attrs.class, style: attrs.style }),
          onMousedown: (event: MouseEvent) => {
            event.preventDefault()
            ;(attrs as any).onMousedown?.(event)
          },
        },
        slots,
      )
  },
})
export const ComboboxOption = defineComponent({
  name: 'ComboboxOption',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Boolean] as PropType<Primitive>, required: true },
    active: Boolean,
    disabled: Boolean,
    selected: Boolean,
    id: String,
  },
  setup(props, { attrs, slots }) {
    const ctx = useComboboxContext()
    const id = useId(props.id)
    return () =>
      h(
        Box,
        {
          ...attrs,
          id: id.value,
          role: 'option',
          ...ctx.getStyles('option', { className: attrs.class, style: attrs.style }),
          'data-combobox-option': '',
          'data-combobox-active': props.active || undefined,
          'data-combobox-disabled': props.disabled || undefined,
          'data-combobox-selected': props.selected || undefined,
          'aria-selected': props.selected || undefined,
          onClick: (event: MouseEvent) => {
            if (props.disabled) event.preventDefault()
            else {
              ctx.onOptionSubmit?.(String(props.value), { ...props, ...attrs })
              ;(attrs as any).onClick?.(event)
            }
          },
          onMousedown: (event: MouseEvent) => {
            event.preventDefault()
            ;(attrs as any).onMousedown?.(event)
          },
          onMouseover: (event: MouseEvent) => {
            if (ctx.resetSelectionOnOptionHover) ctx.store.resetSelectedOption()
            ;(attrs as any).onMouseover?.(event)
          },
        },
        slots,
      )
  },
})

export const ComboboxSearch = defineComponent({
  name: 'ComboboxSearch',
  inheritAttrs: false,
  props: {
    withAriaAttributes: { type: Boolean, default: true },
    withKeyboardNavigation: { type: Boolean, default: true },
    size: String,
  },
  setup(props, { attrs }) {
    const ctx = useComboboxContext()
    const targetProps = useComboboxTargetProps({
      targetType: 'input',
      withAriaAttributes: props.withAriaAttributes,
      withKeyboardNavigation: props.withKeyboardNavigation,
      withExpandedAttribute: false,
      autoComplete: 'off',
      onKeydown: (attrs as any).onKeydown,
      onClick: (attrs as any).onClick,
    })
    return () =>
      h(Input, {
        ...attrs,
        ...targetProps,
        ref: (node: any) => {
          const element = node?.$el?.querySelector?.('input') ?? node?.$el ?? node
          ctx.store.searchRef.value = element
        },
        size: props.size || ctx.size,
        class: [ctx.getStyles('search').class, attrs.class],
        style: [ctx.getStyles('search').style, attrs.style],
        __staticSelector: 'Combobox',
      })
  },
})
function section(name: string, selector: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = useComboboxContext()
      return () =>
        h(
          Box,
          { ...attrs, ...ctx.getStyles(selector, { className: attrs.class, style: attrs.style }) },
          slots,
        )
    },
  })
}
export const ComboboxEmpty = section('ComboboxEmpty', 'empty')
export const ComboboxHeader = section('ComboboxHeader', 'header')
export const ComboboxFooter = section('ComboboxFooter', 'footer')
export const ComboboxGroup = defineComponent({
  name: 'ComboboxGroup',
  inheritAttrs: false,
  props: { label: { type: null as any, default: undefined }, id: String },
  setup(props, { attrs, slots }) {
    const ctx = useComboboxContext()
    const id = useId(props.id)
    return () =>
      h(
        Box,
        {
          ...attrs,
          role: 'group',
          'aria-labelledby': props.label ? id.value : undefined,
          ...ctx.getStyles('group', { className: attrs.class, style: attrs.style }),
        },
        () => [
          props.label &&
            h('div', { id: id.value, ...ctx.getStyles('groupLabel') }, props.label as any),
          slots.default?.(),
        ],
      )
  },
})
export const ComboboxChevron = defineComponent({
  name: 'ComboboxChevron',
  inheritAttrs: false,
  props: { size: String, error: { default: null }, color: String },
  setup(props, { attrs }) {
    const getStyles = useStyles({
      name: 'ComboboxChevron',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      varsResolver: chevronVarsResolver,
    })
    return () =>
      h(
        Box,
        {
          ...attrs,
          component: 'svg',
          ...getStyles('chevron'),
          size: props.size,
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          mod: { 'combobox-chevron': true, error: Boolean(props.error) },
        },
        () => [
          h('path', {
            d: 'M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z',
            fill: 'currentColor',
            fillRule: 'evenodd',
            clipRule: 'evenodd',
          }),
        ],
      )
  },
})
export const ComboboxClearButton = defineComponent({
  name: 'ComboboxClearButton',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(InputClearButton, { ...attrs, __staticSelector: 'Combobox' }, slots)
  },
})
export const ComboboxHiddenInput = defineComponent({
  name: 'ComboboxHiddenInput',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Boolean, Array] as PropType<Primitive | Primitive[] | null>,
      default: null,
    },
    valuesDivider: { type: String, default: ',' },
  },
  setup(props, { attrs }) {
    return () =>
      h('input', {
        ...attrs,
        type: 'hidden',
        value: Array.isArray(props.value)
          ? props.value.join(props.valuesDivider)
          : props.value != null
            ? String(props.value)
            : '',
      })
  },
})

export const Combobox = Object.assign(ComboboxBase, {
  classes,
  varsResolver,
  Target: ComboboxTarget,
  EventsTarget: ComboboxEventsTarget,
  DropdownTarget: ComboboxDropdownTarget,
  Dropdown: ComboboxDropdown,
  Options: ComboboxOptions,
  Option: ComboboxOption,
  Search: ComboboxSearch,
  Empty: ComboboxEmpty,
  Header: ComboboxHeader,
  Footer: ComboboxFooter,
  Group: ComboboxGroup,
  Chevron: ComboboxChevron,
  ClearButton: ComboboxClearButton,
  HiddenInput: ComboboxHiddenInput,
})
export type ComboboxStylesNames =
  | 'options'
  | 'dropdown'
  | 'option'
  | 'search'
  | 'empty'
  | 'footer'
  | 'header'
  | 'group'
  | 'groupLabel'
export interface ComboboxTargetProps {
  refProp?: string
  withKeyboardNavigation?: boolean
  withAriaAttributes?: boolean
  withExpandedAttribute?: boolean
  targetType?: 'button' | 'input'
  autoComplete?: string
  [key: string]: any
}
export interface ComboboxDropdownProps {
  hidden?: boolean
  [key: string]: any
}
export interface ComboboxOptionsProps {
  labelledBy?: string
  [key: string]: any
}
export interface ComboboxSearchProps {
  withAriaAttributes?: boolean
  withKeyboardNavigation?: boolean
  [key: string]: any
}
export type ComboboxEventsTargetProps = ComboboxTargetProps
export interface ComboboxDropdownTargetProps {
  refProp?: string
  [key: string]: any
}
export interface ComboboxEmptyProps {
  [key: string]: any
}
export interface ComboboxHeaderProps {
  [key: string]: any
}
export interface ComboboxFooterProps {
  [key: string]: any
}
export interface ComboboxGroupProps {
  label?: any
  [key: string]: any
}
export interface ComboboxChevronProps {
  size?: string
  error?: any
  color?: string
  [key: string]: any
}
export interface ComboboxClearButtonProps {
  [key: string]: any
}
export interface ComboboxHiddenInputProps {
  value: Primitive | Primitive[] | null
  valuesDivider?: string
  [key: string]: any
}
