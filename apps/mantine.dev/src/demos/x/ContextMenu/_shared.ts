import { defineComponent, h } from 'vue'
import { Paper, Stack, Text } from '@mantine-vue/core'

export const ContextMenuTarget = defineComponent({
  name: 'ContextMenuTarget',
  inheritAttrs: false,
  props: {
    label: { type: String, default: 'Right-click this area' },
    description: {
      type: String,
      default: 'You can also long-press on a touch device.',
    },
    color: { type: String, default: 'blue' },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        Paper,
        {
          ...attrs,
          withBorder: true,
          radius: 'md',
          p: 'xl',
          style: {
            cursor: 'context-menu',
            userSelect: 'none',
            background: `light-dark(var(--mantine-color-${props.color}-0), var(--mantine-color-dark-6))`,
            borderColor: `var(--mantine-color-${props.color}-3)`,
            textAlign: 'center',
          },
        },
        () =>
          h(Stack, { gap: 4, align: 'center' }, () => [
            h(Text, { fw: 600 }, () => props.label),
            h(Text, { size: 'sm', c: 'dimmed' }, () => props.description),
          ]),
      )
  },
})
