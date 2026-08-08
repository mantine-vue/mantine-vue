import type { VNodeChild } from 'vue'
import type { SpotlightStore } from '../../spotlight.store'

export type SpotlightRootStylesNames =
  | 'root'
  | 'body'
  | 'close'
  | 'content'
  | 'header'
  | 'inner'
  | 'overlay'
  | 'title'
  | 'search'
  | 'actionsList'
  | 'actionsListInner'
  | 'action'
  | 'empty'
  | 'footer'
  | 'actionBody'
  | 'actionLabel'
  | 'actionDescription'
  | 'actionSection'
  | 'actionsGroup'

export interface SpotlightRootSlots {
  default?: () => VNodeChild
}

/** Props accepted by `SpotlightRoot`. */
export interface SpotlightRootProps {
  /** Spotlight store, can be used to create multiple instances of spotlight. */
  store?: SpotlightStore
  /** Controlled Spotlight search query. */
  query?: string
  /** Determines whether the search query should be cleared when the spotlight is closed. @default true */
  clearQueryOnClose?: boolean
  /** Keyboard shortcut or a list of shortcuts to trigger spotlight. @default 'mod + K' */
  shortcut?: string | string[] | null
  /** A list of tags which when focused will be ignored by shortcut. @default ['input', 'textarea', 'select'] */
  tagsToIgnore?: string[]
  /** Determines whether shortcut should trigger based in contentEditable. @default false */
  triggerOnContentEditable?: boolean
  /** If set, spotlight will not be rendered. */
  disabled?: boolean
  /** Forces opened state, useful for tests. */
  forceOpened?: boolean
  /** Determines whether spotlight should be closed when one of the actions is triggered. @default true */
  closeOnActionTrigger?: boolean
  /** Spotlight content max-height. Ignored unless `scrollable` prop is set. @default 400 */
  maxHeight?: string | number
  /** Determines whether the actions list should be scrollable. If not set, `maxHeight` is ignored. @default false */
  scrollable?: boolean
  /** CSS classes applied to component elements. */
  classNames?: Record<string, any>
  /** Inline styles applied to component elements. */
  styles?: Record<string, any>
  /** CSS variables applied to component elements. */
  vars?: Record<string, any>
  /** If set, all Mantine classes are removed from component elements. @default false */
  unstyled?: boolean
  [key: string]: any
}

/** Events emitted by `SpotlightRoot`. */
export interface SpotlightRootEmits {
  /** Emitted when the search query changes. */
  'update:query': [query: string]
  /** Emitted when the search query changes. */
  'query-change': [query: string]
  /** Emitted when spotlight opens. */
  'spotlight-open': []
  /** Emitted when spotlight closes. */
  'spotlight-close': []
  /** Emitted when the spotlight exit transition finishes. */
  'exit-transition-end': []
}
