import type { Factory, MantineSize } from '@mantine-vue/core'
import type { EmojiPickerData, EmojiPickerEmoji } from '../../types'
import type { EmojiPickerOwnProps } from '../EmojiPicker/EmojiPicker.types'

export type EmojiPickerInputStylesNames =
  | 'dropdown'
  | 'inputEmoji'
  | 'inputEmojiName'
  | 'inputValue'
  | 'wrapper'
  | 'input'
  | 'section'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'

export type EmojiPickerInputCssVariables = {
  root: never
}

export interface EmojiPickerInputOwnProps {
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  /** Controlled emoji id value, supports `v-model` */
  modelValue?: string | null
  /** Default emoji id value for uncontrolled state */
  defaultValue?: string | null
  /** Input placeholder displayed when no emoji is selected */
  placeholder?: string
  /** Determines whether the clear button is displayed @default false */
  clearable?: boolean
  /** Props passed down to the clear button */
  clearButtonProps?: Record<string, any>
  /** Props passed to the `Popover` component, use `opened`, `defaultOpened` and `v-model:opened` to control opened state */
  popoverProps?: Record<string, any>
  /** Controlled popover opened state, supports `v-model:opened` */
  opened?: boolean
  /** Default popover opened state for uncontrolled mode */
  defaultOpened?: boolean
  /** Determines whether the popover closes after emoji is selected @default true */
  closeOnSelect?: boolean
  /** Emoji data object, use `emojiMartAdapter` or `emojibaseAdapter` to convert data */
  data: EmojiPickerData
  /** Props passed to the `EmojiPicker` component inside the dropdown */
  pickerProps?: Omit<EmojiPickerOwnProps, 'data'> & {
    onSkinToneChange?: (skinTone: number) => void
  }
  /** Determines whether the input is in read-only mode @default false */
  readOnly?: boolean
  /** Determines whether the input is disabled @default false */
  disabled?: boolean
  /** Controls input `height`, horizontal `padding` and `font-size` @default 'sm' */
  size?: MantineSize | (string & {})
}

export interface EmojiPickerInputProps extends EmojiPickerInputOwnProps {
  [key: string]: any
}

export interface EmojiPickerInputEmits {
  'update:modelValue': [value: string | null]
  /** Emitted when value changes */
  change: [value: string | null]
  'update:opened': [opened: boolean]
  /** Emitted when popover opened state changes */
  openedChange: [opened: boolean]
  /** Emitted when an emoji is selected */
  emojiSelect: [emoji: EmojiPickerEmoji]
}

export interface EmojiPickerInputSlots {
  label?: () => any
  description?: () => any
  error?: () => any
}

export type EmojiPickerInputFactory = Factory<{
  props: EmojiPickerInputProps
  emits: EmojiPickerInputEmits
  slots: EmojiPickerInputSlots
  ref: HTMLButtonElement
  stylesNames: EmojiPickerInputStylesNames
  vars: EmojiPickerInputCssVariables
}>
