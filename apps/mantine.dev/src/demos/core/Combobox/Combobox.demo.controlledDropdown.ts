import { defineComponent, h, ref } from 'vue'
import { Button, Combobox, TextInput, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { TextInput, Button, Combobox, useCombobox } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const opened = ref(false)
const combobox = useCombobox({ opened: () => opened.value })
</script>

<template>
  <Button mb="md" @click="opened = !opened">Toggle dropdown</Button>

  <Combobox :store="combobox">
    <Combobox.Target>
      <TextInput
        label="Autocomplete"
        description="Dropdown is opened/closed when button is clicked"
        placeholder="Click button to toggle dropdown"
      />
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Options>
        <Combobox.Option v-for="item in groceries" :key="item" :value="item">
          {{ item }}
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxControlledDropdownDemo',
  setup() {
    const opened = ref(false)
    const combobox = useCombobox({ opened: () => opened.value })

    return () =>
      h('div', [
        h(
          Button,
          { mb: 'md', onClick: () => (opened.value = !opened.value) },
          () => 'Toggle dropdown',
        ),
        h(
          Combobox,
          { store: combobox },
          {
            default: () => [
              h(Combobox.Target, null, {
                default: () =>
                  h(TextInput, {
                    label: 'Autocomplete',
                    description: 'Dropdown is opened/closed when button is clicked',
                    placeholder: 'Click button to toggle dropdown',
                  }),
              }),
              h(Combobox.Dropdown, null, {
                default: () =>
                  h(Combobox.Options, null, {
                    default: () =>
                      groceries.map((item) =>
                        h(Combobox.Option, { value: item, key: item }, () => item),
                      ),
                  }),
              }),
            ],
          },
        ),
      ])
  },
})

export const controlledDropdown: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
}
