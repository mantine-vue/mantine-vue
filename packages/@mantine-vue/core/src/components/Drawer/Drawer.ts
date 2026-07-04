import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  reactive,
  ref,
  type InjectionKey,
  type PropType,
  type VNodeChild,
  watch,
} from 'vue'
import {
  createSafeContext,
  createVarsResolver,
  getDefaultZIndex,
  getSize,
  rem,
  useDirection,
  useStyles,
} from '../../core'
import {
  ModalBase,
  ModalBaseBody,
  ModalBaseCloseButton,
  ModalBaseContent,
  ModalBaseHeader,
  ModalBaseOverlay,
  ModalBaseTitle,
  type ModalBaseProps,
} from '../ModalBase'
import classes from './Drawer.module.css'

export type DrawerPosition = 'top' | 'bottom' | 'left' | 'right'
export interface DrawerProps extends ModalBaseProps {
  title?: VNodeChild | (() => VNodeChild)
  withOverlay?: boolean
  overlayProps?: Record<string, any>
  withCloseButton?: boolean
  closeButtonProps?: Record<string, any>
  position?: DrawerPosition
  radius?: string | number
  offset?: string | number
  size?: string | number
  scrollAreaComponent?: any
  stackId?: string
  classNames?: any
  styles?: any
  vars?: any
}

const [provideDrawerContext, useDrawerContext] = createSafeContext<{
  getStyles: any
  radius?: string | number
  scrollAreaComponent?: any
}>('Drawer component was not found in tree')

export interface DrawerStackContextValue {
  stack: string[]
  addModal: (id: string, zIndex: string | number) => void
  removeModal: (id: string) => void
  getZIndex: (id: string) => string
  currentId: string
  maxZIndex: string | number
}

const DrawerStackContextKey: InjectionKey<DrawerStackContextValue> = Symbol('DrawerStackContext')

function useDrawerStackContext(): DrawerStackContextValue | null {
  return inject(DrawerStackContextKey, null)
}

export const DrawerStack = defineComponent({
  name: 'DrawerStack',
  setup(_, { slots }) {
    const stack = ref<string[]>([])
    const maxZIndex = ref<string | number>(getDefaultZIndex('modal'))

    const ctx: DrawerStackContextValue = reactive({
      get stack() {
        return stack.value
      },
      addModal(id: string, zIndex: string | number) {
        stack.value = [...new Set([...stack.value, id])]
        if (typeof zIndex === 'number' && typeof maxZIndex.value === 'number') {
          maxZIndex.value = Math.max(maxZIndex.value, zIndex)
        }
      },
      removeModal(id: string) {
        stack.value = stack.value.filter((currentId) => currentId !== id)
      },
      getZIndex(id: string) {
        return `calc(${maxZIndex.value} + ${stack.value.indexOf(id)} + 1)`
      },
      get currentId() {
        return stack.value[stack.value.length - 1] ?? ''
      },
      get maxZIndex() {
        return maxZIndex.value
      },
    })

    provide(DrawerStackContextKey, ctx)

    return () => slots.default?.()
  },
})

export interface UseDrawersStackReturnType<T extends string> {
  state: Record<T, boolean>
  open: (id: T) => void
  close: (id: T) => void
  toggle: (id: T) => void
  closeAll: () => void
  register: (id: T) => { opened: boolean; onClose: () => void; stackId: T }
}

export function useDrawersStack<const T extends string>(
  drawers: T[],
): UseDrawersStackReturnType<T> {
  const state = reactive(
    drawers.reduce((acc, id) => ({ ...acc, [id]: false }), {} as Record<T, boolean>),
  ) as Record<T, boolean>

  function open(id: T) {
    state[id] = true
  }

  function close(id: T) {
    state[id] = false
  }

  function toggle(id: T) {
    state[id] = !state[id]
  }

  function closeAll() {
    drawers.forEach((id) => {
      state[id] = false
    })
  }

  function register(id: T) {
    return {
      opened: state[id],
      onClose: () => close(id),
      stackId: id,
    }
  }

  return { state, open, close, toggle, closeAll, register }
}

const varsResolver = createVarsResolver<any>((_, props) => ({
  root: {
    '--drawer-size': getSize(props.size, 'drawer-size'),
    '--drawer-flex':
      props.position === 'top' || props.position === 'bottom'
        ? '0 0 calc(100% - var(--drawer-offset) * 2)'
        : undefined,
    '--drawer-height':
      props.position === 'left' || props.position === 'right' ? undefined : 'var(--drawer-size)',
    '--drawer-align':
      props.position === 'top'
        ? 'flex-start'
        : props.position === 'bottom'
          ? 'flex-end'
          : undefined,
    '--drawer-justify': props.position === 'right' ? 'flex-end' : undefined,
    '--drawer-offset': rem(props.offset),
  },
}))

const transitions: Record<DrawerPosition, string> = {
  top: 'slide-down',
  bottom: 'slide-up',
  left: 'slide-right',
  right: 'slide-left',
}
const rtlTransitions: Record<DrawerPosition, string> = {
  top: 'slide-down',
  bottom: 'slide-up',
  left: 'slide-left',
  right: 'slide-right',
}

