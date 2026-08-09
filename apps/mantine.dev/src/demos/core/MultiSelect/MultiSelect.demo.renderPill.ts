import { defineComponent, h } from 'vue'
import { Avatar, MultiSelect, Pill } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect, Pill, Avatar } from '@mantine-vue/core'

const users = [
  { value: 'Emily Johnson', label: 'Emily Johnson', image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png' },
  { value: 'Ava Rodriguez', label: 'Ava Rodriguez', image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png' },
  { value: 'Olivia Chen', label: 'Olivia Chen', image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png' },
  { value: 'Ethan Barnes', label: 'Ethan Barnes', image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png' },
  { value: 'Mason Taylor', label: 'Mason Taylor', image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png' },
]

const usersMap = new Map(users.map((user) => [user.value, user]))

</script>

<template>
  <MultiSelect
    :data="users"
    label="Candidates"
    placeholder="Select candidates"
    :default-value="['Emily Johnson', 'Ava Rodriguez']"
  >
    <template #renderPill="{ option, onRemove }">
      <Pill with-remove-button :style="{ paddingInlineStart: '2px' }" @remove="onRemove">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
          <Avatar :src="usersMap.get(option?.value)?.image" :size="16" />
          <span>{{ option?.label }}</span>
        </div>
      </Pill>
    </template>
  </MultiSelect>
</template>
`

const users = [
  {
    value: 'Emily Johnson',
    label: 'Emily Johnson',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
  },
  {
    value: 'Ava Rodriguez',
    label: 'Ava Rodriguez',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
  },
  {
    value: 'Olivia Chen',
    label: 'Olivia Chen',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
  },
  {
    value: 'Ethan Barnes',
    label: 'Ethan Barnes',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
  },
  {
    value: 'Mason Taylor',
    label: 'Mason Taylor',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
  },
]

const usersMap = new Map(users.map((user) => [user.value, user]))

const renderPillFn = ({
  option,
  onRemove,
}: {
  option: { value: string; label: string }
  onRemove: () => void
}) => {
  const user = usersMap.get(option?.value)
  return h(Pill, { withRemoveButton: true, onRemove, style: { paddingInlineStart: '2px' } }, () =>
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
      h(Avatar, { src: user?.image, size: 16 }),
      option?.label,
    ]),
  )
}

const Demo = defineComponent({
  name: 'MultiSelectRenderPillDemo',
  setup: () => () =>
    h(MultiSelect, {
      data: users,
      label: 'Candidates',
      placeholder: 'Select candidates',
      defaultValue: ['Emily Johnson', 'Ava Rodriguez'],
      renderPill: renderPillFn,
    }),
})

export const renderPill: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
