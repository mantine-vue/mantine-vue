import {
  cloneVNode,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  type PropType,
  type VNode,
} from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getDefaultZIndex,
  getRadius,
  useDirection,
  useProps,
  useStyles,
} from '../../core'
import {
  FloatingArrow,
  getArrowMergeDropdownStyles,
  getFloatingPosition,
  type ArrowPosition,
  type FloatingAxesOffsets,
  type FloatingPosition,
  type FloatingStrategy,
} from '../../utils/Floating'
import { OptionalPortal } from '../Portal'
import { Transition } from '../Transition'
import { TooltipFloating } from './TooltipFloating/TooltipFloating'
import { TooltipGroup } from './TooltipGroup/TooltipGroup'
import type { TooltipBaseProps, TooltipMiddlewares, TooltipStylesNames } from './Tooltip.types'
import { useTooltip } from './use-tooltip'
import classes from './Tooltip.module.css'

export interface TooltipProps extends TooltipBaseProps {
  onPositionChange?: (position: FloatingPosition) => void
  openDelay?: number
  closeDelay?: number
  opened?: boolean
  defaultOpened?: boolean
  offset?: number | FloatingAxesOffsets
  withArrow?: boolean
  arrowSize?: number
  arrowOffset?: number
  arrowRadius?: number
  arrowPosition?: ArrowPosition
  transitionProps?: Record<string, any>
  events?: { hover: boolean; focus: boolean; touch: boolean }
  inline?: boolean
  keepMounted?: boolean
  floatingStrategy?: FloatingStrategy
  autoContrast?: boolean
  target?: any
  middlewares?: TooltipMiddlewares
}

