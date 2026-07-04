import { defineComponent, h } from 'vue'
import { Box } from '@mantine-vue/core'

export const Content = defineComponent({
  name: 'StepperContent',
  setup(_, { slots }) {
    return () =>
      h(
        Box,
        {
          style: {
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 500,
            fontSize: 'var(--mantine-font-size-lg)',
          },
        },
        slots,
      )
  },
})
