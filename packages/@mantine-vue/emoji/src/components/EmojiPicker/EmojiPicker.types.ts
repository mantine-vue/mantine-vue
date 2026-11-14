import type { BoxProps, Factory, MantineSize } from '@mantine-vue/core'
import type { EmojiPickerData, EmojiPickerEmoji, EmojiPickerLabels } from '../../types'

export type EmojiPickerStylesNames =
  | 'root'
  | 'search'
  | 'searchInput'
  | 'categoryNav'
  | 'categoryNavButton'
  | 'content'
  | 'empty'
  | 'categoryLabel'
  | 'grid'
  | 'emoji'
  | 'preview'
  | 'previewEmoji'
  | 'previewName'
  | 'skinToneSelector'
  | 'skinToneDropdown'
  | 'skinToneButton'

export type EmojiPickerCssVariables = {
  root:
    | '--ep-columns'
    | '--ep-emoji-size'
    | '--ep-emoji-fz'
    | '--ep-preview-py'
    | '--ep-skin-tone-size'
    | '--ep-skin-tone-fz'
}

export interface EmojiPickerOwnProps {
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  /** Emoji data object, use `emojiMartAdapter` or `emojibaseAdapter` to convert data */
  data: EmojiPickerData
  /** Number of emoji columns @default 9 */
  columns?: number
  /** Custom emoji button size in px, overrides size-based value */
  emojiSize?: number
  /** Determines whether the search input is displayed @default true */
  withSearch?: boolean
  /** Determines whether the category navigation bar is displayed @default true */
  withCategoryNav?: boolean
  /** Determines whether the emoji preview area is displayed @default true */
  withPreview?: boolean
  /** Determines whether the skin tone selector is displayed @default true */
  withSkinToneSelector?: boolean
  /** Controlled skin tone value (0–5), supports `v-model:skin-tone` */
  skinTone?: number
  /** Default skin tone value for uncontrolled state @default 0 */
  defaultSkinTone?: number
  /** Controlled search input value, supports `v-model:search-value` */
  searchValue?: string
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Content displayed when search yields no results, the `empty` slot can be used instead */
  emptySearchContent?: any
  /** Determines whether unsupported emojis are filtered out @default false */
  withUnsupportedDetection?: boolean
  /** Determines whether the search input is focused on mount @default false */
  autoFocus?: boolean
  /** Props passed to the internal `ScrollArea` component */
  scrollAreaProps?: Record<string, any>
  /** Override category labels by category id */
  categoryLabels?: Record<string, string>
  /** Override UI labels (search placeholder, no results text, etc.) */
  labels?: EmojiPickerLabels
  /** Controls size of all inner elements @default 'sm' */
  size?: MantineSize
  /** Props passed to the search `Input` component */
  searchInputProps?: Record<string, any>
}

export type EmojiPickerProps = Omit<BoxProps, keyof EmojiPickerOwnProps> & EmojiPickerOwnProps

export interface EmojiPickerEmits {
  /** Emitted when an emoji is selected */
  emojiSelect: [emoji: EmojiPickerEmoji]
  'update:skinTone': [skinTone: number]
  /** Emitted when skin tone changes */
  skinToneChange: [skinTone: number]
  'update:searchValue': [value: string]
  /** Emitted when search value changes */
  searchChange: [value: string]
}

export interface EmojiPickerSlots {
  /** Content displayed when search yields no results */
  empty?: () => any
}

export type EmojiPickerFactory = Factory<{
  props: EmojiPickerProps
  emits: EmojiPickerEmits
  slots: EmojiPickerSlots
  ref: HTMLDivElement
  stylesNames: EmojiPickerStylesNames
  vars: EmojiPickerCssVariables
}>
