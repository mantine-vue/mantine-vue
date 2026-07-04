import { defineComponent, h, type PropType } from 'vue'
import { useScroller } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getThemeColor,
  rem,
  useProps,
  useStyles,
} from '../../core'
import { AccordionChevron } from '../Accordion'
import { UnstyledButton } from '../UnstyledButton'
import classes from './Scroller.module.css'

export type ScrollerStylesNames = 'root' | 'container' | 'content' | 'control' | 'chevron'
export type ScrollerCssVariables = {
  root: '--scroller-control-size' | '--scroller-background-color'
}

export interface ScrollerProps {
  scrollAmount?: number
  controlSize?: string | number
  edgeGradientColor?: string
  startControlProps?: Record<string, any>
  endControlProps?: Record<string, any>
  startControlIcon?: any
  endControlIcon?: any
  showStartControl?: boolean
  showEndControl?: boolean
  draggable?: boolean
  classNames?: Record<string, string> | ((theme: any, props: any) => Record<string, string>)
  styles?: Record<string, any> | ((theme: any, props: any) => Record<string, any>)
  vars?:
    | Record<string, Record<string, string | undefined>>
    | ((theme: any, props: any) => Record<string, Record<string, string | undefined>>)
  unstyled?: boolean
}

const defaultProps = {
  scrollAmount: 200,
  draggable: true,
} as const

const varsResolver = createVarsResolver<any>((theme, { controlSize, edgeGradientColor }) => ({
  root: {
    '--scroller-control-size': controlSize === undefined ? undefined : rem(controlSize),
    '--scroller-background-color': edgeGradientColor
      ? getThemeColor(edgeGradientColor, theme)
      : undefined,
  },
}))

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

export const Scroller = withBoxProps(
  defineComponent({
    name: 'Scroller',
    inheritAttrs: false,
    props: {
      scrollAmount: { type: Number, default: undefined },
      controlSize: { type: [String, Number] as PropType<string | number>, default: undefined },
      edgeGradientColor: { type: String, default: undefined },
      startControlProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      endControlProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      startControlIcon: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      endControlIcon: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      showStartControl: { type: Boolean, default: false },
      showEndControl: { type: Boolean, default: false },
      draggable: { type: Boolean, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Scroller', defaultProps, rawProps)
      const scroller = useScroller({
        scrollAmount: props.scrollAmount,
        draggable: props.draggable,
      })
      const getStyles = useStyles({
        name: 'Scroller',
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

      return () => {
        const showStart = props.showStartControl || scroller.canScrollStart.value
        const showEnd = props.showEndControl || scroller.canScrollEnd.value

        return h(
          Box,
          { ...attrs, ...getStyles('root', { className: attrs.class, style: attrs.style as any }) },
          () => [
            h(
              UnstyledButton,
              {
                ...props.startControlProps,
                ...getStyles('control'),
                onClick: scroller.scrollStart,
                'data-position': 'start',
                'data-hidden': !showStart || undefined,
                'aria-label': 'Scroll left',
                tabindex: showStart ? 0 : -1,
              },
              () =>
                renderContent(props.startControlIcon) || h(AccordionChevron, getStyles('chevron')),
            ),
            h(
              'div',
              {
                ...getStyles('container'),
                ref: scroller.ref as any,
                role: 'presentation',
                'data-draggable': props.draggable || undefined,
                ...scroller.dragHandlers,
              },
              h('div', getStyles('content'), slots.default?.()),
            ),
            h(
              UnstyledButton,
              {
                ...props.endControlProps,
                ...getStyles('control'),
                onClick: scroller.scrollEnd,
                'data-position': 'end',
                'data-hidden': !showEnd || undefined,
                'aria-label': 'Scroll right',
                tabindex: showEnd ? 0 : -1,
              },
              () =>
                renderContent(props.endControlIcon) || h(AccordionChevron, getStyles('chevron')),
            ),
          ],
        )
      }
    },
  }),
)

Object.assign(Scroller, { classes, varsResolver })
