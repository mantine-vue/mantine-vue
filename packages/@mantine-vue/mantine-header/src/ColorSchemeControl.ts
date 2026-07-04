import { defineComponent, h } from 'vue'
import { useComputedColorScheme, useMantineColorScheme } from '@mantine-vue/core'
import { PhMoon, PhSun } from '@phosphor-icons/vue'
import { HeaderControl } from './HeaderControl'
import classes from './ColorSchemeControl.module.css'

export const ColorSchemeControl = defineComponent({
  name: 'ColorSchemeControl',
  setup() {
    const { setColorScheme } = useMantineColorScheme()
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

    return () =>
      h(
        HeaderControl,
        {
          onClick: () => setColorScheme(computedColorScheme.value === 'light' ? 'dark' : 'light'),
          tooltip: `${computedColorScheme.value === 'dark' ? 'Light' : 'Dark'} mode`,
          'aria-label': 'Toggle color scheme',
        },
        () => [
          h(PhSun, { class: [classes.icon, classes.light] }),
          h(PhMoon, { class: [classes.icon, classes.dark] }),
        ],
      )
  },
})
