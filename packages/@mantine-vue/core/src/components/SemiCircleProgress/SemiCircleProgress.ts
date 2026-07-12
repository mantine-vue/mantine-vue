import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getThemeColor,
  hasNode,
  rem,
  resolveNode,
  type MantineNode,
  useProps,
  useStyles,
} from '../../core'
import classes from './SemiCircleProgress.module.css'

export type SemiCircleProgressStylesNames =
  | 'root'
  | 'svg'
  | 'emptySegment'
  | 'filledSegment'
  | 'label'

export interface SemiCircleProgressSlots {
  label?: () => VNodeChild
}

const defaultProps = {
  size: 200,
  thickness: 12,
  orientation: 'up',
  fillDirection: 'left-to-right',
  labelPosition: 'bottom',
} as const

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getRotation({
  orientation,
  fillDirection,
}: {
  orientation?: 'up' | 'down'
  fillDirection?: 'right-to-left' | 'left-to-right'
}) {
  if (orientation === 'down') {
    return fillDirection === 'right-to-left' ? 'rotate(180deg) rotateY(180deg)' : 'rotate(180deg)'
  }

  return fillDirection === 'left-to-right' ? 'rotateY(180deg)' : undefined
}

const varsResolver = createVarsResolver<any>(
  (
    theme,
    {
      filledSegmentColor,
      emptySegmentColor,
      orientation,
      fillDirection,
      transitionDuration,
      thickness,
    },
  ) => ({
    root: {
      '--scp-filled-segment-color': filledSegmentColor
        ? getThemeColor(filledSegmentColor, theme)
        : undefined,
      '--scp-empty-segment-color': emptySegmentColor
        ? getThemeColor(emptySegmentColor, theme)
        : undefined,
      '--scp-rotation': getRotation({ orientation, fillDirection }),
      '--scp-transition-duration': transitionDuration ? `${transitionDuration}ms` : undefined,
      '--scp-thickness': rem(thickness),
    },
  }),
)

export const SemiCircleProgress = withBoxProps(
  defineComponent({
    name: 'SemiCircleProgress',
    inheritAttrs: false,
    slots: Object as SlotsType<SemiCircleProgressSlots>,
    props: {
      value: { type: Number, required: true },
      size: { type: Number, default: undefined },
      thickness: { type: Number, default: undefined },
      orientation: { type: String as PropType<'up' | 'down'>, default: undefined },
      fillDirection: {
        type: String as PropType<'right-to-left' | 'left-to-right'>,
        default: undefined,
      },
      filledSegmentColor: { type: String, default: undefined },
      emptySegmentColor: { type: String, default: undefined },
      transitionDuration: { type: Number, default: undefined },
      label: { type: null as unknown as PropType<MantineNode>, default: undefined },
      labelPosition: { type: String as PropType<'center' | 'bottom'>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('SemiCircleProgress', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'SemiCircleProgress',
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

      return () => {
        const size = props.size ?? defaultProps.size
        const thickness = props.thickness ?? defaultProps.thickness
        const coordinateForCircle = size / 2
        const radius = (size - 2 * thickness) / 2
        const circumference = Math.PI * radius
        const semiCirclePercentage = clamp(props.value, 0, 100) * (circumference / 100)
        const label = resolveNode(props.label, slots.label)

        return h(
          Box,
          {
            ...attrs,
            w: size,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => [
            hasNode(label)
              ? h(
                  'div',
                  {
                    ...getStyles('label'),
                    'data-position': props.labelPosition,
                    'data-orientation': props.orientation,
                  },
                  label as any,
                )
              : null,
            h(
              'svg',
              {
                width: size,
                height: size / 2,
                viewBox: `0 0 ${size} ${size / 2}`,
                ...getStyles('svg'),
              },
              [
                h('circle', {
                  cx: coordinateForCircle,
                  cy: coordinateForCircle,
                  r: radius,
                  fill: 'none',
                  stroke: 'var(--scp-empty-segment-color)',
                  'stroke-width': thickness,
                  'stroke-dasharray': circumference,
                  ...getStyles('emptySegment', { style: { strokeDashoffset: circumference } }),
                }),
                h('circle', {
                  cx: coordinateForCircle,
                  cy: coordinateForCircle,
                  r: radius,
                  fill: 'none',
                  stroke: 'var(--scp-filled-segment-color)',
                  'stroke-width': thickness,
                  'stroke-dasharray': circumference,
                  ...getStyles('filledSegment', {
                    style: { strokeDashoffset: semiCirclePercentage },
                  }),
                }),
              ],
            ),
          ],
        )
      }
    },
  }),
)

Object.assign(SemiCircleProgress, { classes, varsResolver })
