import { factory } from '@mantine-vue/core'
import RichTextEditorToolbarComponent from './RichTextEditorToolbar.vue'
import type { RichTextEditorToolbarFactory } from './RichTextEditorToolbar.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorToolbar = factory<RichTextEditorToolbarFactory>(
  RichTextEditorToolbarComponent,
  { classes },
)

export type {
  RichTextEditorToolbarFactory,
  RichTextEditorToolbarOwnProps,
  RichTextEditorToolbarProps,
  RichTextEditorToolbarSlots,
  RichTextEditorToolbarStylesNames,
} from './RichTextEditorToolbar.types'
