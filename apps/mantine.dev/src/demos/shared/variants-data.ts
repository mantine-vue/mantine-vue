import type { ConfiguratorControlOptions } from '@/demo'

export const INTERACTIVE_VARIANTS = [
  'default',
  'filled',
  'light',
  'outline',
  'subtle',
  'transparent',
  'white',
]

export const interactiveVariantsControl: ConfiguratorControlOptions = {
  type: 'select',
  prop: 'variant',
  data: INTERACTIVE_VARIANTS,
  initialValue: 'filled',
  libraryValue: '__none__',
}

export const STATIC_VARIANTS = ['filled', 'light', 'outline', 'transparent', 'white', 'default']

export const staticVariantsControl: ConfiguratorControlOptions = {
  type: 'select',
  prop: 'variant',
  data: STATIC_VARIANTS,
  initialValue: 'filled',
  libraryValue: '__none__',
}

export const gradientControls: ConfiguratorControlOptions[] = [
  { type: 'color', prop: 'gradientFrom', initialValue: 'blue', libraryValue: '__none__' },
  { type: 'color', prop: 'gradientTo', initialValue: 'cyan', libraryValue: '__none__' },
  {
    type: 'number',
    prop: 'gradientDegree',
    initialValue: 90,
    min: 0,
    max: 360,
    libraryValue: '__none__',
  },
]

export const FLOATING_POSITION_DATA = [
  { label: 'top', value: 'top' },
  { label: 'top-start', value: 'top-start' },
  { label: 'top-end', value: 'top-end' },
  { label: 'left', value: 'left' },
  { label: 'left-start', value: 'left-start' },
  { label: 'left-end', value: 'left-end' },
  { label: 'right', value: 'right' },
  { label: 'right-start', value: 'right-start' },
  { label: 'right-end', value: 'right-end' },
  { label: 'bottom', value: 'bottom' },
  { label: 'bottom-start', value: 'bottom-start' },
  { label: 'bottom-end', value: 'bottom-end' },
]
