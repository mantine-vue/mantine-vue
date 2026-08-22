import { factory } from '@mantine-vue/core'
import WhatsAppEmojiPickerComponent from './WhatsAppEmojiPicker.vue'
import type { WhatsAppEmojiPickerFactory } from './WhatsAppEmojiPicker.types'
import classes from './WhatsAppEmojiPicker.module.css'

export const WhatsAppEmojiPicker = factory<WhatsAppEmojiPickerFactory>(
  WhatsAppEmojiPickerComponent,
  { classes },
)

export type {
  WhatsAppEmojiPickerEmits,
  WhatsAppEmojiPickerFactory,
  WhatsAppEmojiPickerOwnProps,
  WhatsAppEmojiPickerProps,
  WhatsAppEmojiPickerSlots,
  WhatsAppEmojiPickerStylesNames,
} from './WhatsAppEmojiPicker.types'
