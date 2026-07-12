import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  Box,
  getThemeColor,
  hasNode,
  resolveNode,
  type MantineNode,
  type SectionSlots,
  useDirection,
  useMantineTheme,
} from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useTabsContext } from '../Tabs.context'

export type TabsTabStylesNames = 'tab' | 'tabSection' | 'tabLabel'

export interface TabsTabSlots extends SectionSlots {
  default?: () => VNodeChild
}

function getTabs(event: KeyboardEvent, selector: string) {
  const target = event.currentTarget as HTMLElement
  const parent = target.closest('[role="tablist"]')
  return Array.from(parent?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
    (item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true',
  )
}

function createTabsKeydownHandler({
  orientation,
  dir,
  loop,
  activateOnFocus,
  onKeydown,
}: {
  orientation: 'horizontal' | 'vertical'
  dir: 'ltr' | 'rtl'
  loop?: boolean
  activateOnFocus?: boolean
  onKeydown?: (event: KeyboardEvent) => void
}) {
  return (event: KeyboardEvent) => {
    onKeydown?.(event)

    if (event.defaultPrevented) {
      return
    }

    const horizontal = orientation === 'horizontal'
    const previousKey = horizontal ? (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'
    const nextKey = horizontal ? (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
    const keyActions: Record<string, 'previous' | 'next' | 'first' | 'last'> = {
      [previousKey]: 'previous',
      [nextKey]: 'next',
      Home: 'first',
      End: 'last',
    }
    const action = keyActions[event.key]

    if (!action) {
      return
    }

    const tabs = getTabs(event, '[role="tab"]')
    const currentIndex = tabs.indexOf(event.currentTarget as HTMLElement)

    if (currentIndex === -1) {
      return
    }

    const lastIndex = tabs.length - 1
    const nextIndex =
      action === 'first'
        ? 0
        : action === 'last'
          ? lastIndex
          : action === 'next'
            ? currentIndex === lastIndex
              ? loop
                ? 0
                : currentIndex
              : currentIndex + 1
            : currentIndex === 0
              ? loop
                ? lastIndex
                : currentIndex
              : currentIndex - 1

    if (nextIndex === currentIndex) {
      return
    }

    event.preventDefault()
    tabs[nextIndex]?.focus()

    if (activateOnFocus) {
      tabs[nextIndex]?.click()
    }
  }
}

export const TabsTab = defineComponent({
  name: 'TabsTab',
  inheritAttrs: false,
  slots: Object as SlotsType<TabsTabSlots>,
  props: {
    value: { type: String, required: true },
    rightSection: { type: null as unknown as PropType<MantineNode>, default: undefined },
    leftSection: { type: null as unknown as PropType<MantineNode>, default: undefined },
    color: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    tabIndex: { type: Number, default: undefined },
    onClick: { type: Function as PropType<(event: MouseEvent) => void>, default: undefined },
    onKeydown: { type: Function as PropType<(event: KeyboardEvent) => void>, default: undefined },
    onKeyDown: { type: Function as PropType<(event: KeyboardEvent) => void>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
  },
  setup(props, { attrs, slots }) {
    const theme = useMantineTheme()
    const { dir } = useDirection()
    const ctx = useTabsContext()

    return () => {
      const active = props.value === ctx.value
      const leftSection = resolveNode(props.leftSection, slots.leftSection)
      const rightSection = resolveNode(props.rightSection, slots.rightSection)
      const stylesApiProps = { classNames: props.classNames, styles: props.styles, props }
      const activateTab = (event: MouseEvent) => {
        ctx.onChange(
          ctx.allowTabDeactivation ? (props.value === ctx.value ? null : props.value) : props.value,
        )
        props.onClick?.(event)
      }

      return h(
        UnstyledButton,
        {
          ...attrs,
          ...ctx.getStyles('tab', {
            className: attrs.class,
            variant: ctx.variant,
            style: {
              '--tabs-color': props.color ? getThemeColor(props.color, theme.value) : undefined,
              ...(attrs.style as Record<string, any>),
            },
            ...stylesApiProps,
          }),
          disabled: props.disabled,
          unstyled: ctx.unstyled,
          variant: ctx.variant,
          mod: [
            {
              active,
              disabled: props.disabled,
              orientation: ctx.orientation,
              inverted: ctx.inverted,
              placement: ctx.orientation === 'vertical' && ctx.placement,
            },
            props.mod,
          ],
          role: 'tab',
          id: ctx.getTabId(props.value),
          'aria-selected': active,
          tabIndex:
            props.tabIndex !== undefined ? props.tabIndex : active || ctx.value === null ? 0 : -1,
          'aria-controls': ctx.getPanelId(props.value),
          onClick: activateTab,
          onKeydown: createTabsKeydownHandler({
            orientation: ctx.orientation || 'horizontal',
            dir: dir.value,
            activateOnFocus: ctx.activateTabWithKeyboard,
            loop: ctx.loop,
            onKeydown: props.onKeydown ?? props.onKeyDown,
          }),
        },
        () => [
          hasNode(leftSection)
            ? h(
                Box,
                {
                  component: 'span',
                  ...ctx.getStyles('tabSection', stylesApiProps),
                  'data-position': 'left',
                },
                () => leftSection,
              )
            : null,
          slots.default
            ? h(Box, { component: 'span', ...ctx.getStyles('tabLabel', stylesApiProps) }, () =>
                slots.default?.(),
              )
            : null,
          hasNode(rightSection)
            ? h(
                Box,
                {
                  component: 'span',
                  ...ctx.getStyles('tabSection', stylesApiProps),
                  'data-position': 'right',
                },
                () => rightSection,
              )
            : null,
        ],
      )
    }
  },
})
