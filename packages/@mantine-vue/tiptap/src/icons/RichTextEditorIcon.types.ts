import type { Factory } from '@mantine-vue/core'

export interface RichTextEditorIconProps {
  /** SVG path data rendered by the icon. */
  paths: string[]
}

export type RichTextEditorIconFactory = Factory<{
  props: RichTextEditorIconProps
  ref: SVGSVGElement
  element: 'svg'
}>
