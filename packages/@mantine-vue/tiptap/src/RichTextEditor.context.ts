import type { Editor } from '@tiptap/vue-3'
import { createSafeContext } from '@mantine-vue/core'
import type { ResolvedRichTextEditorLabels } from './labels'
import type { ImageUploadResult } from './extensions/UploadImage'

export interface RichTextEditorContextValue {
  getStyles: (
    selector: string,
    options?: {
      active?: boolean
      className?: any
      style?: any
      classNames?: any
      styles?: any
      props?: Record<string, any>
      variant?: string
    },
  ) => Record<string, any>
  editor: Editor | null
  labels: ResolvedRichTextEditorLabels
  withCodeHighlightStyles: boolean | undefined
  withTypographyStyles: boolean | undefined
  unstyled: boolean | undefined
  variant: string | undefined
  onSourceCodeTextSwitch?: (isSourceCodeModeActive: boolean) => void
  onImageUpload?: (file: File) => Promise<string | ImageUploadResult>
  onImageUploadError?: (file: File, error: unknown) => void
}

export const [provideRichTextEditorContext, useRichTextEditorContext] =
  createSafeContext<RichTextEditorContextValue>('RichTextEditor component was not found in tree')
