import type { ColorPickerProps, Factory, PopoverProps } from '@mantine-vue/core'
import type { RichTextEditorControlProps } from './RichTextEditorControl.types'

export interface RichTextEditorColorPickerControlOwnProps {
  /** Props passed down to the `Popover` component. */
  popoverProps?: Partial<PopoverProps>

  /** Props passed down to the `ColorPicker` component. */
  colorPickerProps?: Partial<ColorPickerProps>

  /** Colors displayed in the color palette. */
  colors: string[]
}

export interface RichTextEditorColorPickerControlProps
  extends
    Omit<RichTextEditorControlProps, keyof RichTextEditorColorPickerControlOwnProps>,
    RichTextEditorColorPickerControlOwnProps {}

export type RichTextEditorColorPickerControlFactory = Factory<{
  props: RichTextEditorColorPickerControlProps
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: 'control'
  compound: true
}>
