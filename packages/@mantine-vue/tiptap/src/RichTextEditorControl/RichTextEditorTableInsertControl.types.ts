import type { Factory, PopoverProps } from '@mantine-vue/core'
import type {
  RichTextEditorControlBaseProps,
  RichTextEditorControlBaseSlots,
} from './RichTextEditorControl.types'

export type RichTextEditorTableInsertControlStylesNames =
  | 'control'
  | 'tableInsertDropdown'
  | 'tableInsertGrid'
  | 'tableInsertCell'
  | 'tableInsertLabel'

export interface RichTextEditorTableInsertControlProps extends RichTextEditorControlBaseProps {
  /** Maximum number of columns selectable in the grid. @default 10 */
  maxColumns?: number
  /** Maximum number of rows selectable in the grid. @default 10 */
  maxRows?: number
  /** Whether the inserted table has a header row. @default true */
  withHeaderRow?: boolean
  /** Props passed to the Popover. */
  popoverProps?: Partial<PopoverProps>
}

export type RichTextEditorTableInsertControlFactory = Factory<{
  props: RichTextEditorTableInsertControlProps
  slots: RichTextEditorControlBaseSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: RichTextEditorTableInsertControlStylesNames
  compound: true
}>
