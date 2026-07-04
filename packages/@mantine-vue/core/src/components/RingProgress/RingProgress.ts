import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, rem, useProps, useStyles } from '../../core'
import { Curve } from './Curve/Curve'
import { getCurves } from './get-curves/get-curves'
import classes from './RingProgress.module.css'

export interface RingProgressSection extends Record<string, any> {
  value: number
  color: string
  tooltip?: any
}

export type RingProgressStylesNames = 'root' | 'svg' | 'label' | 'curve'
export type RingProgressCssVariables = {
  root: '--rp-size' | '--rp-label-offset' | '--rp-transition-duration'
  svg: '--rp-start-angle'
}

export interface RingProgressProps {
  label?: any
  thickness?: number
  size?: number
  roundCaps?: boolean
  sections: RingProgressSection[]
  rootColor?: string
  transitionDuration?: number
  sectionGap?: number
  startAngle?: number
  classNames?: Record<string, string> | ((theme: any, props: any) => Record<string, string>)
  styles?: Record<string, any> | ((theme: any, props: any) => Record<string, any>)
  vars?:
    | Record<string, Record<string, string | undefined>>
    | ((theme: any, props: any) => Record<string, Record<string, string | undefined>>)
  unstyled?: boolean
}

const defaultProps = {
  size: 120,
  thickness: 12,
  startAngle: 270,
} as const

function getClampedThickness(thickness: number, size: number) {
  return Math.min(thickness || 12, (size || 120) / 4)
}

const varsResolver = createVarsResolver<any>(
  (_, { size, thickness, transitionDuration, startAngle }) => ({
    root: {
      '--rp-size': rem(size),
      '--rp-label-offset': rem((thickness ?? defaultProps.thickness) * 2),
      '--rp-transition-duration': transitionDuration ? `${transitionDuration}ms` : undefined,
    },
    svg: {
      '--rp-start-angle': `${startAngle}deg`,
    },
  }),
)

export const RingProgress = withBoxProps(
  defineComponent({
    name: 'RingProgress',
    inheritAttrs: false,
    props: {
      label: {
        type: [String, Number, Object, Function, Array] as PropType<any>,
        default: undefined,
      },
      thickness: { type: Number, default: undefined },
      size: { type: Number, default: undefined },
      roundCaps: { type: Boolean, default: false },
      sections: { type: Array as PropType<RingProgressSection[]>, required: true },
      rootColor: { type: String, default: undefined },
      transitionDuration: { type: Number, default: undefined },
      sectionGap: { type: Number, default: undefined },
      startAngle: { type: Number, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('RingProgress', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'RingProgress',
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

      const renderContent = (value: any) => (typeof value === 'function' ? value() : value)

      return () => {
        const size = props.size ?? defaultProps.size
        const thickness = props.thickness ?? defaultProps.thickness
        const clampedThickness = getClampedThickness(thickness, size)
        const label = props.label ?? slots.label?.()

        const curves = getCurves({
          size,
          thickness: clampedThickness,
          sections: props.sections,
          renderRoundedLineCaps: props.roundCaps,
          rootColor: props.rootColor,
          sectionGap: props.sectionGap,
        }).map(({ data, sum, root, lineRoundCaps, offset }, index) => {
          const { value, color, tooltip, ...sectionAttrs } = data as RingProgressSection

          return h(Curve, {
            ...sectionAttrs,
            key: index,
            size,
            thickness: clampedThickness,
            sum,
            offset,
            value,
            color,
            root,
            lineRoundCaps,
            getStyles,
            ...(tooltip
              ? { 'aria-label': typeof tooltip === 'string' ? tooltip : undefined }
              : null),
          })
        })

        return h(
          Box,
          {
            ...attrs,
            size,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => [
            h('svg', { ...getStyles('svg'), viewBox: `0 0 ${size} ${size}` }, curves),
            label ? h('div', { ...getStyles('label') }, renderContent(label)) : null,
          ],
        )
      }
    },
  }),
)

Object.assign(RingProgress, { classes, varsResolver })
