import { defineComponent, h, type PropType, type Ref } from 'vue'
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
import classes from './FloatingWindow.module.css'

export type FloatingWindowStylesNames = 'root'
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

    return () =>
      h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
        h(
          Paper,
          {
            ...attrs,
            ref: ((value: any) => floating.ref(value?.$el ?? value)) as any,
            shadow: props.shadow,
            radius: props.radius,
            withBorder: props.withBorder,
            mod: [{ dragging: floating.isDragging.value }, props.mod],
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            style: [
              getStyles('root').style,
              { '--floating-window-z-index': String(props.zIndex) },
              attrs.style,
            ],
          },
          () => slots.default?.(),
        ),
      )
  },
})

Object.assign(FloatingWindow, { classes })
