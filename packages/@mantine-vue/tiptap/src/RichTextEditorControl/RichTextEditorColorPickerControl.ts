import { factory } from '@mantine-vue/core'
import RichTextEditorColorPickerControlComponent from './RichTextEditorColorPickerControl.vue'
import type { RichTextEditorColorPickerControlFactory } from './RichTextEditorColorPickerControl.types'
import classes from '../RichTextEditor.module.css'

export type {
  RichTextEditorColorPickerControlFactory,
  RichTextEditorColorPickerControlOwnProps,
  RichTextEditorColorPickerControlProps,
} from './RichTextEditorColorPickerControl.types'

export const RichTextEditorColorPickerControl = factory<RichTextEditorColorPickerControlFactory>(
  RichTextEditorColorPickerControlComponent,
  { classes },
)
