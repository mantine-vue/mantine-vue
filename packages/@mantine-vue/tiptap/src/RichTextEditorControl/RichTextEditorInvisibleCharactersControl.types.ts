import type { Factory } from '@mantine-vue/core'
import type {
  RichTextEditorControlBaseProps,
  RichTextEditorControlBaseSlots,
} from './RichTextEditorControl.types'

export type RichTextEditorInvisibleCharactersControlProps = RichTextEditorControlBaseProps

export type RichTextEditorInvisibleCharactersControlFactory = Factory<{
  props: RichTextEditorInvisibleCharactersControlProps
  slots: RichTextEditorControlBaseSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: 'control'
  compound: true
}>
