import type { MantineThemeOverride } from '@mantine-vue/core'
import { ref } from 'vue'

export const theme: MantineThemeOverride = {
  fontFamilyMonospace: 'Menlo, Monaco, monospace',
}

export const primaryColor = ref('blue')
