import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover, Stack } from '@mantine-vue/core'

const value1 = ref<string | null>('React')
const value2 = ref<string | null>('React')
</script>

<template>
  <Stack>
    <ComboboxPopover
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :value="value1"
      :allow-deselect="false"
      @change="value1 = $event"
    >
      <ComboboxPopover.Target>
        <Button variant="default" :miw="200">{{ value1 || 'Cannot deselect' }}</Button>
      </ComboboxPopover.Target>
    </ComboboxPopover>

    <ComboboxPopover
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :value="value2"
      allow-deselect
      @change="value2 = $event"
    >
      <ComboboxPopover.Target>
        <Button variant="default" :miw="200">{{ value2 || 'Can deselect (default)' }}</Button>
      </ComboboxPopover.Target>
    </ComboboxPopover>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverAllowDeselectDemo',
  setup() {
    const value1 = ref<string | null>('React')
    const value2 = ref<string | null>('React')
    return () =>
      h(Stack, null, () => [
        h(
          ComboboxPopover,
          {
            data: ['React', 'Angular', 'Vue', 'Svelte'],
            value: value1.value,
            allowDeselect: false,
            onChange: (val: string | null) => {
              value1.value = val
            },
          },
          () =>
            h(ComboboxPopover.Target, null, () =>
              h(Button, { variant: 'default', miw: 200 }, () => value1.value || 'Cannot deselect'),
            ),
        ),
        h(
          ComboboxPopover,
          {
            data: ['React', 'Angular', 'Vue', 'Svelte'],
            value: value2.value,
            allowDeselect: true,
            onChange: (val: string | null) => {
              value2.value = val
            },
          },
          () =>
            h(ComboboxPopover.Target, null, () =>
              h(
                Button,
                { variant: 'default', miw: 200 },
                () => value2.value || 'Can deselect (default)',
              ),
            ),
        ),
      ])
  },
})

export const allowDeselect: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
