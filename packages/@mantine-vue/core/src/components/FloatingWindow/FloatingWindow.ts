import { defineComponent, h, ref, type PropType, type Ref } from 'vue'
import {
  assignRef,
  useFloatingWindow,
  type FloatingWindowPosition,
  type FloatingWindowPositionConfig,
  type SetFloatingWindowPosition,
} from '@mantine-vue/hooks'
import { getDefaultZIndex, useProps, useStyles } from '../../core'
import { Paper } from '../Paper'
import { OptionalPortal } from '../Portal'
import {
  provideFloatingWindowContext,
  type FloatingWindowDimensions,
  type FloatingWindowSize,
} from './FloatingWindow.context'
import { FloatingWindowResizeHandle } from './FloatingWindowResizeHandle'
import classes from './FloatingWindow.module.css'

export type FloatingWindowStylesNames = 'root'

function clampDimension(value: number, min?: number, max?: number) {
  let result = value
  if (min != null) result = Math.max(result, min)
  if (max != null) result = Math.min(result, max)
  return result
}
const defaultProps = {
  constrainToViewport: true,
  withinPortal: true,
  zIndex: getDefaultZIndex('overlay'),
} as const

export const FloatingWindow = defineComponent({
  name: 'FloatingWindow',
  inheritAttrs: false,
  props: {
    enabled: { type: Boolean, default: undefined },
    constrainToViewport: { type: Boolean, default: undefined },
    constrainOffset: { type: Number, default: undefined },
    dragHandleSelector: { type: String, default: undefined },
    excludeDragHandleSelector: { type: String, default: undefined },
    axis: { type: String as PropType<'x' | 'y'>, default: undefined },
    initialPosition: { type: Object as PropType<FloatingWindowPositionConfig>, default: undefined },
    onPositionChange: {
      type: Function as PropType<(position: FloatingWindowPosition) => void>,
      default: undefined,
    },
    onDragStart: { type: Function as PropType<() => void>, default: undefined },
    onDragEnd: { type: Function as PropType<() => void>, default: undefined },
    setPositionRef: {
      type: Object as PropType<Ref<SetFloatingWindowPosition | null>>,
      default: undefined,
    },
    withinPortal: { type: Boolean, default: undefined },
    portalProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    zIndex: { type: [String, Number] as PropType<string | number>, default: undefined },
    dimensions: { type: Object as PropType<FloatingWindowDimensions>, default: undefined },
    onSizeChange: {
      type: Function as PropType<(size: FloatingWindowSize) => void>,
      default: undefined,
    },
    onResizeStart: { type: Function as PropType<() => void>, default: undefined },
    onResizeEnd: { type: Function as PropType<() => void>, default: undefined },
    shadow: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    withBorder: { type: Boolean, default: false },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots, expose }) {
    const props = useProps('FloatingWindow', defaultProps, rawProps)
    const floating = useFloatingWindow<HTMLDivElement>(props)
    const rootRef = ref<HTMLDivElement | null>(null)
    assignRef(props.setPositionRef, floating.setPosition)
    expose({ setPosition: floating.setPosition })
    const getStyles = useStyles({
      name: 'FloatingWindow',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
    })

    provideFloatingWindowContext({
      rootRef,
      get dimensions() {
        return props.dimensions
      },
      get constrainToViewport() {
        return props.constrainToViewport
      },
      get constrainOffset() {
        return props.constrainOffset
      },
      get onSizeChange() {
        return props.onSizeChange
      },
      get onResizeStart() {
        return props.onResizeStart
      },
      get onResizeEnd() {
        return props.onResizeEnd
      },
    })

    return () =>
      h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
        h(
          Paper,
          {
            ...attrs,
            ref: ((value: any) => {
              const node = value?.$el ?? value
              rootRef.value = node
              floating.ref(node)
            }) as any,
            shadow: props.shadow,
            radius: props.radius,
            withBorder: props.withBorder,
            mod: [{ dragging: floating.isDragging.value }, props.mod],
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            style: [
              getStyles('root').style,
              {
                '--floating-window-z-index': String(props.zIndex),
                '--floating-window-width':
                  props.dimensions?.initialWidth == null
                    ? undefined
                    : `${clampDimension(
                        props.dimensions.initialWidth,
                        props.dimensions.minWidth,
                        props.dimensions.maxWidth,
                      )}px`,
                '--floating-window-height':
                  props.dimensions?.initialHeight == null
                    ? undefined
                    : `${clampDimension(
                        props.dimensions.initialHeight,
                        props.dimensions.minHeight,
                        props.dimensions.maxHeight,
                      )}px`,
              },
              attrs.style,
            ],
          },
          () => slots.default?.(),
        ),
      )
  },
})

Object.assign(FloatingWindow, { classes, ResizeHandle: FloatingWindowResizeHandle })
