import { defineComponent, h, type PropType } from 'vue'
import { Input } from '@mantine-vue/core'
import { MdxCodeHighlight } from '@/mdx-components/MdxPre'

function getProviderCode(colors: string[]) {
  return (
    `<script setup lang="ts">
import { MantineProvider, type MantineColorsTuple, type MantineThemeOverride } from '@mantine-vue/core'

const myColor: MantineColorsTuple = ${JSON.stringify(colors, null, 2).replace(/"/g, "'")}

const theme: MantineThemeOverride = {
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
}
</` +
    `script>

<template>
  <MantineProvider :theme="theme">
    <!-- Your app here -->
  </MantineProvider>
</template>`
  )
}

export const ColorsOutput = defineComponent({
  name: 'ColorsOutput',
  props: {
    colors: { type: Array as PropType<string[]>, required: true },
  },
  setup(props) {
    return () => {
      // For some reason code highlight does not properly update when colors
      // change without a key.
      const keyBase = JSON.stringify(props.colors)

      return [
        h(Input.Label, { size: 'md', labelElement: 'div', mt: 'xl' }, () => 'Colors array'),

        h(MdxCodeHighlight, {
          key: `${keyBase}-1`,
          language: 'json',
          code: JSON.stringify(props.colors, null, 2),
        }),

        h(
          Input.Label,
          { size: 'md', labelElement: 'div', mt: 'xl' },
          () => 'Usage with MantineProvider',
        ),

        h(MdxCodeHighlight, {
          key: keyBase,
          language: 'vue',
          code: getProviderCode(props.colors),
        }),
      ]
    }
  },
})
