import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useComputedColorScheme, useDirection, useMantineColorScheme } from '@mantine-vue/core'
import { useHotkeys } from '@mantine-vue/hooks'

const EXCLUDE_RTL = ['/combobox']

export const HotKeysHandler = defineComponent({
  name: 'HotKeysHandler',
  setup() {
    const route = useRoute()
    const { setColorScheme } = useMantineColorScheme()
    const { toggleDirection } = useDirection()
    const computedColorScheme = useComputedColorScheme('light')

    useHotkeys(
      [
        ['mod + J', () => setColorScheme(computedColorScheme.value === 'light' ? 'dark' : 'light')],
        ['mod + shift + L', () => !EXCLUDE_RTL.includes(route.path) && toggleDirection()],
      ],
      [],
    )

    return () => null
  },
})
