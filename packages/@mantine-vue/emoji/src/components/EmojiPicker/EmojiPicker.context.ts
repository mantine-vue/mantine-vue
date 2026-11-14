import { createSafeContext, type MantineSize } from '@mantine-vue/core'
import type { EmojiPickerLabels } from '../../types'

export interface EmojiPickerContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => Record<string, any>
  readonly labels: Required<EmojiPickerLabels>
  readonly size: MantineSize | undefined
}

export const [provideEmojiPickerContext, useEmojiPickerContext] =
  createSafeContext<EmojiPickerContextValue>(
    'EmojiPicker components must be used within EmojiPicker',
  )
