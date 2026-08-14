import type { Factory } from '@mantine-vue/core'
import type { RichTextEditorControlProps } from './RichTextEditorControl.types'

export type RichTextEditorSourceCodeControlProps = RichTextEditorControlProps

export type RichTextEditorSourceCodeControlFactory = Factory<{
  props: RichTextEditorSourceCodeControlProps
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: 'control'
  compound: true
}>
