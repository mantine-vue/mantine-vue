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
  /** JSON data to display */
  value: any
  /** Label displayed for the root node @default false */
  rootName?: string | false
  /** Number of levels to expand by default. Applied only to the `value` present on mount; pass a `key` or use controlled `expandedPaths` to re-apply it after `value` changes. @default 1 */
  defaultExpandDepth?: number
  /** Controlled expanded paths */
  expandedPaths?: string[]
  /** Max number of items to show before truncation @default 100 */
  maxDisplayLength?: number
  /** Whether to show type badges next to values @default false */
  withTypes?: boolean
  /** Whether to show item count for objects/arrays @default false */
  withSize?: boolean
  /** Whether to show copy button on hover for individual nodes @default false */
  withCopy?: boolean
  /** Whether to show a copy button to copy the entire JSON @default false */
  withCopyButton?: boolean
  /** Whether to show quotes around string values @default true */
  withQuotes?: boolean
  /** Whether to show quotes around keys @default false */
  withKeyQuotes?: boolean
  /** Collapse strings longer than this value @default false */
  collapseStringsAfterLength?: number | false
  /** Sort object keys @default false */
  sortKeys?: boolean | ((a: string, b: string) => number)
  /** Group arrays into chunks when array length exceeds this value @default false */
  groupArraysAfterLength?: number | false
  /** Key of `theme.radius` or any valid CSS value to set border-radius @default 'sm' */
  radius?: MantineRadius
  /** Font size @default '13px' */
  fontSize?: MantineSize | (string & {}) | number
  /** Indent width in px @default 16 */
  indentWidth?: number
  /** Adds border to the root element @default false */
  withBorder?: boolean
  /** Label for copy button @default 'Copy' */
  copyLabel?: string
  /** Label for copied state @default 'Copied' */
  copiedLabel?: string
  /** Label for expand all button @default 'Expand all' */
  expandAllLabel?: string
  /** Label for collapse all button @default 'Collapse all' */
  collapseAllLabel?: string
  /** Whether to show expand all / collapse all controls @default false */
  withControls?: boolean
  /** Map of JSON paths to highlight type ('added' or 'removed'), use serializeJsonViewerPath to build keys */
  highlightItems?: Record<string, JsonViewerHighlightType>
  /** When true, all nodes are expanded and expand/collapse is disabled @default false */
  allExpanded?: boolean
  /** Whether to show line numbers @default false */
  withLineNumbers?: boolean
  /** Whether to show expand/collapse chevrons @default false */
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
