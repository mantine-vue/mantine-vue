import { defineComponent, h } from 'vue'
import { Button, ButtonGroup, ButtonGroupSection } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ButtonGroup, ButtonGroupSection } from '@mantine-vue/core'
</script>

<template>
  <ButtonGroup>
    <Button variant="default">First</Button>
    <ButtonGroupSection variant="default" bg="var(--mantine-color-body)">
      x2
    </ButtonGroupSection>
    <Button variant="default">Third</Button>
  </ButtonGroup>
</template>
`

const Demo = defineComponent({
  name: 'ButtonGroupSectionDemo',
  setup: () => () =>
    h(ButtonGroup, null, {
      default: () => [
        h(Button, { variant: 'default' }, { default: () => 'First' }),
        h(
          ButtonGroupSection,
          { variant: 'default', bg: 'var(--mantine-color-body)' },
          { default: () => 'x2' },
        ),
        h(Button, { variant: 'default' }, { default: () => 'Third' }),
      ],
    }),
})

export const groupSection: MantineDemo = { type: 'code', component: Demo, code, centered: true }
