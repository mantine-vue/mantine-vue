import { defineComponent, h, ref, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSize,
  getThemeColor,
  type MantineNode,
  useDirection,
  useProps,
  useStyles,
} from '../../core'
import { provideRatingContext } from './Rating.context'
import { RatingItem } from './RatingItem/RatingItem'
import classes from './Rating.module.css'

export type RatingStylesNames =
  | 'root'
  | 'starSymbol'
  | 'input'
  | 'label'
  | 'symbolBody'
  | 'symbolGroup'

export interface RatingSlots {
  emptySymbol?: (props: { value: number }) => VNodeChild
  fullSymbol?: (props: { value: number }) => VNodeChild
}

function roundValueTo(value: number, to: number) {
  const rounded = Math.round(value / to) * to
  const precision = `${to}`.split('.')[1]?.length || 0
  return Number(rounded.toFixed(precision))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const defaultProps = {
  size: 'sm',
  getSymbolLabel: (value: number) => `${value}`,
  count: 5,
  fractions: 1,
  color: 'yellow',
} as const

const varsResolver = createVarsResolver<any>((theme, { size, color }) => ({
  root: {
    '--rating-size': getSize(size, 'rating-size'),
    '--rating-color': getThemeColor(color, theme),
  },
}))

export const Rating = withBoxProps(
  defineComponent({
    name: 'Rating',
    inheritAttrs: false,
    slots: Object as SlotsType<RatingSlots>,
    props: {
      defaultValue: { type: Number, default: undefined },
      value: { type: Number, default: undefined },
      onChange: { type: Function as PropType<(value: number) => void>, default: undefined },
      emptySymbol: {
        type: null as unknown as PropType<MantineNode | ((value: number) => VNodeChild)>,
        default: undefined,
      },
      fullSymbol: {
        type: null as unknown as PropType<MantineNode | ((value: number) => VNodeChild)>,
        default: undefined,
      },
      fractions: { type: Number, default: undefined },
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      count: { type: Number, default: undefined },
      onHover: { type: Function as PropType<(value: number) => void>, default: undefined },
      getSymbolLabel: { type: Function as PropType<(value: number) => string>, default: undefined },
      name: { type: String, default: undefined },
      id: { type: String, default: undefined },
      readOnly: { type: Boolean, default: false },
      allowClear: { type: Boolean, default: false },
      highlightSelectedOnly: { type: Boolean, default: false },
      color: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Rating', defaultProps, rawProps)
      const rootRef = ref<HTMLDivElement | null>(null)
      const hovered = ref(-1)
      const isOutside = ref(true)
      const { dir } = useDirection()
      const name = useId(props.name)
      const id = useId(props.id)
      const [currentValue, setCurrentValue] = useUncontrolled<number>({
        value: () => props.value,
        defaultValue: props.defaultValue,
        finalValue: 0,
        onChange: (value) => props.onChange?.(value),
      })
      const getStyles = useStyles({
        name: 'Rating',
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

      provideRatingContext({ getStyles })

      const getRatingFromCoordinates = (x: number, count: number, decimalUnit: number) => {
        if (!rootRef.value) {
          return 0
        }

        const { left, right, width } = rootRef.value.getBoundingClientRect()
        const symbolWidth = width / count
        const hoverPosition = dir.value === 'rtl' ? right - x : x - left
        const hoverValue = hoverPosition / symbolWidth

        return clamp(roundValueTo(hoverValue + decimalUnit / 2, decimalUnit), decimalUnit, count)
      }

      return () => {
        const emptySymbol =
          props.emptySymbol ??
          (slots.emptySymbol ? (value: number) => slots.emptySymbol!({ value }) : undefined)
        const fullSymbol =
          props.fullSymbol ??
          (slots.fullSymbol ? (value: number) => slots.fullSymbol!({ value }) : undefined)
        const count = Math.max(0, Math.floor(props.count ?? defaultProps.count))
        const fractions = Math.floor(props.fractions ?? defaultProps.fractions)

        if (fractions < 0) {
          throw new Error('Rating fractions cannot be negative')
        }

        const decimalUnit = 1 / Math.max(fractions, 1)
        const stableValueRounded = roundValueTo(currentValue.value, decimalUnit)
        const finalValue = hovered.value !== -1 ? hovered.value : stableValueRounded
        const items = Array.from({ length: count }, (_, index) => {
          const integerValue = index + 1
          const fractionItems = Array.from({ length: index === 0 ? fractions + 1 : fractions })
          const isGroupActive = !props.readOnly && Math.ceil(hovered.value) === integerValue

          return h(
            'div',
            {
              key: integerValue,
              'data-active': isGroupActive ? true : undefined,
              ...getStyles('symbolGroup'),
            },
            fractionItems.map((_, fractionIndex) => {
              const fractionValue = decimalUnit * (index === 0 ? fractionIndex : fractionIndex + 1)
              const symbolValue = roundValueTo(integerValue - 1 + fractionValue, decimalUnit)

              return h(RatingItem, {
                key: `${integerValue}-${symbolValue}`,
                getSymbolLabel: props.getSymbolLabel,
                emptyIcon: emptySymbol,
                fullIcon: fullSymbol,
                full: props.highlightSelectedOnly
                  ? symbolValue === finalValue
                  : symbolValue <= finalValue,
                active: symbolValue === finalValue,
                checked: symbolValue === stableValueRounded,
                readOnly: props.readOnly,
                fractionValue,
                value: symbolValue,
                name: name.value,
                id: `${id.value}-${index}-${fractionIndex}`,
                onItemBlur: () => {
                  if (isOutside.value) {
                    hovered.value = -1
                  }
                },
                onInputChange: (value: number) => {
                  if (!props.readOnly) {
                    hovered.value = value
                  }
                },
                onChangeValue: (value: number) => {
                  if (!props.readOnly) {
                    setCurrentValue(props.allowClear && value === stableValueRounded ? 0 : value)
                  }
                },
              })
            }),
          )
        })

        return h(
          Box,
          {
            ...attrs,
            id: id.value,
            ref: (node: any) => {
              rootRef.value = node?.$el ?? node ?? null
            },
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            onMouseenter: () => {
              if (!props.readOnly) {
                isOutside.value = false
              }
            },
            onMousemove: (event: MouseEvent) => {
              if (props.readOnly) {
                return
              }

              const rounded = getRatingFromCoordinates(event.clientX, count, decimalUnit)
              if (rounded !== hovered.value) {
                hovered.value = rounded
                props.onHover?.(rounded)
              }
            },
            onMouseleave: () => {
              if (!props.readOnly) {
                const previous = hovered.value
                hovered.value = -1
                isOutside.value = true
                if (previous !== -1) {
                  props.onHover?.(-1)
                }
              }
            },
            onTouchstart: (event: TouchEvent) => {
              if (!props.readOnly && event.touches.length === 1) {
                setCurrentValue(
                  getRatingFromCoordinates(event.touches[0].clientX, count, decimalUnit),
                )
              }
            },
            onTouchend: (event: TouchEvent) => event.preventDefault(),
          },
          () => items,
        )
      }
    },
  }),
)

Object.assign(Rating, { classes, varsResolver })
