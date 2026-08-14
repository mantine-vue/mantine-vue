import { factory } from '@mantine-vue/core'
import RichTextEditorControlsGroupComponent from './RichTextEditorControlsGroup.vue'
import type { RichTextEditorControlsGroupFactory } from './RichTextEditorControlsGroup.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorControlsGroup = factory<RichTextEditorControlsGroupFactory>(
  RichTextEditorControlsGroupComponent,
  { classes },
)

export type {
  RichTextEditorControlsGroupFactory,
  RichTextEditorControlsGroupOwnProps,
  RichTextEditorControlsGroupProps,
  RichTextEditorControlsGroupSlots,
  RichTextEditorControlsGroupStylesNames,
} from './RichTextEditorControlsGroup.types'
