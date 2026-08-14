import type { Component } from 'vue'
import type { Factory, PopoverProps, StylesApiProps } from '@mantine-vue/core'
import type {
  RichTextEditorControlBaseProps,
  RichTextEditorControlBaseSlots,
} from './RichTextEditorControl.types'

export type RichTextEditorLinkControlStylesNames =
  | 'control'
  | 'linkEditor'
  | 'linkEditorDropdown'
  | 'linkEditorSave'
  | 'linkEditorInput'
  | 'linkEditorExternalControl'

export interface RichTextEditorLinkControlRuntimeProps {
  classNames?: unknown
  styles?: unknown
  vars?: unknown
  unstyled?: boolean
  popoverProps?: Partial<PopoverProps>
  disableTooltips?: boolean
  initialExternal?: boolean

  /** Icon displayed inside the link control. @deprecated Use the `icon` slot instead. */
  icon?: Component
}

export interface RichTextEditorLinkControlOwnProps extends StylesApiProps<RichTextEditorLinkControlFactory> {
  /** Props passed to Popover. */
  popoverProps?: Partial<PopoverProps>

  /** Disables the external-link tooltip. @default false */
  disableTooltips?: boolean

  /** Initial external-link state. @default false */
  initialExternal?: boolean
}

export interface RichTextEditorLinkControlProps
  extends
    Omit<RichTextEditorControlBaseProps, keyof RichTextEditorLinkControlOwnProps>,
    RichTextEditorLinkControlOwnProps {}

export type RichTextEditorLinkControlSlots = RichTextEditorControlBaseSlots

export type RichTextEditorLinkControlFactory = Factory<{
  props: RichTextEditorLinkControlProps
  slots: RichTextEditorLinkControlSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: RichTextEditorLinkControlStylesNames
  compound: true
}>
