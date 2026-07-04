import { defineComponent, h } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect
    :data="[
      {
        group: 'Frontend libraries',
        items: [
          { label: 'React', value: 'react' },
          { label: 'Angular', value: 'angular' },
          { label: 'Vue', value: 'vue', disabled: true },
        ],
      },
      {
        group: 'Backend libraries',
        items: [
          { label: 'Express', value: 'express' },
          { label: 'Koa', value: 'koa' },
          { label: 'Django', value: 'django' },
        ],
      },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'NativeSelectDataDemo',
  setup: () => () =>
    h(NativeSelect, {
      data: [
        {
          group: 'Frontend libraries',
          items: [
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
            { label: 'Vue', value: 'vue', disabled: true },
          ],
        },
        {
          group: 'Backend libraries',
          items: [
            { label: 'Express', value: 'express' },
            { label: 'Koa', value: 'koa' },
            { label: 'Django', value: 'django' },
          ],
        },
      ],
    }),
})

export const data: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
