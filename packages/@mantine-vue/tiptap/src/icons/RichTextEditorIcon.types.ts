import type { Factory } from '@mantine-vue/core'

export interface RichTextEditorIconProps {
  paths: string[]
}

export type RichTextEditorIconFactory = Factory<{
  props: RichTextEditorIconProps
  ref: SVGSVGElement
  element: 'svg'
}>
