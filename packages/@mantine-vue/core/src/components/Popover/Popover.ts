import {
  arrow,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  type Middleware,
} from '@floating-ui/vue'
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type PropType,
  type VNode,
} from 'vue'
import { mergeRefs, useClickOutside, useFocusReturn, useId } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getDefaultZIndex,
  getRadius,
  getShadow,
  rem,
  useDirection,
  useProps,
  useStyles,
} from '../../core'
import {
  FloatingArrow,
  getArrowMergeDropdownStyles,
  getFloatingPosition,
  useContextMenuHandlers,
  type ArrowPosition,
  type FloatingAxesOffsets,
  type FloatingPosition,
  type FloatingStrategy,
} from '../../utils/Floating'
import { FocusTrap } from '../FocusTrap'
import { Overlay } from '../Overlay'
import { OptionalPortal } from '../Portal'
import { Transition } from '../Transition'
import { providePopoverContext, usePopoverContext } from './Popover.context'
import classes from './Popover.module.css'

export interface PopoverProps {
  __staticSelector?: string
  position?: FloatingPosition
  offset?: number | FloatingAxesOffsets
  opened?: boolean
  defaultOpened?: boolean
  onChange?: (opened: boolean) => void
  onOpen?: () => void
  onClose?: () => void
  onDismiss?: () => void
  width?: string | number | 'target' | null
  withArrow?: boolean
  arrowSize?: number
  arrowOffset?: number
  arrowRadius?: number
  arrowPosition?: ArrowPosition
  withinPortal?: boolean
  portalProps?: Record<string, any>
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  trapFocus?: boolean
  withRoles?: boolean
  disabled?: boolean
  returnFocus?: boolean
  keepMounted?: boolean
  transitionProps?: Record<string, any>
  zIndex?: string | number
  floatingStrategy?: FloatingStrategy
  middlewares?: Record<string, any>
  id?: string
  targetProps?: Record<string, any>
  withOverlay?: boolean
  overlayProps?: Record<string, any>
  radius?: string | number
  shadow?: string
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
}

const defaults = {
  position: 'bottom',
  offset: 8,
  width: 'max-content',
  withArrow: false,
  arrowSize: 7,
  arrowOffset: 5,
  arrowRadius: 0,
  arrowPosition: 'side',
  withinPortal: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: false,
  withRoles: true,
  returnFocus: false,
  keepMounted: false,
  zIndex: getDefaultZIndex('popover'),
  floatingStrategy: 'absolute',
  transitionProps: { transition: 'fade', duration: 150 },
} as const
const varsResolver = createVarsResolver<any>((_, props) => ({
  dropdown: {
    '--popover-radius': props.radius === undefined ? undefined : getRadius(props.radius),
    '--popover-shadow': getShadow(props.shadow),
  },
}))

function one(slots: any, name: string): VNode {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  if (children.length !== 1)
    throw new Error(
      `${name} component children should be a single element or component that accepts ref`,
    )
  return children[0]
}
function call(handler: any, event: Event) {
  if (Array.isArray(handler)) handler.forEach((fn) => fn?.(event))
  else handler?.(event)
}
function asElement(node: any): HTMLElement | null {
  const candidate = node?.$el ?? node
  if (typeof Element !== 'undefined' && candidate instanceof Element) {
    return candidate as HTMLElement
  }

  return typeof candidate?.getBoundingClientRect === 'function' ? candidate : null
}

export const PopoverTarget = defineComponent({
  name: 'PopoverTarget',
  inheritAttrs: false,
  props: {
    refProp: { type: String, default: 'ref' },
    popupType: { type: String, default: 'dialog' },
  },
  setup(props, { attrs, slots }) {
    const ctx = usePopoverContext()
    return () => {
      const child = one(slots, 'Popover.Target')
      const childProps = child.props || {}
      const forwarded: any = {
        ...attrs,
        ...ctx.targetProps,
        [props.refProp]: mergeRefs(ctx.reference, (child as any).ref),
      }
      if (ctx.withRoles)
        Object.assign(forwarded, {
          'aria-haspopup': props.popupType,
          'aria-expanded': ctx.opened,
          'aria-controls': ctx.opened ? ctx.getDropdownId() : undefined,
          id: ctx.getTargetId(),
        })
      if (!ctx.controlled)
        forwarded.onClick = (event: MouseEvent) => {
          ctx.onToggle()
          call((childProps as any).onClick, event)
        }
      return cloneVNode(child, forwarded, true)
    }
  },
})

