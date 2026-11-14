export type {
  EmojiPickerData,
  EmojiPickerEmoji,
  EmojiPickerCategory,
  EmojiPickerLabels,
  FlattenedRowItem,
} from './types'

export { DEFAULT_LABELS } from './types'
export { CANONICAL_CATEGORY_IDS } from './categories'

export { searchEmojis, flattenEmojiData } from './utils'
export { isEmojiSupported, filterSupportedEmojis } from './utils'

export { emojiMartAdapter } from './adapters'
export { emojibaseAdapter } from './adapters'

export { useEmojiSearch } from './composables/use-emoji-search'
export { useEmojiGridNavigation } from './composables/use-emoji-grid-navigation'

export * from './components/EmojiPicker'
export * from './components/EmojiPickerPopover'
export * from './components/EmojiPickerInput'
