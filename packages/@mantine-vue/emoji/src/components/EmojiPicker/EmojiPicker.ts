import { factory } from '@mantine-vue/core'
import EmojiPickerComponent, { varsResolver } from './EmojiPicker.vue'
import type { EmojiPickerFactory } from './EmojiPicker.types'
import classes from './EmojiPicker.module.css'

export const EmojiPicker = factory<EmojiPickerFactory>(EmojiPickerComponent, {
  classes,
  varsResolver,
})
export type * from './EmojiPicker.types'
