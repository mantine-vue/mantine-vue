import { factory } from '@mantine-vue/core'
import RichTextEditorSourceCodeControlComponent from './RichTextEditorSourceCodeControl.vue'
import type { RichTextEditorSourceCodeControlFactory } from './RichTextEditorSourceCodeControl.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorSourceCodeControl = factory<RichTextEditorSourceCodeControlFactory>(
  RichTextEditorSourceCodeControlComponent,
  { classes },
)

export type {
  RichTextEditorSourceCodeControlFactory,
  RichTextEditorSourceCodeControlProps,
} from './RichTextEditorSourceCodeControl.types'