export const PopoverContextMenu = defineComponent({
  name: 'PopoverContextMenu',
  props: { disabled: Boolean, longPressDelay: { type: Number, default: 500 } },
  setup(props, { slots }) {
    const ctx = usePopoverContext()
    let childProps: Record<string, any> = {}
    const handlers = useContextMenuHandlers({
      get childProps() {
        return childProps
      },
      get disabled() {
        return props.disabled || ctx.disabled
      },
      get opened() {
        return ctx.opened
      },
      get longPressDelay() {
        return props.longPressDelay
      },
      setReference: ctx.reference,
      open: () => !ctx.opened && ctx.onToggle(),
    })
    return () => {
      const child = one(slots, 'Popover.ContextMenu')
      childProps = child.props || {}
      return cloneVNode(child, handlers, true)
    }
  },
})

export const PopoverDropdown = defineComponent({
  name: 'PopoverDropdown',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const ctx = usePopoverContext()
    const { dir } = useDirection()
    const returnFocus = useFocusReturn({
      opened: () => ctx.opened,
      shouldReturnFocus: () => ctx.returnFocus,
    })
    return () =>
      ctx.disabled
        ? null
        : h(OptionalPortal, { withinPortal: ctx.withinPortal, ...ctx.portalProps }, () =>
            h(
              Transition,
              { mounted: ctx.opened, keepMounted: ctx.keepMounted, ...ctx.transitionProps },
              {
                default: (transitionStyle: any) =>
                  h(
                    FocusTrap,
                    { active: ctx.trapFocus && ctx.opened, innerRef: ctx.floating },
                    {
                      default: () =>
                        h(
                          Box,
                          {
                            ...(ctx.withRoles
                              ? {
                                  role: 'dialog',
                                  tabindex: -1,
                                  id: ctx.getDropdownId(),
                                  'aria-labelledby': ctx.getTargetId(),
                                }
                              : {}),
                            ...attrs,
                            ...ctx.getStyles('dropdown', {
                              className: attrs.class,
                              style: attrs.style,
                            }),
                            'data-position': ctx.placement,
                            'data-fixed': ctx.floatingStrategy === 'fixed' || undefined,
                            onKeydownCapture: (event: KeyboardEvent) => {
                              call((attrs as any).onKeydownCapture, event)
                              if (event.key === 'Escape' && ctx.closeOnEscape) {
                                ctx.onClose()
                                ctx.onDismiss?.()
                                returnFocus()
                              }
                            },
                            style: [
                              ctx.getStyles('dropdown').style,
                              transitionStyle,
                              ctx.arrowPosition === 'merge' && ctx.withArrow
                                ? getArrowMergeDropdownStyles({
                                    position: ctx.placement,
                                    dir: dir.value,
                                  })
                                : null,
                              {
                                zIndex: ctx.zIndex,
                                top: `${ctx.y}px`,
                                left: `${ctx.x}px`,
                                width:
                                  ctx.width === 'target'
                                    ? ctx.targetWidth === undefined
                                      ? undefined
                                      : `${ctx.targetWidth}px`
                                    : rem(ctx.width as any),
                              },
                              attrs.style,
                            ],
                          },
                          () => [
                            slots.default?.(),
                            h(FloatingArrow, {
                              ref: ctx.arrowRef,
                              visible: ctx.withArrow,
                              position: ctx.placement,
                              arrowSize: ctx.arrowSize,
                              arrowOffset: ctx.arrowOffset,
                              arrowRadius: ctx.arrowRadius,
                              arrowPosition: ctx.arrowPosition,
                              arrowX: ctx.arrowX,
                              arrowY: ctx.arrowY,
                              ...ctx.getStyles('arrow'),
                            }),
                          ],
                        ),
                    },
                  ),
              },
            ),
          )
  },
})