export const DrawerRoot = defineComponent({
  name: 'DrawerRoot',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, required: true },
    onClose: { type: Function as PropType<() => void>, required: true },
    position: { type: String as PropType<DrawerPosition>, default: 'left' },
    radius: [String, Number],
    offset: { type: [String, Number], default: 0 },
    size: { type: [String, Number], default: 'md' },
    scrollAreaComponent: { type: [Object, Function], default: undefined },
    transitionProps: Object,
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: Boolean,
  },
  setup(props, { attrs, slots }) {
    const { dir } = useDirection()
    const getStyles = useStyles({
      name: 'Drawer',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      varsResolver,
      unstyled: props.unstyled,
    })
    provideDrawerContext({
      getStyles,
      get radius() {
        return props.radius
      },
      get scrollAreaComponent() {
        return props.scrollAreaComponent
      },
    })
    return () =>
      h(
        ModalBase,
        {
          ...attrs,
          ...props,
          ...getStyles('root'),
          transitionProps: {
            transition: (dir.value === 'rtl' ? rtlTransitions : transitions)[props.position],
            ...props.transitionProps,
          },
          'data-position': props.position,
        },
        slots,
      )
  },
})

function compound(
  name: string,
  Base: any,
  selector: string,
  extra?: (ctx: any) => Record<string, any>,
) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      visible: { type: Boolean, default: undefined },
      transitionProps: Object,
      __hidden: Boolean,
    },
    setup(props, { attrs, slots }) {
      const ctx = useDrawerContext()
      return () =>
        h(
          Base,
          {
            ...attrs,
            ...props,
            ...ctx.getStyles(selector, { className: attrs.class, style: attrs.style }),
            ...extra?.(ctx),
          },
          slots,
        )
    },
  })
}

export const DrawerBody = compound('DrawerBody', ModalBaseBody, 'body')
export const DrawerCloseButton = compound('DrawerCloseButton', ModalBaseCloseButton, 'close')
export const DrawerHeader = compound('DrawerHeader', ModalBaseHeader, 'header')
export const DrawerOverlay = compound('DrawerOverlay', ModalBaseOverlay, 'overlay')
export const DrawerTitle = compound('DrawerTitle', ModalBaseTitle, 'title')
export const DrawerContent = compound('DrawerContent', ModalBaseContent, 'content', (ctx) => ({
  innerProps: ctx.getStyles('inner'),
  radius: ctx.radius ?? 0,
}))

const DrawerBaseComponent = defineComponent({
  name: 'Drawer',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, required: true },
    onClose: { type: Function as PropType<() => void>, required: true },
    title: { type: [String, Object, Function] as PropType<any>, default: undefined },
    withOverlay: { type: Boolean, default: true },
    overlayProps: Object,
    withCloseButton: { type: Boolean, default: true },
    closeButtonProps: Object,
    stackId: { type: String, default: undefined },
    zIndex: { type: [String, Number], default: undefined },
  },
  setup(props, { attrs, slots }) {
    const stackCtx = useDrawerStackContext()

    // Register/deregister with the stack when opened changes
    watch(
      () => props.opened,
      (opened) => {
        if (stackCtx && props.stackId) {
          if (opened) {
            stackCtx.addModal(
              props.stackId,
              typeof props.zIndex === 'number' ? props.zIndex : getDefaultZIndex('modal'),
            )
          } else {
            stackCtx.removeModal(props.stackId)
          }
        }
      },
      { immediate: true },
    )

    const resolvedZIndex = computed(() => {
      if (stackCtx && props.stackId) return stackCtx.getZIndex(props.stackId)
      return props.zIndex
    })

    const stackProps = computed(() => {
      if (!stackCtx || !props.stackId) return {}
      const isCurrent = stackCtx.currentId === props.stackId
      return {
        closeOnEscape: isCurrent,
        trapFocus: isCurrent,
      }
    })

    const overlayVisible = computed(() => {
      if (!props.withOverlay) return false
      if (stackCtx && props.stackId) return stackCtx.currentId === props.stackId
      return props.opened
    })

    const contentHidden = computed(() => {
      if (stackCtx && props.stackId && props.opened) {
        return props.stackId !== stackCtx.currentId
      }
      return false
    })

    return () => {
      const title = typeof props.title === 'function' ? props.title() : props.title
      const header = title != null || props.withCloseButton

      return h(
        DrawerRoot,
        {
          ...attrs,
          opened: props.opened,
          onClose: props.onClose,
          zIndex: resolvedZIndex.value,
          ...stackProps.value,
        },
        {
          default: () => [
            props.withOverlay &&
              h(DrawerOverlay, {
                visible: overlayVisible.value,
                transitionProps: stackCtx && props.stackId ? { duration: 0 } : undefined,
                ...props.overlayProps,
              }),
            h(
              DrawerContent,
              { __hidden: contentHidden.value },
              {
                default: () => [
                  header &&
                    h(DrawerHeader, null, {
                      default: () => [
                        title != null && h(DrawerTitle, null, { default: () => title as any }),
                        props.withCloseButton && h(DrawerCloseButton, props.closeButtonProps),
                      ],
                    }),
                  h(DrawerBody, null, slots),
                ],
              },
            ),
          ],
        },
      )
    }
  },
})

export const Drawer = Object.assign(DrawerBaseComponent, {
  classes,
  varsResolver,
  Root: DrawerRoot,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Body: DrawerBody,
  Header: DrawerHeader,
  Title: DrawerTitle,
  CloseButton: DrawerCloseButton,
  Stack: DrawerStack,
})

export type DrawerStylesNames =
  | 'root'
  | 'body'
  | 'close'
  | 'content'
  | 'header'
  | 'inner'
  | 'overlay'
  | 'title'
export type DrawerCssVariables = any
export type DrawerFactory = any
