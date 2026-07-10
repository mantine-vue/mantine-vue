import { defineComponent, h, ref, type PropType } from 'vue'
import { Group, Stack } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

// `loop` is read once when `useRovingIndex` is set up (it is not a reactive
// MaybeRefOrGetter option like `total`/`columns`/`focusedIndex`), so toggling
// it at runtime requires re-creating the hook instance - here that is done by
// keying the toolbar component with the current `loop` value.
const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Group, Stack } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'

const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth']
const loop = ref(true)
</script>

<template>
  <Stack>
    <label style="display: flex; align-items: center; gap: 8px;">
      <input type="checkbox" v-model="loop" />
      Loop navigation
    </label>
    <!-- loop is read once per hook instance, key by its value to re-create -->
    <RovingToolbar :key="loop" :loop="loop" />
  </Stack>
</template>

<!-- RovingToolbar.vue -->
<script setup lang="ts">
import { Group } from '@mantine-vue/core'
import { useRovingIndex } from '@mantine-vue/hooks'

const props = defineProps<{ loop: boolean }>()
const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth']
const { getItemProps } = useRovingIndex({
  total: items.length,
  orientation: 'horizontal',
  loop: props.loop,
})
</script>

<template>
  <Group gap="xs">
    <button
      v-for="(item, index) in items"
      :key="item"
      type="button"
      v-bind="getItemProps({ index })"
      style="padding: 6px 12px; border-radius: var(--mantine-radius-sm); border: 1px solid var(--mantine-color-default-border); background-color: var(--mantine-color-default); cursor: pointer;"
    >
      {{ item }}
    </button>
  </Group>
</template>
`

const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth']

const btnStyle = {
  padding: '6px 12px',
  borderRadius: 'var(--mantine-radius-sm)',
  border: '1px solid var(--mantine-color-default-border)',
  backgroundColor: 'var(--mantine-color-default)',
  cursor: 'pointer',
}

const RovingToolbar = defineComponent({
  name: 'RovingToolbar',
  props: { loop: { type: Boolean as PropType<boolean>, required: true } },
  setup(props) {
    const { getItemProps } = useRovingIndex({
      total: items.length,
      orientation: 'horizontal',
      loop: props.loop,
    })

    return () =>
      h(
        Group,
        { gap: 'xs' },
        {
          default: () =>
            items.map((item, index) =>
              h('button', { type: 'button', style: btnStyle, ...getItemProps({ index }) }, item),
            ),
        },
      )
  },
})

const Demo = defineComponent({
  name: 'UseRovingIndexLoopDemo',
  setup() {
    const loop = ref(true)

    return () =>
      h(Stack, null, {
        default: () => [
          h('label', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            h('input', {
              type: 'checkbox',
              checked: loop.value,
              onChange: (event: Event) => {
                loop.value = (event.target as HTMLInputElement).checked
              },
            }),
            'Loop navigation',
          ]),
          h(RovingToolbar, { key: String(loop.value), loop: loop.value }),
        ],
      })
  },
})

export const loop: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
