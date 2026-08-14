import type { VNodeChild } from 'vue'
import type { BoxProps, Factory, StylesApiProps } from '@mantine-vue/core'

export type RichTextEditorControlsGroupStylesNames = 'controlsGroup'

export interface RichTextEditorControlsGroupRuntimeProps {
  classNames?: unknown
  styles?: unknown
  vars?: unknown
  unstyled?: boolean
  variant?: string
}

export type RichTextEditorControlsGroupOwnProps = StylesApiProps<RichTextEditorControlsGroupFactory>

export interface RichTextEditorControlsGroupProps
  extends
    Omit<BoxProps, keyof RichTextEditorControlsGroupOwnProps | 'component'>,
    RichTextEditorControlsGroupOwnProps {}

export interface RichTextEditorControlsGroupSlots {
  default?: () => VNodeChild
}

export type RichTextEditorControlsGroupFactory = Factory<{
  props: RichTextEditorControlsGroupProps
  slots: RichTextEditorControlsGroupSlots
  ref: HTMLDivElement
  element: 'div'
  stylesNames: RichTextEditorControlsGroupStylesNames
  compound: true
}>
