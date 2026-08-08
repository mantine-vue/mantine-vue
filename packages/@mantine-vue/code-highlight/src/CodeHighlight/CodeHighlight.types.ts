import type { VNodeChild } from 'vue'
import type { CodeHighlightAdapter } from '../CodeHighlightProvider/CodeHighlightProvider'
import type { CodeHighlightContextValue } from './CodeHighlight.context'
import type { CodeHighlightControlProps } from './CodeHighlightControl/CodeHighlightControl.types'

export type CodeHighlightStylesNames =
  | 'codeHighlight'
  | 'pre'
  | 'code'
  | 'control'
  | 'controlTooltip'
  | 'controls'
  | 'scrollarea'
  | 'showCodeButton'
  | 'lineNumbers'
  | 'codeWrapper'

export type CodeHighlightCssVariables = {
  codeHighlight: '--ch-max-height' | '--ch-background' | '--ch-radius'
}

export interface CodeHighlightSettings {
  /** Label for copy button in default state. @default 'Copy' */
  copyLabel?: string
  /** Label for copy button in copied state. @default 'Copied' */
  copiedLabel?: string
  /** Uncontrolled expanded default state. */
  defaultExpanded?: boolean
  /** Controlled expanded state. */
  expanded?: boolean
  /** Max height of collapsed state. @default 180px */
  maxCollapsedHeight?: number | string
  /** Determines whether the copy button should be displayed. @default true */
  withCopyButton?: boolean
  /** Determines whether the expand/collapse button should be displayed. @default false */
  withExpandButton?: boolean
  /** Label for expand button. @default 'Expand code' */
  expandCodeLabel?: string
  /** Label for collapse button. @default 'Collapse code' */
  collapseCodeLabel?: string
  /** Controls background color of the code. By default, the value depends on color scheme. */
  background?: string
  /** Key of `theme.radius` or any valid CSS value to set border-radius. @default 0 */
  radius?: string | number
  /** Adds border to the root element. @default false */
  withBorder?: boolean
  /** Determines whether line numbers should be displayed. @default false */
  withLineNumbers?: boolean
  /** Extra controls to display in the controls list. */
  controls?: VNodeChild[] | (() => VNodeChild)
  /** Set to use dark or light color scheme. When using shiki adapter, you can use loaded themes here. */
  codeColorScheme?: 'dark' | 'light' | (string & {})
}

export interface CodeHighlightProps extends CodeHighlightSettings {
  __withOffset?: boolean
  __staticSelector?: string
  /** If set, the code will be rendered as inline element without `<pre>`. @default false */
  __inline?: boolean
  /** Code to highlight. */
  code: string
  /** Language of the code, used for syntax highlighting. */
  language?: string
  /** CSS classes applied to component elements. */
  classNames?: any
  /** Inline styles applied to component elements. */
  styles?: any
  /** CSS variables applied to component elements. */
  vars?: any
  /** If set, all Mantine classes are removed from component elements. @default false */
  unstyled?: boolean
  class?: any
  style?: any
  [key: string]: any
}

export interface CodeHighlightFactory {
  props: CodeHighlightProps
  stylesNames: CodeHighlightStylesNames
  vars: CodeHighlightCssVariables
}

/** Events emitted when the expanded state changes. */
export interface CodeHighlightExpandEmits {
  /** Emitted when the expanded state changes. */
  'update:expanded': [expanded: boolean]
  /** Emitted when the expanded state changes. */
  'expanded-change': [expanded: boolean]
}

/** Events emitted by `CodeHighlight`. */
export type CodeHighlightEmits = CodeHighlightExpandEmits

export interface CodeHighlightSlots {
  /** Custom controls rendered before built-in controls. */
  controls?: () => VNodeChild
}

export type { CodeHighlightAdapter, CodeHighlightContextValue, CodeHighlightControlProps }
