import type { Component, HTMLAttributes, VNodeChild } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { BoxProps, Factory, StylesApiProps } from '@mantine-vue/core'
import type { RichTextEditorLabels } from '../labels'

export type RichTextEditorControlStylesNames = 'control'

export interface RichTextEditorControlRuntimeProps {
  classNames?: unknown
  styles?: unknown
  vars?: unknown
  unstyled?: boolean
  active?: boolean
  interactive?: boolean
  disabled?: boolean
  variant?: string
}

export interface RichTextEditorControlOwnProps extends StylesApiProps<RichTextEditorControlFactory> {
  /** Determines whether the control has an active state. */
  active?: boolean

  /** Determines whether the control can be interacted with. @default true */
  interactive?: boolean

  /** Disables the control. */
  disabled?: boolean

  /** Visual variant inherited from the editor by default. */
  variant?: string
}

export interface RichTextEditorControlProps
  extends
    Omit<BoxProps, keyof RichTextEditorControlOwnProps | 'component'>,
    RichTextEditorControlOwnProps {}

export interface RichTextEditorControlSlots {
  default?: () => VNodeChild
}

export type RichTextEditorControlFactory = Factory<{
  props: RichTextEditorControlProps
  slots: RichTextEditorControlSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: RichTextEditorControlStylesNames
  compound: true
}>

export interface RichTextEditorControlBaseOwnProps extends RichTextEditorControlOwnProps {
  /** Icon displayed inside the control. @deprecated Use the `icon` slot instead. */
  icon?: Component
}

export interface RichTextEditorControlBaseRuntimeProps extends RichTextEditorControlRuntimeProps {
  /** Icon displayed inside the control. @deprecated Use the `icon` slot instead. */
  icon?: Component
}

export type RichTextEditorControlIconSlotProps = HTMLAttributes

export interface RichTextEditorControlBaseSlots {
  /** Replaces the default control icon. */
  icon?: (props: RichTextEditorControlIconSlotProps) => VNodeChild
}

export interface RichTextEditorControlBaseProps
  extends
    Omit<RichTextEditorControlProps, keyof RichTextEditorControlBaseOwnProps>,
    RichTextEditorControlBaseOwnProps {}

export type RichTextEditorControlBaseFactory = Factory<{
  props: RichTextEditorControlBaseProps
  slots: RichTextEditorControlBaseSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: RichTextEditorControlStylesNames
  compound: true
}>

export interface ControlOperation {
  name: string
  attributes?: Record<string, any> | string
}

export interface ControlActiveState {
  name: string
  attributes?: Record<string, any> | string
}

export interface CreateControlProps {
  label: keyof RichTextEditorLabels
  icon: Component
  isActive?: ControlActiveState
  isDisabled?: (editor: Editor) => boolean
  operation: ControlOperation
}

export interface RichTextEditorGeneratedControlOwnProps
  extends RichTextEditorControlOwnProps, CreateControlProps {}

export interface RichTextEditorGeneratedControlRuntimeProps
  extends RichTextEditorControlRuntimeProps, CreateControlProps {}

export type RichTextEditorGeneratedControlSlots = RichTextEditorControlBaseSlots

export interface RichTextEditorGeneratedControlProps
  extends
    Omit<RichTextEditorControlProps, keyof RichTextEditorGeneratedControlOwnProps>,
    RichTextEditorGeneratedControlOwnProps {}

export type RichTextEditorGeneratedControlFactory = Factory<{
  props: RichTextEditorGeneratedControlProps
  slots: RichTextEditorGeneratedControlSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: RichTextEditorControlStylesNames
  compound: true
}>
