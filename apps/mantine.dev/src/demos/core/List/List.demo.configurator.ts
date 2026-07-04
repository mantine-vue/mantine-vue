import { defineComponent, h } from 'vue'
import { List } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { List } from '@mantine-vue/core'
</script>

<template>
  <List{{props}}>
    <List.Item>Clone or download repository from GitHub</List.Item>
    <List.Item>Install dependencies with yarn</List.Item>
    <List.Item>To start development server run npm start command</List.Item>
    <List.Item>Run tests to make sure your changes do not break the build</List.Item>
    <List.Item>Submit a pull request once you are done</List.Item>
  </List>
</template>
`

const Wrapper = defineComponent({
  name: 'ListConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        List,
        { ...(attrs as any) },
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
            h(List.Item, {}, { default: () => 'Submit a pull request once you are done' }),
          ],
        },
      )
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    {
      prop: 'type',
      type: 'segmented',
      data: [
        { value: 'unordered', label: 'Unordered' },
        { value: 'ordered', label: 'Ordered' },
      ],
      initialValue: 'unordered',
      libraryValue: 'unordered',
    },
    { prop: 'size', type: 'size', libraryValue: 'md', initialValue: 'md' },
    { prop: 'withPadding', type: 'boolean', libraryValue: false, initialValue: false },
  ],
}
