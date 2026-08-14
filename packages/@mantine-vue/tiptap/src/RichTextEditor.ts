import { factory } from '@mantine-vue/core'
import RichTextEditorComponent from './RichTextEditor.vue'
import { RichTextEditorContent } from './RichTextEditorContent/RichTextEditorContent'
import * as controls from './RichTextEditorControl'
import { RichTextEditorControl } from './RichTextEditorControl/RichTextEditorControl'
import { RichTextEditorColorControl } from './RichTextEditorControl/RichTextEditorColorControl'
import { RichTextEditorColorPickerControl } from './RichTextEditorControl/RichTextEditorColorPickerControl'
import { RichTextEditorLinkControl } from './RichTextEditorControl/RichTextEditorLinkControl'
import { RichTextEditorSourceCodeControl } from './RichTextEditorControl/RichTextEditorSourceCodeControl'
import { RichTextEditorControlsGroup } from './RichTextEditorControlsGroup/RichTextEditorControlsGroup'
import { RichTextEditorToolbar } from './RichTextEditorToolbar/RichTextEditorToolbar'
import type { RichTextEditorFactory } from './RichTextEditor.types'
import classes from './RichTextEditor.module.css'

export const RichTextEditor = factory<RichTextEditorFactory>(RichTextEditorComponent, {
  classes,
  Content: RichTextEditorContent,
  Control: RichTextEditorControl,
  Toolbar: RichTextEditorToolbar,
  ControlsGroup: RichTextEditorControlsGroup,
  Bold: controls.BoldControl,
  Italic: controls.ItalicControl,
  Strikethrough: controls.StrikeThroughControl,
  Underline: controls.UnderlineControl,
  ClearFormatting: controls.ClearFormattingControl,
  H1: controls.H1Control,
  H2: controls.H2Control,
  H3: controls.H3Control,
  H4: controls.H4Control,
  H5: controls.H5Control,
  H6: controls.H6Control,
  BulletList: controls.BulletListControl,
  OrderedList: controls.OrderedListControl,
  Link: RichTextEditorLinkControl,
  Unlink: controls.UnlinkControl,
  Blockquote: controls.BlockquoteControl,
  AlignLeft: controls.AlignLeftControl,
  AlignRight: controls.AlignRightControl,
  AlignCenter: controls.AlignCenterControl,
  AlignJustify: controls.AlignJustifyControl,
  Superscript: controls.SuperscriptControl,
  Subscript: controls.SubscriptControl,
  Code: controls.CodeControl,
  CodeBlock: controls.CodeBlockControl,
  ColorPicker: RichTextEditorColorPickerControl,
  Color: RichTextEditorColorControl,
  Highlight: controls.HighlightControl,
  Hr: controls.HrControl,
  UnsetColor: controls.UnsetColorControl,
  Undo: controls.UndoControl,
  Redo: controls.RedoControl,
  TaskList: controls.TaskListControl,
  TaskListSink: controls.TaskListSinkControl,
  TaskListLift: controls.TaskListLiftControl,
  SourceCode: RichTextEditorSourceCodeControl,
})

export type {
  RichTextEditorFactory,
  RichTextEditorOwnProps,
  RichTextEditorProps,
  RichTextEditorSlots,
  RichTextEditorStylesNames,
  RichTextEditorVariant,
} from './RichTextEditor.types'
export type { RichTextEditorContentProps } from './RichTextEditorContent/RichTextEditorContent.types'
export type { RichTextEditorControlProps } from './RichTextEditorControl/RichTextEditorControl.types'
export type { RichTextEditorControlsGroupProps } from './RichTextEditorControlsGroup/RichTextEditorControlsGroup.types'
export type { RichTextEditorToolbarProps } from './RichTextEditorToolbar/RichTextEditorToolbar.types'
