import { defineComponent, h } from 'vue'
import { CodeHighlightTabs } from '@mantine-vue/code-highlight'
import type { MantineDemo } from '@/demo'

const tsxCode = `
import { Group, Button, MantineProvider, createTheme } from '@mantine-vue/core'
import classes from './Demo.module.css'

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
})
`

const cssCode = `
.root {
  &[data-variant='danger'] {
    background-color: var(--mantine-color-red-9);
    color: var(--mantine-color-red-0);
  }

  &[data-variant='primary'] {
    background: linear-gradient(45deg, #4b6cb7 10%, #253b67 90%);
    color: var(--mantine-color-white);
  }
}
`

const codeFile = `
export const tsxCode = \`${tsxCode}\`

export const cssCode = \`${cssCode}\`
`

const code = `
<script setup lang="ts">
import { CodeHighlightTabs } from '@mantine-vue/code-highlight'
import { tsxCode, cssCode } from './code'
</script>

<template>
  <CodeHighlightTabs
    with-expand-button
    :default-expanded="false"
    expand-code-label="Show full code"
    collapse-code-label="Show less"
    :code="[
      { fileName: 'Demo.vue', code: tsxCode, language: 'tsx' },
      { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightExpandDemo',
  setup: () => () =>
    h(CodeHighlightTabs, {
      withExpandButton: true,
      defaultExpanded: false,
      expandCodeLabel: 'Show full code',
      collapseCodeLabel: 'Show less',
      code: [
        { fileName: 'Demo.vue', code: tsxCode, language: 'tsx' },
        { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
      ],
    }),
})

export const expand: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'code.ts', code: codeFile, language: 'tsx' },
  ],
}
