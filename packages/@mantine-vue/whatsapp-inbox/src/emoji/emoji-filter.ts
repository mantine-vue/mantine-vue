import type { WhatsAppInboxLabels } from '../labels'
import {
  WHATSAPP_EMOJI_GROUP_ORDER,
  WHATSAPP_EMOJIS,
  type WhatsAppEmoji,
  type WhatsAppEmojiGroupId,
} from './emoji-data'

/** Tab metadata for one emoji category. */
export interface WhatsAppEmojiGroup {
  id: WhatsAppEmojiGroupId

  /** Glyph shown in the tab strip. */
  icon: string

  /** Key of the label that names the group. */
  labelKey: keyof WhatsAppInboxLabels
}

/** Every category the picker can show, in tab order. `recent` comes first when it has entries. */
export const WHATSAPP_EMOJI_GROUPS: readonly WhatsAppEmojiGroup[] = [
  { id: 'recent', icon: '🕘', labelKey: 'emojiGroupRecent' },
  { id: 'smileys', icon: '😀', labelKey: 'emojiGroupSmileys' },
  { id: 'people', icon: '👋', labelKey: 'emojiGroupPeople' },
  { id: 'animals', icon: '🐶', labelKey: 'emojiGroupAnimals' },
  { id: 'food', icon: '🍔', labelKey: 'emojiGroupFood' },
  { id: 'activity', icon: '⚽', labelKey: 'emojiGroupActivity' },
  { id: 'travel', icon: '🚗', labelKey: 'emojiGroupTravel' },
  { id: 'objects', icon: '💡', labelKey: 'emojiGroupObjects' },
  { id: 'symbols', icon: '❤️', labelKey: 'emojiGroupSymbols' },
  { id: 'flags', icon: '🏁', labelKey: 'emojiGroupFlags' },
]

/**
 * Which emoji the picker offers.
 *
 * Allow-lists win over block-lists, and `filter` has the final say, so a policy can be expressed
 * either way round: start from everything and remove, or start from nothing and add.
 */
export interface WhatsAppEmojiFilterOptions {
  /** Only these categories are shown, in the order given. */
  groups?: WhatsAppEmojiGroupId[]

  /** These categories are removed. Ignored for a category listed in `groups`. */
  excludeGroups?: WhatsAppEmojiGroupId[]

  /** Allow-list of characters. When set, nothing outside it is shown. */
  emojis?: string[]

  /** Block-list of characters. */
  excludeEmojis?: string[]

  /** Final say. Return `false` to drop an entry that passed everything above. */
  filter?: (emoji: WhatsAppEmoji) => boolean

  /** Replaces the built-in dataset, for a fuller catalogue or localized names. */
  emojiData?: WhatsAppEmoji[]
}

/** Applies the configured allow-lists, block-lists and predicate to the dataset. */
export function filterEmojis(options: WhatsAppEmojiFilterOptions = {}): WhatsAppEmoji[] {
  const source = options.emojiData ?? WHATSAPP_EMOJIS
  const allowedGroups = options.groups && options.groups.length > 0 ? new Set(options.groups) : null
  const blockedGroups = new Set(options.excludeGroups ?? [])
  const allowedEmojis = options.emojis && options.emojis.length > 0 ? new Set(options.emojis) : null
  const blockedEmojis = new Set(options.excludeEmojis ?? [])

  return source.filter((entry) => {
    if (allowedGroups ? !allowedGroups.has(entry.group) : blockedGroups.has(entry.group)) {
      return false
    }

    if (allowedEmojis ? !allowedEmojis.has(entry.emoji) : blockedEmojis.has(entry.emoji)) {
      return false
    }

    return options.filter ? options.filter(entry) : true
  })
}

/**
 * Categories present in a filtered set, in the order `groups` asked for, or the default order.
 *
 * Derived from the entries rather than the options so a category that filtered down to nothing
 * never shows an empty tab.
 */
export function getEmojiGroups(
  emojis: WhatsAppEmoji[],
  order?: WhatsAppEmojiGroupId[],
): WhatsAppEmojiGroupId[] {
  const present = new Set(emojis.map((entry) => entry.group))
  const sequence = order && order.length > 0 ? order : WHATSAPP_EMOJI_GROUP_ORDER

  return sequence.filter((group) => present.has(group))
}

/**
 * Matches a query against names and keywords.
 *
 * Whole-word prefix matching rather than a substring scan: searching `cat` should surface the cat
 * face before `communication`, and prefix matching on each word is what gets that ordering for
 * free while still finding `black cat`.
 */
export function searchEmojis(emojis: WhatsAppEmoji[], query: string): WhatsAppEmoji[] {
  const needle = query.trim().toLowerCase()

  if (needle.length === 0) {
    return emojis
  }

  const exact: WhatsAppEmoji[] = []
  const prefix: WhatsAppEmoji[] = []
  const partial: WhatsAppEmoji[] = []

  for (const entry of emojis) {
    if (entry.emoji === needle || entry.name === needle) {
      exact.push(entry)
      continue
    }

    const words = [...entry.name.split(' '), ...entry.keywords]

    if (words.some((word) => word.startsWith(needle))) {
      prefix.push(entry)
    } else if (entry.name.includes(needle)) {
      partial.push(entry)
    }
  }

  return [...exact, ...prefix, ...partial]
}
