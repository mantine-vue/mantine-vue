import type { BoxProps } from '@mantine-vue/core'
import type { RichTextEditorControlBaseProps } from './RichTextEditorControl.types'

export interface RichTextEditorImageUploadControlRuntimeProps {
  accept?: string
  disabled?: boolean
  icon?: any
}

export type RichTextEditorImageUploadControlProps = Omit<
  RichTextEditorControlBaseProps,
  'classNames' | 'styles' | 'vars'
> &
  BoxProps & {
    /** Accepted file types. @default 'image/*' */
    accept?: string
  }
