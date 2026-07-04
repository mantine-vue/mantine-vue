import { defineComponent, h, ref } from 'vue'
import { rem, useProps } from '@mantine-vue/core'
import { IconBraces } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import { RichTextEditorControl } from './RichTextEditorControl'

export interface RichTextEditorSourceCodeControlProps {
  [key: string]: any
}

export const RichTextEditorSourceCodeControl = defineComponent({
  name: 'RichTextEditorSourceCodeControl',
  inheritAttrs: false,
  setup(rawProps, { attrs }) {
    useProps<RichTextEditorSourceCodeControlProps>(
      'RichTextEditorSourceCodeControl',
      {},
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()
    const isSourceCodeModeActive = ref(false)

    const handleStateChange = () => {
      if (isSourceCodeModeActive.value) {
        ctx.editor?.commands.setContent(ctx.editor.getText(), { emitUpdate: true })
      } else {
        ctx.editor?.commands.setContent(`<textarea>${ctx.editor.getHTML()}</textarea>`)
      }

      isSourceCodeModeActive.value = !isSourceCodeModeActive.value
      ctx.onSourceCodeTextSwitch?.(isSourceCodeModeActive.value)
    }

    return () =>
      h(
        RichTextEditorControl,
        {
          ...attrs,
          variant: ctx.variant,
          active: isSourceCodeModeActive.value,
          'aria-label': ctx.labels.sourceCodeControlLabel,
          title: ctx.labels.sourceCodeControlLabel,
          onClick: handleStateChange,
        },
        () => h(IconBraces, { style: { width: rem(16), height: rem(16) } }),
      )
  },
})
