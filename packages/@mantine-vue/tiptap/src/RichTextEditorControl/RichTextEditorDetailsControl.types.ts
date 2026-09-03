import type { Factory } from '@mantine-vue/core'
import type {
  RichTextEditorControlBaseProps,
  RichTextEditorControlBaseSlots,
} from './RichTextEditorControl.types'

export type RichTextEditorDetailsControlProps = RichTextEditorControlBaseProps

export type RichTextEditorDetailsControlFactory = Factory<{
  props: RichTextEditorDetailsControlProps
  slots: RichTextEditorControlBaseSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: 'control'
  compound: true
}>
