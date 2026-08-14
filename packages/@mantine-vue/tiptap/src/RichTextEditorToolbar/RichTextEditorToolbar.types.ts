import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, Factory, StylesApiProps } from '@mantine-vue/core'

export type RichTextEditorToolbarStylesNames = 'toolbar'

export interface RichTextEditorToolbarRuntimeProps {
  classNames?: unknown
  styles?: unknown
  vars?: unknown
  unstyled?: boolean
  sticky?: boolean
  stickyOffset?: string | number
  mod?: BoxMod
  variant?: string
}

export interface RichTextEditorToolbarOwnProps extends StylesApiProps<RichTextEditorToolbarFactory> {
  /** Determines whether sticky positioning is enabled. @default false */
  sticky?: boolean

  /** Top offset used for sticky positioning. @default 0 */
  stickyOffset?: string | number
}

export interface RichTextEditorToolbarProps
  extends
    Omit<BoxProps, keyof RichTextEditorToolbarOwnProps | 'component'>,
    RichTextEditorToolbarOwnProps {}

export interface RichTextEditorToolbarSlots {
  default?: () => VNodeChild
}

export type RichTextEditorToolbarFactory = Factory<{
  props: RichTextEditorToolbarProps
  slots: RichTextEditorToolbarSlots
  ref: HTMLDivElement
  element: 'div'
  stylesNames: RichTextEditorToolbarStylesNames
  compound: true
}>
