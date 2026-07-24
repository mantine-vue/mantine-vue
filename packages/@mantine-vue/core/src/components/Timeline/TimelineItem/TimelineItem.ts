import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  getRadius,
  getThemeColor,
  hasNode,
  resolveNode,
  type MantineColor,
  type MantineNode,
  type MantineRadius,
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

export interface TimelineItemSlots {
  default?: () => VNodeChild
  title?: () => VNodeChild
  bullet?: () => VNodeChild
}

export const TimelineItem = withBoxProps(
  defineComponent({
    name: 'TimelineItem',
    inheritAttrs: false,
    slots: Object as SlotsType<TimelineItemSlots>,
    props: {
      __active: { type: Boolean, default: false },
      __lineActive: { type: Boolean, default: false },
      __align: { type: String as PropType<'right' | 'left'>, default: undefined },
      active: { type: Boolean, default: undefined },
      lineActive: { type: Boolean, default: undefined },
      title: { type: null as unknown as PropType<MantineNode>, default: undefined },
      bullet: { type: null as unknown as PropType<MantineNode>, default: undefined },
      radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
      color: { type: String as PropType<MantineColor>, default: undefined },
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

      return () => {
        const active = props.active ?? props.__active
        const lineActive = props.lineActive ?? props.__lineActive
        const bullet = resolveNode(props.bullet, slots.bullet)
        const title = resolveNode(props.title, slots.title)
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
                mod: { withChild: hasNode(bullet), align: props.__align, active },
              },
              () => bullet,
            ),
            h('div', ctx.getStyles('itemBody', { props }), [
              hasNode(title) ? h('div', ctx.getStyles('itemTitle', { props }), title as any) : null,
              h('div', ctx.getStyles('itemContent', { props }), slots.default?.() as any),
            ]),
          ],
        )
      }
    },
  }),
)

Object.assign(TimelineItem, { classes })
