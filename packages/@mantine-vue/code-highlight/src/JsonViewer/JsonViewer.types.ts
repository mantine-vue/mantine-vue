import type {
  BoxProps,
  Factory,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '@mantine-vue/core'
export type JsonViewerStylesNames =
  | 'root'
  | 'node'
  | 'toggle'
  | 'key'
  | 'value'
  | 'bracket'
  | 'type'
  | 'size'
  | 'ellipsis'
  | 'copyButton'
  | 'content'
  | 'row'
  | 'scrollarea'
  | 'lineNumbers'
  | 'wrapper'
  | 'copyAllButton'
  | 'controls'
  | 'control'
export type JsonViewerCssVariables = { root: '--jv-radius' | '--jv-fz' | '--jv-indent' }
export type JsonViewerHighlightType = 'added' | 'removed'
export interface JsonViewerOwnProps {
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  value: any
  rootName?: string | false
  defaultExpandDepth?: number
  expandedPaths?: string[]
  maxDisplayLength?: number
  withTypes?: boolean
  withSize?: boolean
  withCopy?: boolean
  withCopyButton?: boolean
  withQuotes?: boolean
  withKeyQuotes?: boolean
  collapseStringsAfterLength?: number | false
  sortKeys?: boolean | ((a: string, b: string) => number)
  groupArraysAfterLength?: number | false
  radius?: MantineRadius
  fontSize?: MantineSize | (string & {}) | number
  indentWidth?: number
  withBorder?: boolean
  copyLabel?: string
  copiedLabel?: string
  expandAllLabel?: string
  collapseAllLabel?: string
  withControls?: boolean
  highlightItems?: Record<string, JsonViewerHighlightType>
  allExpanded?: boolean
  withLineNumbers?: boolean
  withChevrons?: boolean
}
export type JsonViewerProps = Omit<BoxProps, keyof JsonViewerOwnProps> &
  JsonViewerOwnProps &
  StylesApiProps<any>
export interface JsonViewerEmits {
  'update:expandedPaths': [paths: string[]]
  expandedPathsChange: [paths: string[]]
  valueSelect: [path: string[], value: any]
}
export type JsonViewerFactory = Factory<{
  props: JsonViewerProps
  emits: JsonViewerEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: JsonViewerStylesNames
  vars: JsonViewerCssVariables
}>
