import { defineComponent, h } from 'vue'
import { rem, useDirection } from '@mantine-vue/core'
import { PhTextAlignLeft, PhTextAlignRight } from '@phosphor-icons/vue'
import { HeaderControl } from './HeaderControl'

export const DirectionControl = defineComponent({
  name: 'DirectionControl',
  setup() {
    const { toggleDirection, dir } = useDirection()

    return () =>
      h(
        HeaderControl,
        {
          onClick: () => toggleDirection(),
          tooltip: `${dir.value === 'ltr' ? 'RTL' : 'LTR'} direction`,
        },
        () =>
          h(dir.value === 'rtl' ? PhTextAlignLeft : PhTextAlignRight, {
            style: { width: rem(22), height: rem(22), pointerEvents: 'none' },
          }),
      )
  },
})
