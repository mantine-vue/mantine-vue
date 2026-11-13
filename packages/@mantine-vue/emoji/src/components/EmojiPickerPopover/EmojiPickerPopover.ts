import { factory } from '@mantine-vue/core'
import EmojiPickerPopoverComponent from './EmojiPickerPopover.vue'
import type { EmojiPickerPopoverFactory } from './EmojiPickerPopover.types'
import classes from './EmojiPickerPopover.module.css'

export const EmojiPickerPopover = factory<EmojiPickerPopoverFactory>(EmojiPickerPopoverComponent, {
  classes,
})
export type * from './EmojiPickerPopover.types'
