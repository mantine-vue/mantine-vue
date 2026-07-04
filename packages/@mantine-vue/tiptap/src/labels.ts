export interface RichTextEditorLabels {
  boldControlLabel: string
  hrControlLabel: string
  italicControlLabel: string
  underlineControlLabel: string
  strikeControlLabel: string
  clearFormattingControlLabel: string
  linkControlLabel: string
  unlinkControlLabel: string
  bulletListControlLabel: string
  orderedListControlLabel: string
  h1ControlLabel: string
  h2ControlLabel: string
  h3ControlLabel: string
  h4ControlLabel: string
  h5ControlLabel: string
  h6ControlLabel: string
  blockquoteControlLabel: string
  alignLeftControlLabel: string
  alignCenterControlLabel: string
  alignRightControlLabel: string
  alignJustifyControlLabel: string
  codeControlLabel: string
  codeBlockControlLabel: string
  subscriptControlLabel: string
  superscriptControlLabel: string
  colorPickerControlLabel: string
  unsetColorControlLabel: string
  highlightControlLabel: string
  undoControlLabel: string
  redoControlLabel: string
  colorControlLabel: (color: string) => string
  sourceCodeControlLabel: string
  linkEditorInputLabel: string
  linkEditorInputPlaceholder: string
  linkEditorExternalLink: string
  linkEditorInternalLink: string
  linkEditorSave: string
  colorPickerCancel: string
  colorPickerClear: string
  colorPickerColorPicker: string
  colorPickerPalette: string
  colorPickerSave: string
  colorPickerColorLabel: (color: string) => string
  tasksControlLabel: string
  tasksSinkLabel: string
  tasksLiftLabel: string
}

export const DEFAULT_LABELS: RichTextEditorLabels = {
  linkControlLabel: 'Link',
  colorPickerControlLabel: 'Text color',
  highlightControlLabel: 'Highlight text',
  colorControlLabel: (color) => `Set text color ${color}`,
  boldControlLabel: 'Bold',
  italicControlLabel: 'Italic',
  underlineControlLabel: 'Underline',
  strikeControlLabel: 'Strikethrough',
  clearFormattingControlLabel: 'Clear formatting',
  unlinkControlLabel: 'Remove link',
  bulletListControlLabel: 'Bullet list',
  orderedListControlLabel: 'Ordered list',
  sourceCodeControlLabel: 'Switch between text/source code',
  h1ControlLabel: 'Heading 1',
  h2ControlLabel: 'Heading 2',
  h3ControlLabel: 'Heading 3',
  h4ControlLabel: 'Heading 4',
  h5ControlLabel: 'Heading 5',
  h6ControlLabel: 'Heading 6',
  blockquoteControlLabel: 'Blockquote',
  alignLeftControlLabel: 'Align text: left',
  alignCenterControlLabel: 'Align text: center',
  alignRightControlLabel: 'Align text: right',
  alignJustifyControlLabel: 'Align text: justify',
  codeControlLabel: 'Code',
  codeBlockControlLabel: 'Code block',
  subscriptControlLabel: 'Subscript',
  superscriptControlLabel: 'Superscript',
  unsetColorControlLabel: 'Unset color',
  hrControlLabel: 'Horizontal line',
  undoControlLabel: 'Undo',
  redoControlLabel: 'Redo',
  tasksControlLabel: 'Task list',
  tasksSinkLabel: 'Decrease task level',
  tasksLiftLabel: 'Increase task level',
  linkEditorInputLabel: 'Enter URL',
  linkEditorInputPlaceholder: 'https://example.com/',
  linkEditorExternalLink: 'Open link in a new tab',
  linkEditorInternalLink: 'Open link in the same tab',
  linkEditorSave: 'Save',
  colorPickerCancel: 'Cancel',
  colorPickerClear: 'Clear color',
  colorPickerColorPicker: 'Color picker',
  colorPickerPalette: 'Color palette',
  colorPickerSave: 'Save',
  colorPickerColorLabel: (color) => `Set text color ${color}`,
}
