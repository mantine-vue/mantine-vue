import { shift, useFloating } from '@floating-ui/vue'
import { cloneVNode, computed, defineComponent, h, ref, type PropType, type VNode } from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getDefaultZIndex,
  getRadius,
  getThemeColor,
  useProps,
  useStyles,
} from '../../../core'
import type { FloatingPosition } from '../../../utils/Floating'
import { OptionalPortal } from '../../Portal'
import classes from '../Tooltip.module.css'

function one(slots: any): VNode {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  if (children.length !== 1)
    throw new Error(
      'Tooltip.Floating component children should be a single element or component that accepts ref',
    )
  return children[0]
}
function asElement(node: any): HTMLElement | null {
  const candidate = node?.$el ?? node
  return typeof Element !== 'undefined' && candidate instanceof Element
    ? (candidate as HTMLElement)
    : null
}
// function call(handler: any, event: Event) {
//   if (Array.isArray(handler)) handler.forEach((fn) => fn?.(event))
//   else handler?.(event)
// }

const defaults = {
  refProp: 'ref',
  withinPortal: true,
  offset: 10,
  position: 'right',
  zIndex: getDefaultZIndex('popover'),
} as const
const varsResolver = createVarsResolver<any>((theme, props) => ({
  tooltip: {
    '--tooltip-radius': props.radius === undefined ? undefined : getRadius(props.radius),
    '--tooltip-bg': props.color ? getThemeColor(props.color, theme) : undefined,
    '--tooltip-color': props.color ? 'var(--mantine-color-white)' : undefined,
  },
}))

export const TooltipFloating = defineComponent({
  name: 'TooltipFloating',
  inheritAttrs: false,
  props: {
    label: { required: true },
    refProp: String,
    withinPortal: { type: Boolean, default: undefined },
    offset: Number,
    position: { type: String as PropType<FloatingPosition>, default: undefined },
    zIndex: [String, Number],
    disabled: Boolean,
    defaultOpened: Boolean,
    multiline: Boolean,
    radius: [String, Number],
    color: String,
    portalProps: Object,
    classNames: [Object, Function],
    styles: [Object, Function],
    vars: [Object, Function],
    unstyled: Boolean,
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('TooltipFloating', defaults, rawProps)
    const opened = ref(props.defaultOpened)
    const boundary = ref<any>(null)
    const floating = ref<HTMLElement | null>(null)
    const virtual = ref<any>(null)
    const state = useFloating(virtual, floating, {
      placement: computed(() => props.position),
      middleware: [shift({ crossAxis: true, padding: 5, rootBoundary: 'document' })],
    })
    const getStyles = useStyles({
      name: 'TooltipFloating',
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
    const move = (event: MouseEvent) => {
      const valueOffset = props.offset ?? 10
      const horizontal = state.placement.value.includes('right')
        ? valueOffset
        : state.placement.value.includes('left')
          ? -valueOffset
          : 0
      const vertical = state.placement.value.includes('bottom')
        ? valueOffset
        : state.placement.value.includes('top')
          ? -valueOffset
          : 0
      virtual.value = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: event.clientX,
          y: event.clientY,
          left: event.clientX + horizontal,
          top: event.clientY + vertical,
          right: event.clientX,
          bottom: event.clientY,
        }),
      }
    }
    return () => {
      const child = one(slots)
      // const childProps = child.props || {}
      return [
        h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
          h(
            Box,
            {
              ...attrs,
              ref: (node: any) => (floating.value = asElement(node)),
              role: 'tooltip',
              'data-multiline': props.multiline || undefined,
              ...getStyles('tooltip', { className: attrs.class }),
              style: [
                getStyles('tooltip').style,
                attrs.style,
                {
                  zIndex: props.zIndex,
                  display: !props.disabled && opened.value ? 'block' : 'none',
                  top: state.y.value == null ? '' : `${Math.round(state.y.value)}px`,
                  left: state.x.value == null ? '' : `${Math.round(state.x.value)}px`,
                },
              ],
            },
            () => props.label as any,
          ),
        ),
        cloneVNode(
          child,
          {
            [props.refProp ?? 'ref']: mergeRefs(
              (node: any) => (boundary.value = asElement(node)),
              (child as any).ref,
            ),
            onMouseenter: (event: MouseEvent) => {
              move(event)
              opened.value = true
            },
            onMousemove: (event: MouseEvent) => {
              move(event)
            },
            onMouseleave: () => {
              opened.value = false
            },
          },
          true,
        ),
      ]
    }
  },
})
export interface TooltipFloatingProps {
  label: any
  offset?: number
  position?: FloatingPosition
  defaultOpened?: boolean
  [key: string]: any
}
