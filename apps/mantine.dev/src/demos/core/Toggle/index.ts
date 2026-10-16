import { defineComponent, h } from 'vue'
import { PhTextB, PhTextItalic, PhTextUnderline } from '@phosphor-icons/vue'
import { Group, Toggle } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const icon = (component: any) => h(component, { weight: 'bold', size: '100%' })

export const usage: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    setup: () => () =>
      h(Group, null, () => [
        h(Toggle, { 'aria-label': 'Bold' }, () => icon(PhTextB)),
        h(Toggle, { 'aria-label': 'Italic' }, () => icon(PhTextItalic)),
        h(Toggle, { 'aria-label': 'Underline' }, () => icon(PhTextUnderline)),
      ]),
  }),
  code: `<script setup lang="ts">
import { PhTextB, PhTextItalic, PhTextUnderline } from '@phosphor-icons/vue'
import { Group, Toggle } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Toggle aria-label="Bold"><PhTextB weight="bold" size="100%" /></Toggle>
    <Toggle aria-label="Italic"><PhTextItalic weight="bold" size="100%" /></Toggle>
    <Toggle aria-label="Underline"><PhTextUnderline weight="bold" size="100%" /></Toggle>
  </Group>
</template>`,
}

export const autoContrast: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    setup: () => () =>
      h(Group, null, () => [
        h(
          Toggle,
          {
            active: true,
            variant: 'filled',
            color: 'lime.4',
            'aria-label': 'Without autoContrast',
          },
          () => icon(PhTextB),
        ),
        h(
          Toggle,
          {
            active: true,
            autoContrast: true,
            variant: 'filled',
            color: 'lime.4',
            'aria-label': 'With autoContrast',
          },
          () => icon(PhTextB),
        ),
      ]),
  }),
  code: `<script setup lang="ts">
import { PhTextB } from '@phosphor-icons/vue'
import { Group, Toggle } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Toggle active variant="filled" color="lime.4" aria-label="Without autoContrast">
      <PhTextB weight="bold" size="100%" />
    </Toggle>
    <Toggle autoContrast active variant="filled" color="lime.4" aria-label="With autoContrast">
      <PhTextB weight="bold" size="100%" />
    </Toggle>
  </Group>
</template>`,
}

export const autoWidth: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    setup: () => () =>
      h(Group, null, () => [
        h(Toggle, { autoWidth: true }, () => 'Save'),
        h(Toggle, { autoWidth: true, active: true }, () => 'Active'),
        h(Toggle, { autoWidth: true, disabled: true }, () => 'Disabled'),
      ]),
  }),
  code: `<script setup lang="ts">
import { Group, Toggle } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Toggle autoWidth>Save</Toggle>
    <Toggle autoWidth active>Active</Toggle>
    <Toggle autoWidth disabled>Disabled</Toggle>
  </Group>
</template>`,
}

const Configurator = defineComponent({
  inheritAttrs: false,
  setup:
    (_props, { attrs }) =>
    () =>
      h(Toggle, { ...attrs, 'aria-label': 'Bold' }, () => icon(PhTextB)),
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Configurator,
  centered: true,
  code: `<script setup lang="ts">
import { PhTextB } from '@phosphor-icons/vue'
import { Toggle } from '@mantine-vue/core'
</script>

<template>
  <Toggle{{props}} aria-label="Bold"><PhTextB weight="bold" size="100%" /></Toggle>
</template>`,
  controls: [
    {
      prop: 'variant',
      type: 'segmented',
      data: ['filled', 'light'],
      initialValue: 'filled',
      libraryValue: 'filled',
    },
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: null },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'autoContrast', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'disabled', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}

export const ToggleDemos = { usage, autoContrast, autoWidth, configurator }
