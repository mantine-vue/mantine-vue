import { defineComponent, h } from 'vue'
import { Button, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const dot = () =>
  h('span', {
    'aria-hidden': 'true',
    style:
      'display:inline-block;width:14px;height:14px;border-radius:50%;background:currentColor;opacity:.65',
  })

const code = `
<script setup lang="ts">
import { Button, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Button justify="space-between" full-width>
      <template #leftSection>
        <span
          aria-hidden="true"
          style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: currentColor; opacity: 0.65;"
        />
      </template>

      Button label

      <template #rightSection>
        <span
          aria-hidden="true"
          style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: currentColor; opacity: 0.65;"
        />
      </template>
    </Button>

    <Button justify="space-between" full-width>
      Button label

      <template #rightSection>
        <span
          aria-hidden="true"
          style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: currentColor; opacity: 0.65;"
        />
      </template>
    </Button>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'ButtonSectionsJustifyDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(
          Button,
          {
            justify: 'space-between',
            fullWidth: true,
            leftSection: () => dot(),
            rightSection: () => dot(),
          },
          { default: () => 'Button label' },
        ),
        h(
          Button,
          { justify: 'space-between', fullWidth: true, rightSection: () => dot() },
          { default: () => 'Button label' },
        ),
      ],
    }),
})

export const sectionsJustify: MantineDemo = { type: 'code', component: Demo, code }
