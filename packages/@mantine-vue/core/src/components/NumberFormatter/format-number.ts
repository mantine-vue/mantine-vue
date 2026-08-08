import type { NumberFormatterOptions, ThousandsGroupStyle } from './NumberFormatter.types'

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
