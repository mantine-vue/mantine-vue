import { factory } from '@mantine-vue/core'
import RichTextEditorLinkControlComponent from './RichTextEditorLinkControl.vue'
import type { RichTextEditorLinkControlFactory } from './RichTextEditorLinkControl.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorLinkControl = factory<RichTextEditorLinkControlFactory>(
  RichTextEditorLinkControlComponent,
  { classes },
)

export type {
  RichTextEditorLinkControlFactory,
  RichTextEditorLinkControlOwnProps,
  RichTextEditorLinkControlProps,
  RichTextEditorLinkControlStylesNames,
} from './RichTextEditorLinkControl.types'
