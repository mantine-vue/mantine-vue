import { defineComponent, h } from 'vue'
import { Alert } from '@mantine-vue/core'
import { PhInfo } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Alert } from '@mantine-vue/core'
import { PhInfo } from '@phosphor-icons/vue'
</script>

<template>
  <Alert{{props}} :icon="h(PhInfo)">
    {{children}}
  </Alert>
</template>
`

const Wrapper = defineComponent({
  name: 'AlertConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => {
      // The `children` configurator control supplies the Alert's body text,
      // not a real prop - it must be pulled out for the slot and kept out of
      // the props spread onto <Alert>, otherwise it falls through as a raw
      // `children` attribute onto Alert's root <div>, whose DOM `children`
      // property is a read-only getter (Vue throws trying to assign it).
      const { children, ...rest } = attrs as any
      return h(
        Alert,
        { icon: h(PhInfo), ...rest },
        {
          default: () =>
            children ??
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis, quae tempore necessitatibus placeat saepe.',
        },
      )
    }
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 400,
  controls: [
    {
      type: 'select',
      prop: 'variant',
      data: ['filled', 'light', 'outline', 'transparent', 'white', 'default'],
      initialValue: 'light',
      libraryValue: '__none__',
    },
    { type: 'color', prop: 'color', initialValue: 'blue', libraryValue: null },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
    { type: 'boolean', prop: 'withCloseButton', initialValue: false, libraryValue: false },
    { type: 'string', prop: 'title', initialValue: 'Alert title', libraryValue: null },
    {
      type: 'string',
      prop: 'children',
      initialValue:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis, quae tempore necessitatibus placeat saepe.',
      libraryValue: null,
    },
  ],
}
