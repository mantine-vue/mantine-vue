import { cloneVNode, defineComponent, h, type PropType, type VNode } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getThemeColor,
  rem,
  useProps,
  useStyles,
  type MantineColor,
  type MantineRadius,
} from '../../core'
import { provideTimelineContext } from './Timeline.context'
import { TimelineItem } from './TimelineItem/TimelineItem'
import classes from './Timeline.module.css'

export type TimelineStylesNames =
  | 'root'
  | 'itemBody'
  | 'itemContent'
  | 'itemBullet'
  | 'item'
  | 'itemTitle'

const defaultProps = {
  active: -1,
  align: 'left',
} as const

const varsResolver = createVarsResolver<any>(
  (theme, { bulletSize, lineWidth, radius, color, autoContrast }) => ({
    root: {
      '--tl-bullet-size': rem(bulletSize),
      '--tl-line-width': rem(lineWidth),
      '--tl-radius': radius === undefined ? undefined : getRadius(radius),
      '--tl-color': color ? getThemeColor(color, theme) : undefined,
      '--tl-icon-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
    },
  }),
)

const TimelineBase = defineComponent({
  name: 'Timeline',
  inheritAttrs: false,
  props: {
    active: { type: Number, default: undefined },
    color: { type: String as PropType<MantineColor>, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    bulletSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    align: { type: String as PropType<'right' | 'left'>, default: undefined },
    lineWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    reverseActive: { type: Boolean, default: false },
    autoContrast: { type: Boolean, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Timeline', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'Timeline',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    provideTimelineContext({ getStyles })

    return () => {
      const children = (slots.default?.() ?? []).filter(Boolean) as VNode[]
      const active = props.active ?? defaultProps.active
      const items = children.map((item, index) =>
        cloneVNode(
          item,
          {
            unstyled: props.unstyled,
            __align: props.align,
            __active: props.reverseActive ? active >= children.length - index - 1 : active >= index,
            __lineActive: props.reverseActive
              ? active >= children.length - index - 1
              : active - 1 >= index,
          },
          true,
        ),
      )

      return h(
        Box,
        {
          ...attrs,
          mod: [{ align: props.align }, props.mod],
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
        },
        () => items,
      )
    }
  },
})

export const Timeline = withBoxProps(
  Object.assign(TimelineBase, {
    classes,
    varsResolver,
    Item: TimelineItem,
  }),
)
