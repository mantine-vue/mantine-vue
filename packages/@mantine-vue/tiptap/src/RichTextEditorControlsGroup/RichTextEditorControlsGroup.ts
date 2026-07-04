import { defineComponent, h } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import classes from '../RichTextEditor.module.css'

export type RichTextEditorControlsGroupStylesNames = 'controlsGroup'
export interface RichTextEditorControlsGroupProps {
  variant?: string
  classNames?: any
  styles?: any
  vars?: any
  [key: string]: any
}

export const RichTextEditorControlsGroup = defineComponent({
  name: 'RichTextEditorControlsGroup',
  inheritAttrs: false,
  props: {
    variant: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<RichTextEditorControlsGroupProps>(
      'RichTextEditorControlsGroup',
      null,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()

    return () =>
      h(
        Box,
        {
          ...attrs,
          variant: props.variant || ctx.variant,
          ...ctx.getStyles('controlsGroup', {
            className: attrs.class,
            style: attrs.style,
            styles: props.styles,
            classNames: props.classNames,
          }),
        },
        slots,
      )
  },
})

Object.assign(RichTextEditorControlsGroup, { classes })
