import { factory } from '@mantine-vue/core'
import RichTextEditorContentComponent from './RichTextEditorContent.vue'
import type { RichTextEditorContentFactory } from './RichTextEditorContent.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorContent = factory<RichTextEditorContentFactory>(
  RichTextEditorContentComponent,
  { classes },
)

export type {
  RichTextEditorContentFactory,
  RichTextEditorContentOwnProps,
  RichTextEditorContentProps,
  RichTextEditorContentStylesNames,
} from './RichTextEditorContent.types'
