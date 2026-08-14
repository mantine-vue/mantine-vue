import type { VNodeChild } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { BoxProps, Factory, StylesApiProps } from '@mantine-vue/core'
import type { RichTextEditorLabels } from './labels'
import type { RichTextEditorContent } from './RichTextEditorContent/RichTextEditorContent'
import type { RichTextEditorControl } from './RichTextEditorControl/RichTextEditorControl'
import type {
  BoldControl,
  ItalicControl,
  StrikeThroughControl,
  UnderlineControl,
  ClearFormattingControl,
  H1Control,
  H2Control,
  H3Control,
  H4Control,
  H5Control,
  H6Control,
  BulletListControl,
  OrderedListControl,
  UnlinkControl,
  BlockquoteControl,
  AlignLeftControl,
  AlignRightControl,
  AlignCenterControl,
  AlignJustifyControl,
  SuperscriptControl,
  SubscriptControl,
  CodeControl,
  CodeBlockControl,
  HighlightControl,
  HrControl,
  UnsetColorControl,
  UndoControl,
  RedoControl,
  TaskListControl,
  TaskListSinkControl,
  TaskListLiftControl,
} from './RichTextEditorControl/controls'
import type { RichTextEditorColorControl } from './RichTextEditorControl/RichTextEditorColorControl'
import type { RichTextEditorColorPickerControl } from './RichTextEditorControl/RichTextEditorColorPickerControl'
import type { RichTextEditorLinkControl } from './RichTextEditorControl/RichTextEditorLinkControl'
import type { RichTextEditorSourceCodeControl } from './RichTextEditorControl/RichTextEditorSourceCodeControl'
import type { RichTextEditorControlsGroup } from './RichTextEditorControlsGroup/RichTextEditorControlsGroup'
import type { RichTextEditorToolbar } from './RichTextEditorToolbar/RichTextEditorToolbar'

export type RichTextEditorVariant = 'default' | 'subtle'

export type RichTextEditorStylesNames =
  | 'linkEditorSave'
  | 'linkEditorDropdown'
  | 'root'
  | 'content'
  | 'Typography'
  | 'control'
  | 'controlIcon'
  | 'controlsGroup'
  | 'toolbar'
  | 'linkEditor'
  | 'linkEditorInput'
  | 'linkEditorExternalControl'

export interface RichTextEditorOwnProps extends StylesApiProps<RichTextEditorFactory> {
  /** Tiptap editor instance. */
  editor: Editor | null | undefined

  /** Determines whether code highlight styles are enabled. @default true */
  withCodeHighlightStyles?: boolean

  /** Determines whether typography styles are enabled. @default true */
  withTypographyStyles?: boolean

  /** Called when source code mode changes. */
  onSourceCodeTextSwitch?: (isSourceCodeModeActive: boolean) => void

  /** Labels used by editor controls. */
  labels?: Partial<RichTextEditorLabels>

  /** Visual variant. @default 'default' */
  variant?: RichTextEditorVariant
}

export interface RichTextEditorProps
  extends Omit<BoxProps, keyof RichTextEditorOwnProps | 'component'>, RichTextEditorOwnProps {}

export interface RichTextEditorSlots {
  default?: () => VNodeChild
}

export type RichTextEditorFactory = Factory<{
  props: RichTextEditorProps
  slots: RichTextEditorSlots
  ref: HTMLDivElement
  element: 'div'
  stylesNames: RichTextEditorStylesNames
  variant: RichTextEditorVariant
  staticComponents: {
    Content: typeof RichTextEditorContent
    Control: typeof RichTextEditorControl
    Toolbar: typeof RichTextEditorToolbar
    ControlsGroup: typeof RichTextEditorControlsGroup
    Bold: typeof BoldControl
    Italic: typeof ItalicControl
    Strikethrough: typeof StrikeThroughControl
    Underline: typeof UnderlineControl
    ClearFormatting: typeof ClearFormattingControl
    H1: typeof H1Control
    H2: typeof H2Control
    H3: typeof H3Control
    H4: typeof H4Control
    H5: typeof H5Control
    H6: typeof H6Control
    BulletList: typeof BulletListControl
    OrderedList: typeof OrderedListControl
    Link: typeof RichTextEditorLinkControl
    Unlink: typeof UnlinkControl
    Blockquote: typeof BlockquoteControl
    AlignLeft: typeof AlignLeftControl
    AlignRight: typeof AlignRightControl
    AlignCenter: typeof AlignCenterControl
    AlignJustify: typeof AlignJustifyControl
    Superscript: typeof SuperscriptControl
    Subscript: typeof SubscriptControl
    Code: typeof CodeControl
    CodeBlock: typeof CodeBlockControl
    ColorPicker: typeof RichTextEditorColorPickerControl
    Color: typeof RichTextEditorColorControl
    Highlight: typeof HighlightControl
    Hr: typeof HrControl
    UnsetColor: typeof UnsetColorControl
    Undo: typeof UndoControl
    Redo: typeof RedoControl
    TaskList: typeof TaskListControl
    TaskListSink: typeof TaskListSinkControl
    TaskListLift: typeof TaskListLiftControl
    SourceCode: typeof RichTextEditorSourceCodeControl
  }
}>
