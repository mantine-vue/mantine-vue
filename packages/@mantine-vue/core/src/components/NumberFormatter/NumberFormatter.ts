import NumberFormatterComponent from './NumberFormatter.vue'

export const NumberFormatter = Object.assign(NumberFormatterComponent, {
  displayName: '@mantine/core/NumberFormatter',
})

export { formatNumber } from './format-number'
export type {
  NumberFormatterOptions,
  NumberFormatterOwnProps,
  NumberFormatterProps,
  ThousandsGroupStyle,
} from './NumberFormatter.types'
