import { factory } from '@mantine-vue/core'
import RichTextEditorColorControlComponent from './RichTextEditorColorControl.vue'
import type { RichTextEditorColorControlFactory } from './RichTextEditorColorControl.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorColorControl = factory<RichTextEditorColorControlFactory>(
  RichTextEditorColorControlComponent,
  { classes },
)

export type {
  RichTextEditorColorControlFactory,
  RichTextEditorColorControlProps,
} from './RichTextEditorColorControl.types'
