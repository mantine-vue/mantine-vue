import { defineComponent, h } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect label="With dividers">
    <option>Select library</option>

    <hr />

    <optgroup label="Frontend libraries">
      <option value="react">React</option>
      <option value="angular">Angular</option>
      <option value="vue">Vue</option>
    </optgroup>

    <hr />

    <optgroup label="Backend libraries">
      <option value="express">Express</option>
      <option value="koa">Koa</option>
      <option value="django">Django</option>
    </optgroup>
  </NativeSelect>
</template>
`

const Demo = defineComponent({
  name: 'NativeSelectDividersDemo',
  setup: () => () =>
    h(
      NativeSelect,
      { label: 'With dividers' },
      {
        default: () => [
          h('option', null, 'Select library'),
          h('hr'),
          h('optgroup', { label: 'Frontend libraries' }, [
            h('option', { value: 'react' }, 'React'),
            h('option', { value: 'angular' }, 'Angular'),
            h('option', { value: 'vue' }, 'Vue'),
          ]),
          h('hr'),
          h('optgroup', { label: 'Backend libraries' }, [
            h('option', { value: 'express' }, 'Express'),
            h('option', { value: 'koa' }, 'Koa'),
            h('option', { value: 'django' }, 'Django'),
          ]),
        ],
      },
    ),
})

export const dividers: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
