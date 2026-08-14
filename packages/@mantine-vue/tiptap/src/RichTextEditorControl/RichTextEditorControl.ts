import { factory } from '@mantine-vue/core'
import RichTextEditorControlComponent from './RichTextEditorControl.vue'
import RichTextEditorControlBaseComponent from './RichTextEditorControlBase.vue'
import RichTextEditorGeneratedControlComponent from './RichTextEditorGeneratedControl.vue'
import type {
  CreateControlProps,
  RichTextEditorControlBaseFactory,
  RichTextEditorControlFactory,
  RichTextEditorGeneratedControlFactory,
} from './RichTextEditorControl.types'
import classes from '../RichTextEditor.module.css'

export const RichTextEditorControl = factory<RichTextEditorControlFactory>(
  RichTextEditorControlComponent,
  { classes },
)

export const RichTextEditorControlBase = factory<RichTextEditorControlBaseFactory>(
  RichTextEditorControlBaseComponent,
  { classes },
)

const RichTextEditorGeneratedControl = factory<RichTextEditorGeneratedControlFactory>(
  RichTextEditorGeneratedControlComponent,
  { classes },
)

export function createControl(config: CreateControlProps) {
  return RichTextEditorGeneratedControl.withProps(
    config,
  ) as unknown as typeof RichTextEditorControlBase
}

export type {
  ControlActiveState,
  ControlOperation,
  CreateControlProps,
  RichTextEditorControlBaseFactory,
  RichTextEditorControlBaseOwnProps,
  RichTextEditorControlBaseProps,
  RichTextEditorControlFactory,
  RichTextEditorControlOwnProps,
  RichTextEditorControlProps,
  RichTextEditorControlSlots,
  RichTextEditorControlStylesNames,
} from './RichTextEditorControl.types'
