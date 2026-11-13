import type { BoxProps, Factory, MantineColor } from '@mantine-vue/core'

export type DiffStylesNames =
  | 'root'
  | 'table'
  | 'row'
  | 'lineNumber'
  | 'content'
  | 'addedLine'
  | 'removedLine'
  | 'unchangedLine'
  | 'addedHighlight'
  | 'removedHighlight'
  | 'expandControl'
  | 'splitDivider'
  | 'changeMarker'

export type DiffCssVariables = {
  root:
    | '--diff-add-color'
    | '--diff-remove-color'
    | '--diff-add-highlight-color'
    | '--diff-remove-highlight-color'
}

export interface DiffOwnProps {
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  /** The original text */
  previousValue: string
  /** The modified text */
  currentValue: string
  /** Display mode @default 'unified' */
  mode?: 'unified' | 'split'
  /** Diff granularity for inline highlights @default 'words' */
  diffMethod?: 'chars' | 'words' | 'lines'
  /** Number of unchanged lines shown around changes @default Infinity */
  contextLines?: number
  /** Determines whether to show line number gutters @default true */
  withLineNumbers?: boolean
  /** Key of `theme.colors` or any valid CSS color for added content @default 'teal' */
  addColor?: MantineColor
  /** Key of `theme.colors` or any valid CSS color for removed content @default 'red' */
  removeColor?: MantineColor
  /** Function to generate expand button label @default (hiddenCount) => `Show ${hiddenCount} hidden lines` (`line` when `hiddenCount` is 1) */
  expandLabel?: (hiddenCount: number) => string
}

export type DiffProps = Omit<BoxProps, keyof DiffOwnProps> & DiffOwnProps

export type DiffFactory = Factory<{
  props: DiffProps
  ref: HTMLDivElement
  stylesNames: DiffStylesNames
  vars: DiffCssVariables
}>
