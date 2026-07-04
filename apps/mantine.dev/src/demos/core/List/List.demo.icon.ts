import { defineComponent, h } from 'vue'
import { PhCheckCircle, PhCircleDashed } from '@phosphor-icons/vue'
import { List, ThemeIcon } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCheckCircle, PhCircleDashed } from '@phosphor-icons/vue'
import { List, ThemeIcon } from '@mantine-vue/core'
</script>

<template>
  <List
    spacing="xs"
    size="sm"
    center
    :icon="() => h(ThemeIcon, { color: 'teal', size: 24, radius: 'xl' }, { default: () => h(PhCheckCircle, { size: 16 }) })"
  >
    <List.Item>Clone or download repository from GitHub</List.Item>
    <List.Item>Install dependencies with yarn</List.Item>
    <List.Item>To start development server run npm start command</List.Item>
    <List.Item>Run tests to make sure your changes do not break the build</List.Item>
    <List.Item
      :icon="() => h(ThemeIcon, { color: 'blue', size: 24, radius: 'xl' }, { default: () => h(PhCircleDashed, { size: 16 }) })"
    >
      Submit a pull request once you are done
    </List.Item>
  </List>
</template>
`

const Demo = defineComponent({
  name: 'ListIconDemo',
  setup() {
    const defaultIcon = () =>
      h(
        ThemeIcon,
        { color: 'teal', size: 24, radius: 'xl' },
        {
          default: () => h(PhCheckCircle, { size: 16 }),
        },
      )

    const pendingIcon = () =>
      h(
        ThemeIcon,
        { color: 'blue', size: 24, radius: 'xl' },
        {
          default: () => h(PhCircleDashed, { size: 16 }),
        },
      )

    return () =>
      h(
        List,
        { spacing: 'xs', size: 'sm', center: true, icon: defaultIcon },
        {
          default: () => [
            h(List.Item, {}, { default: () => 'Clone or download repository from GitHub' }),
            h(List.Item, {}, { default: () => 'Install dependencies with yarn' }),
            h(
              List.Item,
              {},
              { default: () => 'To start development server run npm start command' },
            ),
            h(
              List.Item,
              {},
              { default: () => 'Run tests to make sure your changes do not break the build' },
            ),
            h(
              List.Item,
              { icon: pendingIcon },
              { default: () => 'Submit a pull request once you are done' },
            ),
          ],
        },
      )
  },
})

export const icon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 500,
}
