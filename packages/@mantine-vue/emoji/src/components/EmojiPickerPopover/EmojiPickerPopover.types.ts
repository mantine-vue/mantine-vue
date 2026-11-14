import type { Factory } from '@mantine-vue/core'
import type { EmojiPickerEmoji } from '../../types'
import type { EmojiPickerOwnProps } from '../EmojiPicker/EmojiPicker.types'

export interface EmojiPickerPopoverOwnProps extends EmojiPickerOwnProps {
  /** Props passed to the `Popover` component, use `opened`, `defaultOpened` and `v-model:opened` to control opened state */
  popoverProps?: Record<string, any>
  /** Controlled popover opened state, supports `v-model:opened` */
  opened?: boolean
  /** Default popover opened state for uncontrolled mode */
  defaultOpened?: boolean
  /** Determines whether the popover closes after emoji is selected @default true */
  closeOnSelect?: boolean
}

export type EmojiPickerPopoverProps = EmojiPickerPopoverOwnProps

export interface EmojiPickerPopoverEmits {
  'update:opened': [opened: boolean]
  /** Emitted when popover opened state changes */
  openedChange: [opened: boolean]
  /** Emitted when an emoji is selected */
  emojiSelect: [emoji: EmojiPickerEmoji]
  'update:skinTone': [skinTone: number]
  /** Emitted when skin tone changes */
  skinToneChange: [skinTone: number]
}

export interface EmojiPickerPopoverSlots {
  /** Popover target element */
  default?: () => any
  /** Content displayed when search yields no results */
  empty?: () => any
}

export type EmojiPickerPopoverFactory = Factory<{
  props: EmojiPickerPopoverProps
  emits: EmojiPickerPopoverEmits
  slots: EmojiPickerPopoverSlots
  ref: HTMLDivElement
}>
