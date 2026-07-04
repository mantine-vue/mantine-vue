import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconCircleOff,
  IconClearFormatting,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconHighlight,
  IconIndentDecrease,
  IconIndentIncrease,
  IconItalic,
  IconLineDashed,
  IconList,
  IconListCheck,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconUnderline,
  IconUnlink,
} from '../icons/Icons'
import { createControl } from './RichTextEditorControl'

export const BoldControl = createControl({
  label: 'boldControlLabel',
  icon: IconBold,
  isActive: { name: 'bold' },
  operation: { name: 'toggleBold' },
})
export const ItalicControl = createControl({
  label: 'italicControlLabel',
  icon: IconItalic,
  isActive: { name: 'italic' },
  operation: { name: 'toggleItalic' },
})
export const UnderlineControl = createControl({
  label: 'underlineControlLabel',
  icon: IconUnderline,
  isActive: { name: 'underline' },
  operation: { name: 'toggleUnderline' },
})
export const StrikeThroughControl = createControl({
  label: 'strikeControlLabel',
  icon: IconStrikethrough,
  isActive: { name: 'strike' },
  operation: { name: 'toggleStrike' },
})
export const ClearFormattingControl = createControl({
  label: 'clearFormattingControlLabel',
  icon: IconClearFormatting,
  operation: { name: 'unsetAllMarks' },
})
export const UnlinkControl = createControl({
  label: 'unlinkControlLabel',
  icon: IconUnlink,
  operation: { name: 'unsetLink' },
})
export const BulletListControl = createControl({
  label: 'bulletListControlLabel',
  icon: IconList,
  isActive: { name: 'bulletList' },
  operation: { name: 'toggleBulletList' },
})
export const OrderedListControl = createControl({
  label: 'orderedListControlLabel',
  icon: IconListNumbers,
  isActive: { name: 'orderedList' },
  operation: { name: 'toggleOrderedList' },
})
export const H1Control = createControl({
  label: 'h1ControlLabel',
  icon: IconH1,
  isActive: { name: 'heading', attributes: { level: 1 } },
  operation: { name: 'toggleHeading', attributes: { level: 1 } },
})
export const H2Control = createControl({
  label: 'h2ControlLabel',
  icon: IconH2,
  isActive: { name: 'heading', attributes: { level: 2 } },
  operation: { name: 'toggleHeading', attributes: { level: 2 } },
})
export const H3Control = createControl({
  label: 'h3ControlLabel',
  icon: IconH3,
  isActive: { name: 'heading', attributes: { level: 3 } },
  operation: { name: 'toggleHeading', attributes: { level: 3 } },
})
export const H4Control = createControl({
  label: 'h4ControlLabel',
  icon: IconH4,
  isActive: { name: 'heading', attributes: { level: 4 } },
  operation: { name: 'toggleHeading', attributes: { level: 4 } },
})
export const H5Control = createControl({
  label: 'h5ControlLabel',
  icon: IconH5,
  isActive: { name: 'heading', attributes: { level: 5 } },
  operation: { name: 'toggleHeading', attributes: { level: 5 } },
})
export const H6Control = createControl({
  label: 'h6ControlLabel',
  icon: IconH6,
  isActive: { name: 'heading', attributes: { level: 6 } },
  operation: { name: 'toggleHeading', attributes: { level: 6 } },
})
export const BlockquoteControl = createControl({
  label: 'blockquoteControlLabel',
  icon: IconBlockquote,
  isActive: { name: 'blockquote' },
  operation: { name: 'toggleBlockquote' },
})
export const AlignLeftControl = createControl({
  label: 'alignLeftControlLabel',
  icon: IconAlignLeft,
  operation: { name: 'setTextAlign', attributes: 'left' },
})
export const AlignRightControl = createControl({
  label: 'alignRightControlLabel',
  icon: IconAlignRight,
  operation: { name: 'setTextAlign', attributes: 'right' },
})
export const AlignCenterControl = createControl({
  label: 'alignCenterControlLabel',
  icon: IconAlignCenter,
  operation: { name: 'setTextAlign', attributes: 'center' },
})
export const AlignJustifyControl = createControl({
  label: 'alignJustifyControlLabel',
  icon: IconAlignJustified,
  operation: { name: 'setTextAlign', attributes: 'justify' },
})
export const SubscriptControl = createControl({
  label: 'subscriptControlLabel',
  icon: IconSubscript,
  isActive: { name: 'subscript' },
  operation: { name: 'toggleSubscript' },
})
export const SuperscriptControl = createControl({
  label: 'superscriptControlLabel',
  icon: IconSuperscript,
  isActive: { name: 'superscript' },
  operation: { name: 'toggleSuperscript' },
})
export const CodeControl = createControl({
  label: 'codeControlLabel',
  icon: IconCode,
  isActive: { name: 'code' },
  operation: { name: 'toggleCode' },
})
export const CodeBlockControl = createControl({
  label: 'codeBlockControlLabel',
  icon: IconCode,
  isActive: { name: 'codeBlock' },
  operation: { name: 'toggleCodeBlock' },
})
export const HighlightControl = createControl({
  label: 'highlightControlLabel',
  icon: IconHighlight,
  isActive: { name: 'highlight' },
  operation: { name: 'toggleHighlight' },
})
export const HrControl = createControl({
  label: 'hrControlLabel',
  icon: IconLineDashed,
  operation: { name: 'setHorizontalRule' },
})
export const UnsetColorControl = createControl({
  label: 'unsetColorControlLabel',
  icon: IconCircleOff,
  operation: { name: 'unsetColor' },
})
export const UndoControl = createControl({
  label: 'undoControlLabel',
  icon: IconArrowBackUp,
  isDisabled: (editor) => !(editor?.can() as any).undo(),
  operation: { name: 'undo' },
})
export const RedoControl = createControl({
  label: 'redoControlLabel',
  icon: IconArrowForwardUp,
  isDisabled: (editor) => !(editor?.can() as any).redo(),
  operation: { name: 'redo' },
})
export const TaskListControl = createControl({
  label: 'tasksControlLabel',
  icon: IconListCheck,
  isActive: { name: 'taskList' },
  operation: { name: 'toggleTaskList' },
})
export const TaskListSinkControl = createControl({
  label: 'tasksSinkLabel',
  icon: IconIndentIncrease,
  operation: { name: 'sinkListItem', attributes: 'taskItem' },
  isDisabled: (editor) => !editor?.can().sinkListItem('taskItem'),
})
export const TaskListLiftControl = createControl({
  label: 'tasksLiftLabel',
  icon: IconIndentDecrease,
  operation: { name: 'liftListItem', attributes: 'taskItem' },
  isDisabled: (editor) => !editor?.can().liftListItem('taskItem'),
})
