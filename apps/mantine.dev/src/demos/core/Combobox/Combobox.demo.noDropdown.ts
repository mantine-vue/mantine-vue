import { defineComponent, h, ref } from 'vue'
import { Combobox, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Combobox, TextInput } from '@mantine-vue/core'

const value = ref('')
</script>

<template>
  <Combobox @option-submit="(val) => (value = val)">
    <Combobox.EventsTarget>
      <TextInput
        placeholder="Pick value"
        :value="value"
        @input="(event) => (value = event.currentTarget.value)"
      />
    </Combobox.EventsTarget>

    <Combobox.Options mt="sm">
      <Combobox.Option value="First">First</Combobox.Option>
      <Combobox.Option value="Second">Second</Combobox.Option>
      <Combobox.Option value="Third">Third</Combobox.Option>
    </Combobox.Options>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxNoDropdownDemo',
  setup() {
    const value = ref('')

    return () =>
      h(
        Combobox,
        { onOptionSubmit: (val: string) => (value.value = val) },
        {
          default: () => [
            h(Combobox.EventsTarget, null, {
              default: () =>
                h(TextInput, {
                  placeholder: 'Pick value',
                  value: value.value,
                  onInput: (event: Event) => {
                    value.value = (event.currentTarget as HTMLInputElement).value
                  },
                }),
            }),
            h(
              Combobox.Options,
              { mt: 'sm' },
              {
                default: () => [
                  h(Combobox.Option, { value: 'First' }, () => 'First'),
                  h(Combobox.Option, { value: 'Second' }, () => 'Second'),
                  h(Combobox.Option, { value: 'Third' }, () => 'Third'),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const noDropdown: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
  defaultExpanded: false,
}