const defaults = {
  position: 'top',
  refProp: 'ref',
  withinPortal: true,
  arrowSize: 4,
  arrowOffset: 5,
  arrowRadius: 0,
  arrowPosition: 'side',
  offset: 5,
  transitionProps: { duration: 100, transition: 'fade' },
  events: { hover: true, focus: false, touch: false },
  zIndex: getDefaultZIndex('popover'),
  middlewares: { flip: true, shift: true, inline: false },
  floatingStrategy: 'absolute',
} as const
const varsResolver = createVarsResolver<any>((theme, props) => {
  const colors = theme.variantColorResolver({
    theme,
    color: props.color || theme.primaryColor,
    autoContrast: props.autoContrast,
    variant: props.variant || 'filled',
  })
  return {
    tooltip: {
      '--tooltip-radius': props.radius === undefined ? undefined : getRadius(props.radius),
      '--tooltip-bg': props.color ? colors.background : undefined,
      '--tooltip-color': props.color ? colors.color : undefined,
    },
  }
})
function one(slots: any): VNode | null {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  return children.length === 1 ? children[0] : null
}
function asElement(node: any): HTMLElement | null {
  const candidate = node?.$el ?? node
  return typeof Element !== 'undefined' && candidate instanceof Element
    ? (candidate as HTMLElement)
    : null
}
const TooltipBase = defineComponent({
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    label: { required: true },
    position: { type: String as PropType<FloatingPosition>, default: undefined },
    refProp: String,
    withinPortal: { type: Boolean, default: undefined },
    radius: [String, Number],
    color: String,
    multiline: Boolean,
    zIndex: [String, Number],
    disabled: Boolean,
    portalProps: Object,
    middlewares: Object,
    onPositionChange: Function as PropType<(position: FloatingPosition) => void>,
    openDelay: Number,
    closeDelay: Number,
    opened: { type: Boolean, default: undefined },
    defaultOpened: Boolean,
    offset: {
      type: [Number, Object] as PropType<number | FloatingAxesOffsets>,
      default: undefined,
    },
    withArrow: Boolean,
    arrowSize: Number,
    arrowOffset: Number,
    arrowRadius: Number,
    arrowPosition: { type: String as PropType<ArrowPosition>, default: undefined },
    transitionProps: Object,
    events: Object as PropType<{ hover: boolean; focus: boolean; touch: boolean }>,
    inline: Boolean,
    keepMounted: Boolean,
    floatingStrategy: { type: String as PropType<FloatingStrategy>, default: undefined },
    autoContrast: Boolean,
    target: { type: [String, Object] as PropType<any>, default: undefined },
    classNames: [Object, Function],
    styles: [Object, Function],
    vars: [Object, Function],
    unstyled: Boolean,
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Tooltip', defaults, rawProps)
    const { dir } = useDirection()
    const tooltip = useTooltip({
      position: () => getFloatingPosition(dir.value, props.position ?? 'top'),
      opened: () => rawProps.opened,
      defaultOpened: props.defaultOpened,
      openDelay: () => props.openDelay,
      closeDelay: () => props.closeDelay,
      offset: () =>
        typeof props.offset === 'number'
          ? props.offset + (props.withArrow ? (props.arrowSize ?? 4) / 2 : 0)
          : (props.offset ?? 5),
      arrowOffset: () => props.arrowOffset ?? 5,
      events: () => props.events ?? { hover: true, focus: false, touch: false },
      strategy: () => props.floatingStrategy ?? 'absolute',
      middlewares: () => props.middlewares,
      onPositionChange: props.onPositionChange,
    })
    const getStyles = useStyles({
      name: 'Tooltip',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
      varsResolver,
    })
    const referenceHandlers = () => ({
      onMouseenter: () => {
        if ((props.events ?? defaults.events).hover) tooltip.open()
      },
      onMouseleave: () => {
        if ((props.events ?? defaults.events).hover) tooltip.close()
      },
      onFocus: () => {
        if ((props.events ?? defaults.events).focus) tooltip.open()
      },
      onBlur: () => {
        if ((props.events ?? defaults.events).focus) tooltip.close()
      },
    })
    let external: HTMLElement | null = null
    const externalHandlers = referenceHandlers()
    const resolveTarget = () =>
      typeof props.target === 'string'
        ? asElement(document.querySelector(props.target))
        : asElement(props.target?.value ?? props.target)
    const bindExternal = () => {
      external = resolveTarget()
      if (!external) return
      external.addEventListener('mouseenter', externalHandlers.onMouseenter as any)
      external.addEventListener('mouseleave', externalHandlers.onMouseleave as any)
      external.addEventListener('focus', externalHandlers.onFocus as any)
      external.addEventListener('blur', externalHandlers.onBlur as any)
      tooltip.reference.value = external
    }
    const unbindExternal = () => {
      if (!external) return
      external.removeEventListener('mouseenter', externalHandlers.onMouseenter as any)
      external.removeEventListener('mouseleave', externalHandlers.onMouseleave as any)
      external.removeEventListener('focus', externalHandlers.onFocus as any)
      external.removeEventListener('blur', externalHandlers.onBlur as any)
      external = null
    }
    onMounted(() => props.target && bindExternal())
    onBeforeUnmount(unbindExternal)

    return () => {
      const child = props.target ? null : one(slots)
      if (!props.target && !child)
        throw new Error(
          'Tooltip component children should be a single element or component that accepts ref',
        )
      const arrowPosition = props.arrowPosition ?? 'side'
      const mergeStyles =
        arrowPosition === 'merge' && props.withArrow
          ? getArrowMergeDropdownStyles({
              position: tooltip.placement.value as FloatingPosition,
              dir: dir.value,
            })
          : undefined
      const floating = h(
        OptionalPortal,
        { withinPortal: props.withinPortal, ...props.portalProps },
        () =>
          h(
            Transition,
            {
              mounted: !props.disabled && tooltip.opened.value,
              keepMounted: props.keepMounted,
              ...props.transitionProps,
            },
            {
              default: (transitionStyle: any) =>
                h(
                  Box,
                  {
                    ...attrs,
                    ref: (node: any) => (tooltip.floating.value = asElement(node)),
                    role: 'tooltip',
                    'data-multiline': props.multiline || undefined,
                    'data-fixed': props.floatingStrategy === 'fixed' || undefined,
                    ...getStyles('tooltip', {
                      className: attrs.class,
                      style: [
                        attrs.style,
                        transitionStyle,
                        mergeStyles,
                        {
                          zIndex: props.zIndex,
                          top: `${tooltip.y.value ?? 0}px`,
                          left: `${tooltip.x.value ?? 0}px`,
                        },
                      ],
                    }),
                  },
                  () => [
                    props.label as any,
                    h(FloatingArrow, {
                      ref: (node: any) => (tooltip.arrowRef.value = asElement(node)),
                      visible: props.withArrow,
                      position: tooltip.placement.value as FloatingPosition,
                      arrowSize: props.arrowSize ?? 4,
                      arrowOffset: props.arrowOffset ?? 5,
                      arrowRadius: props.arrowRadius ?? 0,
                      arrowPosition,
                      arrowX: tooltip.arrowX.value,
                      arrowY: tooltip.arrowY.value,
                      ...getStyles('arrow'),
                    }),
                  ],
                ),
            },
          ),
      )
      if (!child) return floating
      return [
        floating,
        cloneVNode(
          child,
          {
            ...referenceHandlers(),
            [props.refProp ?? 'ref']: mergeRefs(
              (node: any) => (tooltip.reference.value = asElement(node)),
              (child as any).ref,
            ),
          },
          true,
        ),
      ]
    }
  },
})

export const Tooltip = Object.assign(TooltipBase, {
  classes,
  varsResolver,
  Floating: TooltipFloating,
  Group: TooltipGroup,
})
export type { TooltipStylesNames }
