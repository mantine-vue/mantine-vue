import { defineComponent, h, ref, computed } from 'vue'
import { Box, Checkbox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Checkbox } from '@mantine-vue/core'

const values = ref([
  { label: 'Receive email notifications', checked: false },
  { label: 'Receive sms notifications', checked: false },
  { label: 'Receive push notifications', checked: false },
])

const allChecked = computed(() => values.value.every((v) => v.checked))
const indeterminate = computed(() => values.value.some((v) => v.checked) && !allChecked.value)

const toggleAll = () => {
  const next = !allChecked.value
  values.value = values.value.map((v) => ({ ...v, checked: next }))
}
</script>

<template>
  <div>
    <Checkbox
      :checked="allChecked"
      :indeterminate="indeterminate"
      label="Receive all notifications"
      @change="toggleAll"
    />
    <Checkbox
      v-for="(item, index) in values"
      :key="index"
      mt="xs"
      :ml="33"
      :label="item.label"
      :checked="item.checked"
      @change="(e) => { values[index] = { ...values[index], checked: e.target.checked } }"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxIndeterminateDemo',
  setup() {
    const values = ref([
      { label: 'Receive email notifications', checked: false },
      { label: 'Receive sms notifications', checked: false },
      { label: 'Receive push notifications', checked: false },
    ])

    const allChecked = computed(() => values.value.every((v) => v.checked))
    const indeterminate = computed(() => values.value.some((v) => v.checked) && !allChecked.value)

    const toggleAll = () => {
      const next = !allChecked.value
      values.value = values.value.map((v) => ({ ...v, checked: next }))
    }

    return () =>
      h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () => [
            h(Checkbox, {
              checked: allChecked.value,
              indeterminate: indeterminate.value,
              label: 'Receive all notifications',
              onChange: toggleAll,
            }),
            ...values.value.map((item, index) =>
              h(Checkbox, {
                key: index,
                mt: 'xs',
                ml: 33,
                label: item.label,
                checked: item.checked,
                onChange: (e: Event) => {
                  const checked = (e.target as HTMLInputElement).checked
                  values.value = values.value.map((v, i) => (i === index ? { ...v, checked } : v))
                },
              }),
            ),
          ],
        },
      )
  },
})

export const indeterminate: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
