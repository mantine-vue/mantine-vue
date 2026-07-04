import { defineComponent, h, ref, watch, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, useProps, useStyles } from '../../core'
import { buildValue } from './build-value'
import { DigitColumn } from './DigitColumn'
import { getDigitParts } from './get-digit-parts'
import { getRenderSlots } from './get-render-slots'
import classes from './RollingNumber.module.css'

export type RollingNumberStylesNames = 'root' | 'digit' | 'digitColumn' | 'char'
export type RollingNumberCssVariables = {
  root: '--rn-duration' | '--rn-timing-function'
}

export interface RollingNumberProps {
  value: number
  prefix?: string
  suffix?: string
  decimalSeparator?: string
  thousandSeparator?: string | boolean
  decimalScale?: number
  fixedDecimalScale?: boolean
  animationDuration?: number
  timingFunction?: string
  tabularNumbers?: boolean
  withLiveRegion?: boolean
  mod?: Record<string, any> | Array<Record<string, any> | undefined>
  classNames?: Record<string, string> | ((theme: any, props: any) => Record<string, string>)
  styles?: Record<string, any> | ((theme: any, props: any) => Record<string, any>)
  vars?:
    | Record<string, Record<string, string | undefined>>
    | ((theme: any, props: any) => Record<string, Record<string, string | undefined>>)
  unstyled?: boolean
}

const defaultProps = {
  animationDuration: 600,
  timingFunction: 'ease',
  decimalSeparator: '.',
  tabularNumbers: true,
} as const

const varsResolver = createVarsResolver<any>((_, { animationDuration, timingFunction }) => ({
  root: {
    '--rn-duration': `${animationDuration}ms`,
    '--rn-timing-function': timingFunction,
  },
}))

export const RollingNumber = withBoxProps(
  defineComponent({
    name: 'RollingNumber',
    inheritAttrs: false,
    props: {
      value: { type: Number, required: true },
      prefix: { type: String, default: undefined },
      suffix: { type: String, default: undefined },
      decimalSeparator: { type: String, default: undefined },
      thousandSeparator: {
        type: [String, Boolean] as PropType<string | boolean>,
        default: undefined,
      },
      decimalScale: { type: Number, default: undefined },
      fixedDecimalScale: { type: Boolean, default: false },
      animationDuration: { type: Number, default: undefined },
      timingFunction: { type: String, default: undefined },
      tabularNumbers: { type: Boolean, default: undefined },
      withLiveRegion: { type: Boolean, default: false },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs }) {
      const props = useProps('RollingNumber', defaultProps, rawProps)
      const previousValue = ref(props.value)
      const getStyles = useStyles({
        name: 'RollingNumber',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
        vars: props.vars as any,
        varsResolver,
      })

      watch(
        () => props.value,
        (_, oldValue) => {
          previousValue.value = oldValue
        },
        { flush: 'post' },
      )

      return () => {
        const valueDirection = props.value >= previousValue.value ? 'up' : 'down'
        const current = getDigitParts({
          value: props.value,
          decimalScale: props.decimalScale,
          fixedDecimalScale: props.fixedDecimalScale,
        })
        const previous = getDigitParts({
          value: previousValue.value,
          decimalScale: props.decimalScale,
          fixedDecimalScale: props.fixedDecimalScale,
        })
        const slots = getRenderSlots({
          current,
          previous,
          prefix: props.prefix,
          suffix: props.suffix,
          decimalSeparator: props.decimalSeparator,
          thousandSeparator: props.thousandSeparator,
        })
        const accessibleValue = buildValue({
          value: props.value,
          prefix: props.prefix,
          suffix: props.suffix,
          decimalSeparator: props.decimalSeparator,
          thousandSeparator: props.thousandSeparator,
          decimalScale: props.decimalScale,
          fixedDecimalScale: props.fixedDecimalScale,
        })

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            mod: [{ tabularNumbers: props.tabularNumbers }, props.mod],
            role: props.withLiveRegion ? 'status' : 'img',
            'aria-label': accessibleValue,
          },
          () =>
            slots.map((slot) =>
              slot.type === 'digit'
                ? h(DigitColumn, {
                    key: slot.key,
                    digit: slot.digit,
                    previousDigit: slot.previousDigit,
                    getStyles,
                    empty: slot.empty,
                    valueDirection,
                  })
                : h(
                    'span',
                    {
                      key: slot.key,
                      ...getStyles('char'),
                      'data-empty': slot.empty || undefined,
                      'aria-hidden': 'true',
                    },
                    slot.char,
                  ),
            ),
        )
      }
    },
  }),
)

Object.assign(RollingNumber, { classes, varsResolver })
