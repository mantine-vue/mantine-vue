import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'

const value = ref<string[]>([])
</script>

<template>
  <ComboboxPopover
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :value="value"
    multiple
    @change="value = $event"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">
        {{ value.length > 0 ? value.join(', ') : 'Select frameworks' }}
      </Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverMultipleDemo',
  setup() {
    const value = ref<string[]>([])
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          value: value.value,
          multiple: true,
          onChange: (val: string[]) => {
            value.value = val
          },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () =>
              value.value.length > 0 ? value.value.join(', ') : 'Select frameworks',
            ),
          ),
      )
  },
})

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
