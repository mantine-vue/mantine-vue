import { defineComponent, h, type PropType } from 'vue'
import { Box, rem, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import classes from '../RichTextEditor.module.css'

export type RichTextEditorToolbarStylesNames = 'toolbar'
export interface RichTextEditorToolbarProps {
  sticky?: boolean
  stickyOffset?: string | number
  variant?: string
  classNames?: any
  styles?: any
  vars?: any
  mod?: any
  [key: string]: any
}

export const RichTextEditorToolbar = defineComponent({
  name: 'RichTextEditorToolbar',
  inheritAttrs: false,
  props: {
    sticky: { type: Boolean, default: false },
    stickyOffset: { type: [String, Number] as PropType<string | number>, default: undefined },
    variant: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<RichTextEditorToolbarProps>(
      'RichTextEditorToolbar',
      null,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()

    return () =>
      h(
        Box,
        {
          ...attrs,
          mod: [{ sticky: props.sticky }, props.mod],
          variant: props.variant || ctx.variant,
          ...ctx.getStyles('toolbar', {
            className: attrs.class,
            style: [attrs.style, { '--rte-sticky-offset': rem(props.stickyOffset) }],
            styles: props.styles,
            classNames: props.classNames,
          }),
        },
        slots,
      )
  },
})

Object.assign(RichTextEditorToolbar, { classes })
