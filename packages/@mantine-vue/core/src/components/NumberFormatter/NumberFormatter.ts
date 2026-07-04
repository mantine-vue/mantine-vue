import { defineComponent, h, type PropType } from 'vue'

export type ThousandsGroupStyle = 'thousand' | 'lakh' | 'wan' | 'none'

export interface NumberFormatterOptions {
  allowNegative?: boolean
  decimalScale?: number
  decimalSeparator?: string
  fixedDecimalScale?: boolean
  prefix?: string
  suffix?: string
  thousandsGroupStyle?: ThousandsGroupStyle
  thousandSeparator?: string | boolean
}

function getGroupSizes(style: ThousandsGroupStyle | undefined) {
  if (style === 'lakh') {
    return [3, 2]
  }

  if (style === 'wan') {
    return [4, 4]
  }

  return [3, 3]
}

function groupInteger(value: string, separator: string, style?: ThousandsGroupStyle) {
  if (!separator || style === 'none') {
    return value
  }

  const [firstSize, nextSize] = getGroupSizes(style)
  const parts: string[] = []
  let remaining = value

  if (remaining.length > firstSize) {
    parts.unshift(remaining.slice(-firstSize))
    remaining = remaining.slice(0, -firstSize)

    while (remaining.length > nextSize) {
      parts.unshift(remaining.slice(-nextSize))
      remaining = remaining.slice(0, -nextSize)
    }
  }

  if (remaining) {
    parts.unshift(remaining)
  }

  return parts.join(separator)
}

export function formatNumber(
  value: number | string | bigint,
  options: NumberFormatterOptions = {},
) {
  const decimalSeparator = options.decimalSeparator || '.'
  const thousandSeparator =
    options.thousandSeparator === true ? ',' : options.thousandSeparator || ''
  const stringValue = String(value)
  const negative = stringValue.startsWith('-')
  const unsigned = negative ? stringValue.slice(1) : stringValue

  if (negative && options.allowNegative === false) {
    return ''
  }

  const hasTrailingDecimalSeparator = unsigned.endsWith('.')
  const [integerPart, decimalPart = ''] = unsigned.split('.')
  let decimals = decimalPart

  if (typeof options.decimalScale === 'number') {
    decimals = decimals.slice(0, options.decimalScale)

    if (options.fixedDecimalScale) {
      decimals = decimals.padEnd(options.decimalScale, '0')
    }
  }

  const grouped = groupInteger(
    integerPart || '0',
    String(thousandSeparator),
    options.thousandsGroupStyle,
  )
  const decimalValue =
    decimals || hasTrailingDecimalSeparator ? `${decimalSeparator}${decimals}` : ''
  const formatted = `${negative ? '-' : ''}${grouped}${decimalValue}`

  return `${options.prefix || ''}${formatted}${options.suffix || ''}`
}

export const NumberFormatter = defineComponent({
  name: 'NumberFormatter',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, BigInt] as PropType<string | number | bigint | undefined>,
      default: undefined,
    },
    allowNegative: { type: Boolean, default: true },
    decimalScale: { type: Number, default: undefined },
    decimalSeparator: { type: String, default: '.' },
    fixedDecimalScale: { type: Boolean, default: false },
    prefix: { type: String, default: undefined },
    suffix: { type: String, default: undefined },
    thousandsGroupStyle: { type: String as PropType<ThousandsGroupStyle>, default: 'thousand' },
    thousandSeparator: {
      type: [String, Boolean] as PropType<string | boolean>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    return () =>
      props.value === undefined
        ? null
        : h(
            'span',
            attrs,
            formatNumber(props.value, {
              allowNegative: props.allowNegative,
              decimalScale: props.decimalScale,
              decimalSeparator: props.decimalSeparator,
              fixedDecimalScale: props.fixedDecimalScale,
              prefix: props.prefix,
              suffix: props.suffix,
              thousandsGroupStyle: props.thousandsGroupStyle,
              thousandSeparator: props.thousandSeparator,
            }),
          )
  },
})

Object.assign(NumberFormatter, { displayName: '@mantine/core/NumberFormatter' })
