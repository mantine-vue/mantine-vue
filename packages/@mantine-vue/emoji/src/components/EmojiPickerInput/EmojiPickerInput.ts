import { factory, InputBase } from '@mantine-vue/core'
import EmojiPickerInputComponent from './EmojiPickerInput.vue'
import type { EmojiPickerInputFactory } from './EmojiPickerInput.types'
import classes from './EmojiPickerInput.module.css'

export const EmojiPickerInput = factory<EmojiPickerInputFactory>(EmojiPickerInputComponent, {
  classes: { ...(InputBase as any).classes, ...classes },
})
export type * from './EmojiPickerInput.types'
