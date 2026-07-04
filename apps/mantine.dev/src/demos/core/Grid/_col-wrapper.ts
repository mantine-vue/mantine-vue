import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'

// Styled wrapper for Grid.Col used in demos to make columns visually distinct.
export const ColWrapper = defineComponent({
  name: 'ColWrapper',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () =>
      h(
        Grid.Col,
        { ...attrs },
        {
          default: () =>
            h(
              'div',
              {
                style: {
                  padding: '4px 0',
                  background: 'var(--mantine-color-blue-light)',
                  borderRadius: 'var(--mantine-radius-sm)',
                  textAlign: 'center',
                  fontWeight: 500,
                },
              },
              slots.default?.(),
            ),
        },
      )
  },
})
