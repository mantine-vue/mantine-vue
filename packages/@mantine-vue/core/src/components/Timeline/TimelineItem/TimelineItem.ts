import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  getRadius,
  getThemeColor,
  useMantineTheme,
  useProps,
} from '../../../core'
import { useTimelineContext } from '../Timeline.context'
import classes from '../Timeline.module.css'

export type TimelineItemStylesNames =
  | 'itemBody'
  | 'itemContent'
  | 'itemBullet'
  | 'item'
  | 'itemTitle'

export const TimelineItem = withBoxProps(
  defineComponent({
    name: 'TimelineItem',
    inheritAttrs: false,
    props: {
      __active: { type: Boolean, default: false },
      __lineActive: { type: Boolean, default: false },
      __align: { type: String as PropType<'right' | 'left'>, default: undefined },
      active: { type: Boolean, default: undefined },
      lineActive: { type: Boolean, default: undefined },
      title: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      bullet: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      color: { type: String, default: undefined },
      lineVariant: { type: String as PropType<'solid' | 'dashed' | 'dotted'>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      className: { type: [String, Array, Object] as PropType<any>, default: undefined },
      style: { type: [String, Array, Object] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('TimelineItem', null, rawProps)
      const ctx = useTimelineContext()
      const theme = useMantineTheme()

      const renderContent = (value: any) => (typeof value === 'function' ? value() : value)

      return () => {
        const active = props.active ?? props.__active
        const lineActive = props.lineActive ?? props.__lineActive
        const stylesApiProps = { className: props.className ?? attrs.class, props }

        return h(
          Box,
          {
            ...attrs,
            mod: [{ lineActive, active }, props.mod],
            ...ctx.getStyles('item', {
              ...stylesApiProps,
              style: {
                '--tli-radius': props.radius !== undefined ? getRadius(props.radius) : undefined,
                '--tli-color': props.color ? getThemeColor(props.color, theme.value) : undefined,
                '--tli-border-style': props.lineVariant || undefined,
                ...(props.style as Record<string, any>),
                ...(attrs.style as Record<string, any>),
              },
            }),
          },
          () => [
            h(
              Box,
              {
                ...ctx.getStyles('itemBullet', { props }),
                mod: { withChild: Boolean(props.bullet), align: props.__align, active },
              },
              () => renderContent(props.bullet),
            ),
            h('div', ctx.getStyles('itemBody', { props }), [
              props.title
                ? h('div', ctx.getStyles('itemTitle', { props }), renderContent(props.title))
                : null,
              h('div', ctx.getStyles('itemContent', { props }), slots.default?.()),
            ]),
          ],
        )
      }
    },
  }),
)

Object.assign(TimelineItem, { classes })
