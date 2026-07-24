import {
  Fragment,
  computed,
  defineComponent,
  h,
  provide,
  shallowRef,
  toRef,
  type PropType,
} from 'vue'
import {
  useDirection,
  type MantineRadius,
  type MantineShadow,
  type MantineTheme,
} from '@mantine-vue/core'
import { ContextMenuPortal } from './ContextMenuPortal'
import { ContextMenuKey, ContextMenuSettingsKey, useContextMenu } from './context'
import type {
  ContextMenuInstanceOptions,
  ContextMenuOptions,
  ContextMenuStyles,
  ContextMenuStyle,
  ShowContextMenuFunction,
} from './types'

const DEFAULT_SETTINGS = {
  shadow: 'sm',
  borderRadius: 'xs',
  submenuDelay: 500,
  repositionOnRepeat: false,
} as const

export const ContextMenuProvider = defineComponent({
  name: 'ContextMenuProvider',
  props: {
    zIndex: { type: Number, default: 9999 },
    shadow: {
      type: String as PropType<MantineShadow>,
      default: DEFAULT_SETTINGS.shadow,
    },
    borderRadius: {
      type: [String, Number] as PropType<MantineRadius>,
      default: DEFAULT_SETTINGS.borderRadius,
    },
    submenuDelay: { type: Number, default: DEFAULT_SETTINGS.submenuDelay },
    repositionOnRepeat: {
      type: Boolean,
      default: DEFAULT_SETTINGS.repositionOnRepeat,
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
  setup(props, { slots }) {
    const data = shallowRef<(ContextMenuInstanceOptions & ContextMenuOptions) | null>(null)
    const { dir } = useDirection()

    const hideContextMenu = () => {
      data.value = null
    }

    const showContextMenu: ShowContextMenuFunction = (content, options) => (event) => {
      event.preventDefault()
      event.stopPropagation()

      const position =
        'touches' in event
          ? {
              x: event.touches.item(0)!.clientX,
              y: event.touches.item(0)!.clientY,
            }
          : { x: event.clientX, y: event.clientY }

      data.value = {
        ...position,
        content,
        zIndex: options?.zIndex || props.zIndex,
        className: options?.className,
        style: options?.style,
        classNames: options?.classNames,
        styles: options?.styles,
      }
    }

    provide(
      ContextMenuSettingsKey,
      computed(() => ({
        shadow: props.shadow,
        borderRadius: props.borderRadius,
        submenuDelay: props.submenuDelay,
        repositionOnRepeat: props.repositionOnRepeat,
      })),
    )
    provide(ContextMenuKey, {
      showContextMenu,
      hideContextMenu,
      isContextMenuVisible: toRef(() => Boolean(data.value)),
    })

    return () =>
      h(Fragment, null, [
        slots.default?.(),
        data.value
          ? h(ContextMenuPortal, {
              ...data.value,
              onHide: hideContextMenu,
              dir: dir.value,
            })
          : null,
      ])
  },
})

export { ContextMenuKey, ContextMenuSettingsKey, useContextMenu }
export { ContextMenuKey as ContextMenuCtx, ContextMenuSettingsKey as ContextMenuSettingsCtx }
