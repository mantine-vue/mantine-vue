import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'

const value = ref<string | null>(null)

const data = [
  { group: 'Frontend', items: ['React', 'Angular', 'Vue'] },
  { group: 'Backend', items: ['Node.js', 'Django', 'Rails'] },
]
</script>

<template>
  <ComboboxPopover :data="data" :value="value" @change="value = $event">
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">{{ value || 'Select technology' }}</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const data = [
  { group: 'Frontend', items: ['React', 'Angular', 'Vue'] },
  { group: 'Backend', items: ['Node.js', 'Django', 'Rails'] },
]

const Demo = defineComponent({
  name: 'ComboboxPopoverGroupsDemo',
  setup() {
    const value = ref<string | null>(null)
    return () =>
      h(
        ComboboxPopover,
        {
          data,
          value: value.value,
          onChange: (val: string | null) => {
            value.value = val
          },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => value.value || 'Select technology'),
          ),
      )
  },
})

export const groups: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
