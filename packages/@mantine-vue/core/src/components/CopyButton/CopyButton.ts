import { defineComponent } from 'vue'
import { useClipboard } from '@mantine-vue/hooks'
import { useProps } from '../../core'

const defaultProps = {
  timeout: 1000,
}

export const CopyButton = defineComponent({
  name: 'CopyButton',
  props: {
    value: { type: String, required: true },
    timeout: { type: Number, default: undefined },
  },
  setup(rawProps, { slots, attrs }) {
    const props = useProps('CopyButton', defaultProps, rawProps)
    const clipboard = useClipboard({ timeout: props.timeout })
    const copy = () => clipboard.copy(props.value)

    return () =>
      slots.default?.({
        ...attrs,
        copy,
        copied: clipboard.copied.value,
      })
  },
})
