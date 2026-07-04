import { defineComponent, h } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { Box, Typography, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import classes from '../RichTextEditor.module.css'

export type RichTextEditorContentStylesNames = 'root'
export interface RichTextEditorContentProps {
  classNames?: any
  styles?: any
  vars?: any
  class?: any
  style?: any
  [key: string]: any
}

export const RichTextEditorContent = defineComponent({
  name: 'RichTextEditorContent',
  inheritAttrs: false,
  props: {
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<RichTextEditorContentProps>(
      'RichTextEditorContent',
      null,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()

    return () => {
      const editorContent = h(Box, {
        component: EditorContent,
        editor: ctx.editor,
        ...ctx.getStyles('content', {
          classNames: props.classNames,
          styles: props.styles,
          className: ctx.withTypographyStyles ? undefined : attrs.class,
          style: ctx.withTypographyStyles ? undefined : attrs.style,
        }),
        ...attrs,
      })

      return ctx.withTypographyStyles
        ? h(
            Typography,
            {
              ...ctx.getStyles('Typography', {
                className: attrs.class,
                style: attrs.style,
                styles: props.styles,
                classNames: props.classNames,
              }),
              unstyled: ctx.unstyled,
            },
            () => editorContent,
          )
        : editorContent
    }
  },
})

Object.assign(RichTextEditorContent, { classes })