const PopoverBase = defineComponent({
  name: 'Popover',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<FloatingPosition>, default: undefined },
    offset: { type: [Number, Object], default: undefined },
    opened: { type: Boolean, default: undefined },
    defaultOpened: Boolean,
    onChange: Function as PropType<(value: boolean) => void>,
    onOpen: Function as PropType<() => void>,
    onClose: Function as PropType<() => void>,
    onDismiss: Function as PropType<() => void>,
    width: { type: [String, Number], default: undefined },
    withArrow: { type: Boolean, default: undefined },
    arrowSize: Number,
    arrowOffset: Number,
    arrowRadius: Number,
    arrowPosition: { type: String as PropType<ArrowPosition>, default: undefined },
    withinPortal: { type: Boolean, default: undefined },
    portalProps: Object,
    closeOnClickOutside: { type: Boolean, default: undefined },
    closeOnEscape: { type: Boolean, default: undefined },
    trapFocus: { type: Boolean, default: undefined },
    withRoles: { type: Boolean, default: undefined },
    disabled: Boolean,
    returnFocus: { type: Boolean, default: undefined },
    keepMounted: { type: Boolean, default: undefined },
    transitionProps: Object,
    zIndex: [String, Number],
    floatingStrategy: { type: String as PropType<FloatingStrategy>, default: undefined },
    middlewares: Object,
    id: String,
    targetProps: Object,
    withOverlay: Boolean,
    overlayProps: Object,
    radius: [String, Number],
    shadow: String,
    classNames: [Object, Function],
    styles: [Object, Function],
    vars: [Object, Function],
    unstyled: Boolean,
    __staticSelector: { type: String, default: 'Popover' },
  },
  setup(rawProps, { slots }) {
    const props = useProps('Popover', defaults, rawProps)
    const { dir } = useDirection()
    const id = useId(props.id)
    const internal = ref(props.defaultOpened)
    const isControlled = computed(() => rawProps.opened !== undefined)
    const opened = computed(() => (isControlled.value ? !!rawProps.opened : internal.value))
    const reference = ref<any>(null)
    const floating = ref<HTMLElement | null>(null)
    const arrowElement = ref<HTMLElement | null>(null)
    const targetWidth = ref<number | undefined>()
    let resizeObserver: ResizeObserver | undefined
    const updateTargetWidth = () => {
      const width = reference.value?.getBoundingClientRect?.().width
      targetWidth.value = typeof width === 'number' ? width : undefined
    }
    const placement = computed(() =>
      getFloatingPosition(dir.value, props.position as FloatingPosition),
    )
    const middleware = computed<Middleware[]>(() => {
      const result: Middleware[] = [
        offset(
          typeof props.offset === 'number'
            ? props.offset + (props.withArrow ? (props.arrowSize ?? 7) / 2 : 0)
            : (props.offset as any),
        ),
        hide(),
      ]
      if (props.middlewares?.flip !== false)
        result.push(flip(typeof props.middlewares?.flip === 'object' ? props.middlewares.flip : {}))
      if (props.middlewares?.shift !== false)
        result.push(
          shift((state) => {
            const shiftOptions =
              typeof props.middlewares?.shift === 'object' ? props.middlewares.shift : {}
            const isVerticalPlacement =
              state.placement.startsWith('top') || state.placement.startsWith('bottom')

            return {
              limiter: limitShift(),
              padding: 5,
              ...(props.width === 'target' && isVerticalPlacement ? { mainAxis: false } : null),
              ...shiftOptions,
            }
          }),
        )
      result.push(arrow({ element: arrowElement }))
      if (props.middlewares?.size || props.width === 'target')
        result.push(
          size({
            ...(typeof props.middlewares?.size === 'object' ? props.middlewares.size : {}),
            apply: ({ rects, availableWidth, availableHeight, elements, ...rest }) => {
              const userSize = props.middlewares?.size

              if (userSize) {
                if (typeof userSize === 'object' && userSize.apply) {
                  userSize.apply({ rects, availableWidth, availableHeight, elements, ...rest })
                } else {
                  Object.assign(elements.floating.style, {
                    maxWidth: `${availableWidth}px`,
                    maxHeight: `${availableHeight}px`,
                  })
                }
              }

              if (props.width === 'target') {
                elements.floating.style.width = `${rects.reference.width}px`
              }
            },
          }),
        )
      return result
    })
    const floatingState = useFloating(reference, floating, {
      open: opened,
      placement,
      strategy: computed(() => props.floatingStrategy),
      middleware,
      whileElementsMounted: autoUpdate,
    })
    watch(opened, async (value) => {
      if (value) {
        updateTargetWidth()
        await nextTick()
        updateTargetWidth()
        floatingState.update()
      }
    })
    watch(reference, (node) => {
      resizeObserver?.disconnect()
      updateTargetWidth()

      if (
        typeof Element !== 'undefined' &&
        node instanceof Element &&
        typeof ResizeObserver !== 'undefined'
      ) {
        resizeObserver = new ResizeObserver(updateTargetWidth)
        resizeObserver.observe(node)
      }
    })
    onBeforeUnmount(() => resizeObserver?.disconnect())
    const setOpened = (value: boolean) => {
      if (props.disabled) return
      if (!isControlled.value) internal.value = value
      props.onChange?.(value)
    }
    const close = () => {
      if (!opened.value || props.disabled) return
      setOpened(false)
      props.onClose?.()
    }
    const toggle = () => {
      const next = !opened.value
      setOpened(next)
      if (next) props.onOpen?.()
      else props.onClose?.()
    }
    const targetNode = computed(() => reference.value?.$el ?? reference.value ?? null)
    const dropdownNode = computed(() => (floating.value as any)?.$el ?? floating.value ?? null)
    useClickOutside(
      () => {
        if (props.closeOnClickOutside) {
          close()
          props.onDismiss?.()
        }
      },
      undefined,
      () => [targetNode.value, dropdownNode.value],
      () => opened.value,
    )
    const getStyles = useStyles({
      name: props.__staticSelector ?? 'Popover',
      classes,
      props,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
      varsResolver,
    })
    providePopoverContext({
      get opened() {
        return opened.value
      },
      get controlled() {
        return isControlled.value
      },
      get disabled() {
        return props.disabled
      },
      get withRoles() {
        return props.withRoles ?? true
      },
      get withArrow() {
        return props.withArrow ?? false
      },
      get arrowSize() {
        return props.arrowSize ?? 7
      },
      get arrowOffset() {
        return props.arrowOffset ?? 5
      },
      get arrowRadius() {
        return props.arrowRadius ?? 0
      },
      get arrowPosition() {
        return props.arrowPosition ?? 'side'
      },
      get placement() {
        return floatingState.placement.value as FloatingPosition
      },
      get x() {
        return floatingState.x.value ?? 0
      },
      get y() {
        return floatingState.y.value ?? 0
      },
      get targetWidth() {
        return targetWidth.value
      },
      get arrowX() {
        return floatingState.middlewareData.value.arrow?.x
      },
      get arrowY() {
        return floatingState.middlewareData.value.arrow?.y
      },
      reference: (node) => {
        reference.value = asElement(node)
      },
      floating: (node) => {
        floating.value = asElement(node)
      },
      arrowRef: (node) => {
        arrowElement.value = asElement(node)
      },
      onToggle: toggle,
      onClose: close,
      get onDismiss() {
        return props.onDismiss
      },
      getTargetId: () => `${id.value}-target`,
      getDropdownId: () => `${id.value}-dropdown`,
      get targetProps() {
        return props.targetProps || {}
      },
      get transitionProps() {
        return props.transitionProps
      },
      get withinPortal() {
        return props.withinPortal ?? true
      },
      get portalProps() {
        return props.portalProps
      },
      get trapFocus() {
        return props.trapFocus ?? false
      },
      get closeOnEscape() {
        return props.closeOnEscape ?? true
      },
      get returnFocus() {
        return props.returnFocus ?? false
      },
      get keepMounted() {
        return props.keepMounted ?? false
      },
      get width() {
        return props.width ?? 'max-content'
      },
      get zIndex() {
        return props.zIndex ?? getDefaultZIndex('popover')
      },
      get floatingStrategy() {
        return props.floatingStrategy ?? 'absolute'
      },
      getStyles,
    })
    watch(
      () => rawProps.opened,
      (value, old) => {
        if (value === old || value === undefined) return
        if (value) props.onOpen?.()
        else props.onClose?.()
      },
    )
    return () => [
      slots.default?.(),
      props.withOverlay &&
        h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
          h(
            Transition,
            {
              mounted: opened.value,
              keepMounted: props.keepMounted ?? false,
              ...props.transitionProps,
            },
            {
              default: (transitionStyle: any) =>
                h(Overlay, {
                  ...props.overlayProps,
                  fixed: true,
                  zIndex: props.zIndex,
                  ...getStyles('overlay', {
                    className: props.overlayProps?.class,
                    style: [transitionStyle, props.overlayProps?.style],
                  }),
                }),
            },
          ),
        ),
    ]
  },
})

export const Popover = Object.assign(PopoverBase, {
  classes,
  varsResolver,
  Target: PopoverTarget,
  Dropdown: PopoverDropdown,
  ContextMenu: PopoverContextMenu,
})
export type PopoverStylesNames = 'dropdown' | 'arrow' | 'overlay'
export type PopoverCssVariables = '--popover-radius' | '--popover-shadow'
export interface PopoverTargetProps {
  refProp?: string
  popupType?: string
  [key: string]: any
}
export interface PopoverDropdownProps {
  [key: string]: any
}
export interface PopoverContextMenuProps {
  disabled?: boolean
  longPressDelay?: number
  [key: string]: any
}
