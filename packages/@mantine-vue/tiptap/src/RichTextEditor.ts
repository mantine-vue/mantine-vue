import { computed, defineComponent, h, type PropType } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { DEFAULT_LABELS, type RichTextEditorLabels } from './labels'
import { provideRichTextEditorContext } from './RichTextEditor.context'
import {
  RichTextEditorContent,
  type RichTextEditorContentProps,
} from './RichTextEditorContent/RichTextEditorContent'
import * as controls from './RichTextEditorControl'
import {
  RichTextEditorControl,
  type RichTextEditorControlProps,
} from './RichTextEditorControl/RichTextEditorControl'
import { RichTextEditorColorControl } from './RichTextEditorControl/RichTextEditorColorControl'
import { RichTextEditorColorPickerControl } from './RichTextEditorControl/RichTextEditorColorPickerControl'
import { RichTextEditorLinkControl } from './RichTextEditorControl/RichTextEditorLinkControl'
import { RichTextEditorSourceCodeControl } from './RichTextEditorControl/RichTextEditorSourceCodeControl'
import {
  RichTextEditorControlsGroup,
  type RichTextEditorControlsGroupProps,
} from './RichTextEditorControlsGroup/RichTextEditorControlsGroup'
import {
  RichTextEditorToolbar,
  type RichTextEditorToolbarProps,
} from './RichTextEditorToolbar/RichTextEditorToolbar'
import classes from './RichTextEditor.module.css'

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

export interface RichTextEditorProps {
  editor: Editor | null
  withCodeHighlightStyles?: boolean
  withTypographyStyles?: boolean
  onSourceCodeTextSwitch?: (isSourceCodeModeActive: boolean) => void
  labels?: Partial<RichTextEditorLabels>
  variant?: RichTextEditorVariant
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  [key: string]: any
}

export interface RichTextEditorFactory {
  props: RichTextEditorProps
  stylesNames: RichTextEditorStylesNames
  variant: RichTextEditorVariant
}

const defaultProps = {
  withCodeHighlightStyles: true,
  withTypographyStyles: true,
  variant: 'default',
} satisfies Partial<RichTextEditorProps>

const RichTextEditorBase = defineComponent({
  name: 'RichTextEditor',
  inheritAttrs: false,
  props: {
    editor: { type: Object as PropType<Editor | null>, default: null },
    withCodeHighlightStyles: { type: Boolean, default: undefined },
    withTypographyStyles: { type: Boolean, default: undefined },
    onSourceCodeTextSwitch: {
      type: Function as PropType<(isSourceCodeModeActive: boolean) => void>,
      default: undefined,
    },
    labels: { type: Object as PropType<Partial<RichTextEditorLabels>>, default: undefined },
    variant: { type: String as PropType<RichTextEditorVariant>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<RichTextEditorProps>('RichTextEditor', defaultProps, rawProps as any)
    const getStyles = useStyles<RichTextEditorFactory>({
      name: 'RichTextEditor',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
    })
    const mergedLabels = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }))

    provideRichTextEditorContext({
      get editor() {
        return props.editor
      },
      getStyles,
      get labels() {
        return mergedLabels.value
      },
      get withCodeHighlightStyles() {
        return props.withCodeHighlightStyles
      },
      get withTypographyStyles() {
        return props.withTypographyStyles
      },
      get onSourceCodeTextSwitch() {
        return props.onSourceCodeTextSwitch
      },
      get unstyled() {
        return props.unstyled
      },
      get variant() {
        return props.variant
      },
    })

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...getStyles('root'),
        },
        slots,
      )
  },
})

export const RichTextEditor = Object.assign(RichTextEditorBase, {
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
  RichTextEditorContentProps,
  RichTextEditorControlProps,
  RichTextEditorControlsGroupProps,
  RichTextEditorToolbarProps,
}
