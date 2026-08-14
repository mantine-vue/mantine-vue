import type { BoxProps, Factory, StylesApiProps } from '@mantine-vue/core'

export type RichTextEditorContentStylesNames = 'root'

export interface RichTextEditorContentRuntimeProps {
  classNames?: unknown
  styles?: unknown
  vars?: unknown
  unstyled?: boolean
}

export type RichTextEditorContentOwnProps = StylesApiProps<RichTextEditorContentFactory>

export interface RichTextEditorContentProps
  extends
    Omit<BoxProps, keyof RichTextEditorContentOwnProps | 'component'>,
    RichTextEditorContentOwnProps {}

export type RichTextEditorContentFactory = Factory<{
  props: RichTextEditorContentProps
  ref: HTMLDivElement
  element: 'div'
  stylesNames: RichTextEditorContentStylesNames
  compound: true
}>
