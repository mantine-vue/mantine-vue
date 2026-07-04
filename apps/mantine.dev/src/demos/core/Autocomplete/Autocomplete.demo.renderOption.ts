import { defineComponent, h } from 'vue'
import { Autocomplete, Avatar, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete, Avatar, Group, Text } from '@mantine-vue/core'

const usersData: Record<string, { image: string; email: string }> = {
  'Emily Johnson': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
    email: 'emily92@gmail.com',
  },
  'Ava Rodriguez': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
    email: 'ava_rose@gmail.com',
  },
  'Olivia Chen': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
    email: 'livvy_globe@gmail.com',
  },
  'Ethan Barnes': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    email: 'ethan_explorer@gmail.com',
  },
  'Mason Taylor': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    email: 'mason_musician@gmail.com',
  },
}

const renderOption = ({ option }: { option: { value: string } }) =>
  h(Group, { gap: 'sm' }, () => [
    h(Avatar, { src: usersData[option.value].image, size: 36, radius: 'xl' }),
    h('div', null, [
      h(Text, { size: 'sm' }, () => option.value),
      h(Text, { size: 'xs', opacity: 0.5 }, () => usersData[option.value].email),
    ]),
  ])
</script>

<template>
  <Autocomplete
    :data="['Emily Johnson', 'Ava Rodriguez', 'Olivia Chen', 'Ethan Barnes', 'Mason Taylor']"
    :render-option="renderOption"
    :max-dropdown-height="300"
    label="Employee of the month"
    placeholder="Search for employee"
  />
</template>
`

const usersData: Record<string, { image: string; email: string }> = {
  'Emily Johnson': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
    email: 'emily92@gmail.com',
  },
  'Ava Rodriguez': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
    email: 'ava_rose@gmail.com',
  },
  'Olivia Chen': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
    email: 'livvy_globe@gmail.com',
  },
  'Ethan Barnes': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    email: 'ethan_explorer@gmail.com',
  },
  'Mason Taylor': {
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    email: 'mason_musician@gmail.com',
  },
}

const renderOptionFn = ({ option }: { option: { value: string } }) =>
  h(Group, { gap: 'sm' }, () => [
    h(Avatar, { src: usersData[option.value].image, size: 36, radius: 'xl' }),
    h('div', null, [
      h(Text, { size: 'sm' }, () => option.value),
      h(Text, { size: 'xs', opacity: 0.5 }, () => usersData[option.value].email),
    ]),
  ])

const Demo = defineComponent({
  name: 'AutocompleteRenderOptionDemo',
  setup: () => () =>
    h(Autocomplete, {
      data: ['Emily Johnson', 'Ava Rodriguez', 'Olivia Chen', 'Ethan Barnes', 'Mason Taylor'],
      renderOption: renderOptionFn,
      maxDropdownHeight: 300,
      label: 'Employee of the month',
      placeholder: 'Search for employee',
    }),
})

export const renderOption: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
  defaultExpanded: false,
}
