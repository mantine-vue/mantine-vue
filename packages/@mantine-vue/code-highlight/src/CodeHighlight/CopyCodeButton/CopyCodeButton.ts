import { defineComponent, h } from 'vue'
import { useClipboard } from '@mantine-vue/hooks'
import { CodeHighlightControl } from '../CodeHighlightControl/CodeHighlightControl'
import { CopyIcon } from './CopyIcon'

export const CopyCodeButton = defineComponent({
  name: 'CopyCodeButton',
  props: {
    code: { type: String, required: true },
    copiedLabel: { type: String, default: 'Copied' },
    copyLabel: { type: String, default: 'Copy' },
  },
  setup(props) {
    const clipboard = useClipboard()

    return () =>
      h(
        CodeHighlightControl,
        {
          onClick: () => clipboard.copy(props.code.trim()),
          variant: 'none',
          tooltipLabel: clipboard.copied.value ? props.copiedLabel : props.copyLabel,
          'aria-label': clipboard.copied.value ? props.copiedLabel : `${props.copyLabel} code`,
        },
        () => h(CopyIcon, { copied: clipboard.copied.value }),
      )
  },
})
