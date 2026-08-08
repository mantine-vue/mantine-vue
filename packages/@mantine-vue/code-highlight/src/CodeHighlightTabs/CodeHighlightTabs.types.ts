import type { VNodeChild } from 'vue'
import type {
  CodeHighlightExpandEmits,
  CodeHighlightSettings,
  CodeHighlightStylesNames,
} from '../CodeHighlight/CodeHighlight.types'

/** Available shiki languages for default Mantine shiki instance. Should be used only with *.mantine.dev projects. */
export type CodeHighlightDefaultLanguage = 'tsx' | 'scss' | 'html' | 'bash' | 'json'
export interface CodeHighlightTabsCode {
  language?: CodeHighlightDefaultLanguage | (string & {})
  code: string
  fileName?: string
  icon?: VNodeChild
}
export type CodeHighlightTabsStylesNames =
  | 'root'
  | 'files'
  | 'file'
  | 'fileIcon'
  | 'filesScrollarea'
  | CodeHighlightStylesNames
export interface CodeHighlightTabsProps extends CodeHighlightSettings {
  /** Code to highlight with meta data (file name and icon). */
  code: CodeHighlightTabsCode[]
  /** Function that returns icon based on file name. */
  getFileIcon?: (fileName: string) => VNodeChild
  /** Default active tab index. */
  defaultActiveTab?: number
  /** Index of controlled active tab state. */
  activeTab?: number
  /** CSS classes applied to component elements. */
  classNames?: any
  /** Inline styles applied to component elements. */
  styles?: any
  /** CSS variables applied to component elements. */
  vars?: any
  /** If set, all Mantine classes are removed from component elements. @default false */
  unstyled?: boolean
  [key: string]: any
}
export interface CodeHighlightTabsFactory {
  props: CodeHighlightTabsProps
  stylesNames: CodeHighlightTabsStylesNames
}
export interface CodeHighlightTabsSlots {
  getFileIcon?: (input: { fileName: string }) => VNodeChild
  controls?: () => VNodeChild
}

/** Events emitted by `CodeHighlightTabs`. */
export interface CodeHighlightTabsEmits extends CodeHighlightExpandEmits {
  /** Emitted when the active tab changes. */
  'update:activeTab': [tab: number]
  /** Emitted when the active tab changes. */
  'tab-change': [tab: number]
}
