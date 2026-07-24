import { defineComponent, h, ref, type DefineComponent, type PropType, type VNode } from 'vue'
import {
  Box,
  parseThemeColor,
  resolveNode,
  rgba,
  UnstyledButton,
  useMantineTheme,
  type MantineColor,
  type MantineNode,
} from '@mantine-vue/core'
import { useMediaQuery, useTimeout } from '@mantine-vue/hooks'
import { ContextMenu } from './ContextMenu'
import { useContextMenuSettings } from './context'
import { resolveContextMenuStyle } from './utils'
import type {
  ContextMenuItemOptions,
  ContextMenuItemProps,
  ContextMenuSubmenuProps,
  ContextMenuStyle,
} from './types'
import './ContextMenuItem.css'

export const ContextMenuItem = defineComponent({
  name: 'ContextMenuItem',
  props: {
    title: {
      type: null as unknown as PropType<MantineNode>,
      required: true,
    },
    icon: {
      type: null as unknown as PropType<MantineNode>,
      default: undefined,
    },
    iconRight: {
      type: null as unknown as PropType<MantineNode>,
      default: undefined,
    },
    color: {
      type: String as PropType<MantineColor>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined,
    },
    items: {
      type: Array as PropType<ContextMenuItemOptions[]>,
      default: undefined,
    },
    onHide: {
      type: Function as PropType<() => void>,
      required: true,
    },
    submenuProps: {
      type: Object as PropType<ContextMenuSubmenuProps>,
      required: true,
    },
    className: { type: String, default: undefined },
    style: {
      type: [Object, Function] as PropType<ContextMenuStyle>,
      default: undefined,
    },
  },
  setup(props) {
    const button = ref<HTMLElement | null>(null)
    const submenuPosition = ref<{ x: number; y: number } | null>(null)
    const settings = useContextMenuSettings()
    const theme = useMantineTheme()
    const hoverAvailable = useMediaQuery('(hover: hover)')

    const showSubmenuTimeout = useTimeout(() => {
      if (!button.value) {
        return
      }

      const rect = button.value.getBoundingClientRect()
      submenuPosition.value = {
        x: (props.submenuProps.dir || 'ltr') === 'ltr' ? rect.right : rect.left,
        y: rect.top,
      }
    }, settings.value.submenuDelay)

    const hideSubmenuTimeout = useTimeout(() => {
      submenuPosition.value = null
    }, settings.value.submenuDelay)

    const showSubmenu = () => {
      hideSubmenuTimeout.clear()
      showSubmenuTimeout.start()
    }

    const hideSubmenu = () => {
      showSubmenuTimeout.clear()
      hideSubmenuTimeout.start()
    }

    const handleSubmenuClick = (event: MouseEvent) => {
      event.stopPropagation()
      showSubmenu()
    }

    const handleActionClick = (event: MouseEvent) => {
      props.onHide()
      props.onClick?.(event)
    }

    const setButtonRef = (node: any) => {
      button.value = node?.$el ?? node ?? null
    }

    return (): VNode => {
      const hasSubmenu = Boolean(props.items && !props.disabled)
      const parsed = props.color
        ? parseThemeColor({ color: props.color, theme: theme.value })
        : null
      const itemColor = parsed?.value ?? 'var(--mantine-color-text)'
      const colorValue = parsed?.value

      return h(
        'div',
        {
          onMouseenter: hasSubmenu && hoverAvailable.value ? showSubmenu : undefined,
          onMouseleave: hasSubmenu && hoverAvailable.value ? hideSubmenu : undefined,
        },
        [
          h(
            UnstyledButton,
            {
              ref: setButtonRef,
              dir: props.submenuProps.dir || 'ltr',
              class: ['mantine-contextmenu-item-button', props.className],
              disabled: props.disabled,
              style: {
                '--mantine-contextmenu-item-button-color': itemColor,
                '--mantine-contextmenu-item-button-hover-bg-color-light': colorValue
                  ? rgba(colorValue, 0.08)
                  : rgba(theme.value.colors.gray[4], 0.25),
                '--mantine-contextmenu-item-button-hover-bg-color-dark': colorValue
                  ? rgba(colorValue, 0.15)
                  : rgba(theme.value.colors.dark[3], 0.25),
                '--mantine-contextmenu-item-button-pressed-bg-color-light': colorValue
                  ? rgba(colorValue, 0.2)
                  : rgba(theme.value.colors.gray[4], 0.5),
                '--mantine-contextmenu-item-button-pressed-bg-color-dark': colorValue
                  ? rgba(colorValue, 0.3)
                  : rgba(theme.value.colors.dark[3], 0.5),
                ...resolveContextMenuStyle(props.style, theme.value),
              },
              onClick: hasSubmenu
                ? handleSubmenuClick
                : props.onClick
                  ? handleActionClick
                  : undefined,
            },
            () => [
              props.icon
                ? h(Box, { fz: 0, me: 'xs', mt: -2 }, () => resolveNode(props.icon))
                : null,
              h('div', { class: 'mantine-contextmenu-item-button-title' }, [
                resolveNode(props.title),
              ]),
              props.iconRight
                ? h(Box, { fz: 0, ms: 'xs', mt: -2 }, () => resolveNode(props.iconRight))
                : props.items
                  ? h(Box, { mt: -1, ms: 'xs' }, () =>
                      (props.submenuProps.dir || 'ltr') === 'rtl' ? '‹' : '›',
                    )
                  : null,
            ],
          ),
          submenuPosition.value && props.items
            ? h(ContextMenu, {
                ...props.submenuProps,
                x: submenuPosition.value.x,
                y: submenuPosition.value.y,
                content: props.items,
                onHide: props.onHide,
                dir: props.submenuProps.dir || 'ltr',
              })
            : null,
        ],
      )
    }
  },
}) as unknown as DefineComponent<ContextMenuItemProps>
