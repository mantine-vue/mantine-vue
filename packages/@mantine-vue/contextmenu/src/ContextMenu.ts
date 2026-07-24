import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  ref,
  watch,
  type DefineComponent,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue'
import {
  Paper,
  px,
  useMantineTheme,
  type MantineRadius,
  type MantineTheme,
} from '@mantine-vue/core'
import { useResizeObserver } from '@mantine-vue/hooks'
import { ContextMenuDivider } from './ContextMenuDivider'
import { ContextMenuItem } from './ContextMenuItem'
import { useContextMenuSettings } from './context'
import { resolveContextMenuStyle, resolveContextMenuStyles, humanize } from './utils'
import type {
  ContextMenuContent,
  ContextMenuOptions,
  ContextMenuProps,
  ContextMenuSubmenuProps,
  ContextMenuStyles,
  ContextMenuStyle,
} from './types'
import './ContextMenu.css'

export const ContextMenu = defineComponent({
  name: 'ContextMenu',
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    content: {
      type: [Array, Function] as PropType<ContextMenuContent>,
      required: true,
    },
    onHide: {
      type: Function as PropType<() => void>,
      required: true,
    },
    zIndex: { type: Number, default: undefined },
    dir: {
      type: String as PropType<'ltr' | 'rtl'>,
      default: 'ltr',
    },
    className: { type: String, default: undefined },
    style: {
      type: [Object, Function] as PropType<ContextMenuStyle>,
      default: undefined,
    },
    classNames: {
      type: Object as PropType<ContextMenuOptions['classNames']>,
      default: undefined,
    },
    styles: {
      type: [Object, Function] as PropType<
        ContextMenuStyles | ((theme: MantineTheme) => ContextMenuStyles)
      >,
      default: undefined,
    },
  },
  setup(props: ContextMenuProps) {
    const settings = useContextMenuSettings()
    const theme = useMantineTheme()
    const { ref: menuRef, rect } = useResizeObserver<HTMLElement>()
    const mounted = ref(false)
    let frameId = 0

    watch(
      () => [rect.value.width, rect.value.height],
      ([width, height]) => {
        if (width > 0 && height > 0) {
          cancelAnimationFrame(frameId)
          frameId = requestAnimationFrame(() => {
            mounted.value = true
          })
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => cancelAnimationFrame(frameId))

    const position = computed(() => {
      const spacing = px(theme.value.spacing.md)
      const windowWidth = typeof window === 'undefined' ? 0 : window.innerWidth
      const windowHeight = typeof window === 'undefined' ? 0 : window.innerHeight
      const top =
        props.y + rect.value.height + spacing > windowHeight
          ? windowHeight - rect.value.height - spacing
          : props.y
      const left =
        props.dir === 'rtl'
          ? props.x - rect.value.width < spacing
            ? spacing
            : props.x - rect.value.width
          : props.x + rect.value.width + spacing > windowWidth
            ? windowWidth - rect.value.width - spacing
            : props.x

      return { zIndex: props.zIndex, top: `${top}px`, left: `${left}px` }
    })

    const setMenuRef = (node: any) => {
      menuRef.value = node?.$el ?? node ?? null
    }

    return (): VNode => {
      const resolvedStyles = resolveContextMenuStyles(props.styles, theme.value)
      const submenuProps: ContextMenuSubmenuProps = {
        className: props.className,
        style: props.style,
        classNames: props.classNames,
        styles: props.styles,
        dir: props.dir,
      }

      const content: VNodeChild =
        typeof props.content === 'function'
          ? props.content(props.onHide)
          : props.content.map((item): VNodeChild => {
              if (item.hidden) {
                return null
              }

              if (item.onClick || item.items) {
                return h(ContextMenuItem, {
                  key: item.key,
                  className: [props.classNames?.item, item.className].filter(Boolean).join(' '),
                  style: {
                    ...resolveContextMenuStyle(resolvedStyles?.item, theme.value),
                    ...resolveContextMenuStyle(item.style, theme.value),
                  },
                  title: item.title ?? humanize(item.key),
                  icon: item.icon,
                  iconRight: item.iconRight,
                  color: item.color,
                  disabled: item.disabled,
                  onClick: item.onClick,
                  items: item.items,
                  onHide: props.onHide,
                  submenuProps,
                })
              }

              return h(ContextMenuDivider, {
                key: item.key,
                className: [props.classNames?.divider, item.className].filter(Boolean).join(' '),
                style: {
                  ...resolveContextMenuStyle(resolvedStyles?.divider, theme.value),
                  ...resolveContextMenuStyle(item.style, theme.value),
                },
              })
            })

      return h(
        Paper,
        {
          ref: setMenuRef,
          shadow: settings.value.shadow,
          radius: settings.value.borderRadius as MantineRadius,
          dir: props.dir,
          class: [
            'mantine-contextmenu',
            mounted.value && 'mantine-contextmenu-mounted',
            props.className,
            props.classNames?.root,
          ],
          style: {
            ...position.value,
            ...resolveContextMenuStyle(props.style, theme.value),
            ...resolveContextMenuStyle(resolvedStyles?.root, theme.value),
          },
        },
        () => content,
      )
    }
  },
}) as unknown as DefineComponent<ContextMenuProps>
