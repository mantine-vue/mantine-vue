import type { Factory } from '@mantine-vue/core'
import type { RichTextEditorControlProps } from './RichTextEditorControl.types'

export interface RichTextEditorColorControlOwnProps {
  /** Color applied to the selected text. */
  color: string
}

export interface RichTextEditorColorControlProps
  extends
    Omit<RichTextEditorControlProps, keyof RichTextEditorColorControlOwnProps>,
    RichTextEditorColorControlOwnProps {}

export type RichTextEditorColorControlFactory = Factory<{
  props: RichTextEditorColorControlProps
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: 'control'
  compound: true
}>
