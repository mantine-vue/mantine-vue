import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppEmoji, WhatsAppEmojiFilterOptions, WhatsAppEmojiGroupId } from '../../emoji'
import type { WhatsAppInboxLabelsOverride } from '../../labels'

export type WhatsAppEmojiPickerStylesNames =
  | 'emojiPickerRoot'
  | 'emojiPickerSearch'
  | 'emojiPickerTabs'
  | 'emojiPickerTab'
  | 'emojiPickerBody'
  | 'emojiPickerGroup'
  | 'emojiPickerGroupLabel'
  | 'emojiPickerGrid'
  | 'emojiPickerItem'
  | 'emojiPickerEmpty'
  | 'emojiPickerPreview'
  | 'emojiPickerPreviewEmoji'
  | 'emojiPickerPreviewName'

export interface WhatsAppEmojiPickerSlots {
  /** Replaces the empty state shown when a search matches nothing. */
  emptyEmojis?: (props: { search: string }) => VNodeChild

  /** Rendered under the grid, in place of the hovered-emoji preview. */
  emojiPickerFooter?: (props: { emoji: WhatsAppEmoji | null }) => VNodeChild
}

/**
 * Props declared by `WhatsAppEmojiPicker` itself.
 *
 * The filter options are spread onto the props rather than nested, so a template can set
 * `:exclude-groups="['flags']"` without building an object.
 */
export interface WhatsAppEmojiPickerOwnProps
  extends StylesApiProps<WhatsAppEmojiPickerFactory>, WhatsAppEmojiFilterOptions {
  /** Controlled search query. */
  search?: string

  /** Uncontrolled initial search query. */
  defaultSearch?: string

  /**
   * Recently used characters, most recent first. Bind it to persist them; leave it alone and the
   * picker keeps its own list for the lifetime of the component.
   */
  recentEmojis?: string[]

  /** Uncontrolled initial recently-used characters. */
  defaultRecentEmojis?: string[]

  /**
   * Largest number of recently-used emoji kept.
   * @default 24
   */
  recentLimit?: number

  /**
   * Renders the recently-used category.
   * @default true
   */
  withRecent?: boolean

  /**
   * Renders the search field.
   * @default true
   */
  withSearch?: boolean

  /**
   * Renders the category tab strip.
   * @default true
   */
  withTabs?: boolean

  /**
   * Renders the preview of the hovered or focused emoji under the grid.
   * @default true
   */
  withPreview?: boolean

  /**
   * Number of emoji per row. Also the step the up and down arrow keys move by.
   * @default 8
   */
  columns?: number

  /** Height of the scrollable grid, any valid CSS length. */
  height?: string | number

  /** Width of the picker, any valid CSS length. */
  width?: string | number

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppEmojiPickerProps
  extends Omit<BoxProps, keyof WhatsAppEmojiPickerOwnProps>, WhatsAppEmojiPickerOwnProps {}

export interface WhatsAppEmojiPickerEmits {
  /** Emitted when an emoji is picked. */
  select: [emoji: WhatsAppEmoji]

  /** Emitted when the search query changes. */
  'update:search': [search: string]

  /** Emitted with the new recently-used list after a pick. */
  'update:recentEmojis': [recentEmojis: string[]]

  /** Emitted when the visible category changes, by tab or by scrolling. */
  groupChange: [group: WhatsAppEmojiGroupId]
}

export type WhatsAppEmojiPickerFactory = Factory<{
  props: Omit<WhatsAppEmojiPickerProps, 'rootRef'>
  slots: WhatsAppEmojiPickerSlots
  emits: WhatsAppEmojiPickerEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppEmojiPickerStylesNames
}>
