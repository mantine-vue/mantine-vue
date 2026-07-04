import { defineComponent, h, type PropType } from 'vue'
import { ColorSwatch, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import { RichTextEditorControl } from './RichTextEditorControl'

export interface RichTextEditorColorControlProps {
  color: string
  [key: string]: any
}

export const RichTextEditorColorControl = defineComponent({
  name: 'RichTextEditorColorControl',
  inheritAttrs: false,
  props: {
    color: { type: String, required: true },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<RichTextEditorColorControlProps>(
      'RichTextEditorColorControl',
      null,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()

    return () => {
      const currentColor = ctx.editor?.getAttributes('textStyle').color || null
      const label = ctx.labels.colorControlLabel(props.color)

      return h(
        RichTextEditorControl,
        {
          ...attrs,
          variant: ctx.variant,
          active: currentColor === props.color,
          'aria-label': label,
          title: label,
          onClick: () => (ctx.editor?.chain() as any)?.focus().setColor(props.color).run(),
        },
        () => h(ColorSwatch, { color: props.color, size: 14 }),
      )
    }
  },
})
